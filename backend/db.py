import os
import uuid
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    # Use native UUID type on Postgres, otherwise fall back to a 36-char string
    if engine.dialect.name == 'postgresql':
        id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    else:
        id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    position = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    password = Column(String, nullable=True)
    role = Column(String, nullable=True)
    
    # Reporting relationship: employee reports to a manager
    if engine.dialect.name == 'postgresql':
        reports_to_id = Column(PG_UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    else:
        reports_to_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    
    # Relationship to access the manager (self-referential)
    # Note: We'll define this after the class to avoid forward reference issues


from password_utils import hash_password

# Define the self-referential relationship after the class
# This allows employees to have a manager and managers to have direct reports
User.manager = relationship(
    'User',
    remote_side=[User.id],
    foreign_keys=[User.reports_to_id],
    backref='direct_reports'
)


def init_db():
    Base.metadata.create_all(bind=engine)
    # seed initial data if empty
    with SessionLocal() as session:
        cnt = session.query(User).count()
        if cnt == 0:
            # Create manager first (Alice - HR Manager)
            a = User(name="Alice Johnson", position="HR Manager", role="HR")
            session.add(a)
            session.flush()  # Flush to get the ID
            
            # Create employees who report to Alice
            demo = User(
                name="Alex Morgan",
                email="alex@example.com",
                position="HR Specialist",
                date_of_birth="1990-05-20",
                address="123 Main St, Springfield, USA",
                phone="+1 (555) 123-4567",
                start_date="2022-02-14",
                password=hash_password("password"),
                role="HR",
                reports_to_id=a.id,
            )
            b = User(name="Bob Smith", position="Engineer", role="Engineering", reports_to_id=a.id)
            session.add_all([demo, b])
            session.commit()
