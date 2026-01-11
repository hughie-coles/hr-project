"""add reports_to relationship

Revision ID: 9fd18f46b682
Revises: 0002_users_uuid_pk
Create Date: 2026-01-11 00:47:14.608356
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '9fd18f46b682'
down_revision = '0002_users_uuid_pk'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    if dialect == 'postgresql':
        # Add reports_to_id column as UUID with foreign key
        op.add_column('users', sa.Column('reports_to_id', postgresql.UUID(as_uuid=True), nullable=True))
        op.create_foreign_key('fk_users_reports_to', 'users', 'users', ['reports_to_id'], ['id'])
    else:
        # SQLite or other: use string UUID
        op.add_column('users', sa.Column('reports_to_id', sa.String(length=36), nullable=True))
        op.create_foreign_key('fk_users_reports_to', 'users', 'users', ['reports_to_id'], ['id'])


def downgrade():
    op.drop_constraint('fk_users_reports_to', 'users', type_='foreignkey')
    op.drop_column('users', 'reports_to_id')
