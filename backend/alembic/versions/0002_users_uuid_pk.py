"""convert users id to uuid pk

Revision ID: 0002_users_uuid_pk
Revises: 0001_initial
Create Date: 2026-01-11 00:00:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0002_users_uuid_pk'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name

    # Postgres: add a UUID column, populate, replace PK
    if dialect == 'postgresql':
        # ensure uuid generator is available
        op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
        op.add_column('users', sa.Column('id_new', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')))
        # populate any existing rows (server_default handles new inserts)
        op.execute('UPDATE users SET id_new = gen_random_uuid() WHERE id_new IS NULL;')
        # drop existing PK, remove old id column, rename new one and set PK
        op.drop_constraint('users_pkey', 'users', type_='primary')
        op.drop_column('users', 'id')
        op.execute('ALTER TABLE users RENAME COLUMN id_new TO id;')
        op.create_primary_key('users_pkey', 'users', ['id'])

    else:
        # SQLite or other: rebuild table to have string UUID primary key
        op.create_table(
            'users_new',
            sa.Column('id', sa.String(length=36), primary_key=True),
            sa.Column('name', sa.String(), nullable=False),
            sa.Column('email', sa.String(), nullable=True),
            sa.Column('position', sa.String(), nullable=True),
            sa.Column('date_of_birth', sa.String(), nullable=True),
            sa.Column('address', sa.String(), nullable=True),
            sa.Column('phone', sa.String(), nullable=True),
            sa.Column('start_date', sa.String(), nullable=True),
            sa.Column('password', sa.String(), nullable=True),
            sa.Column('role', sa.String(), nullable=True),
        )

        # copy data into new table with generated UUIDs
        rows = conn.execute(text('SELECT id, name, email, position, date_of_birth, address, phone, start_date, password, role FROM users')).fetchall()
        import uuid
        for r in rows:
            new_id = str(uuid.uuid4())
            conn.execute(text(
                'INSERT INTO users_new (id, name, email, position, date_of_birth, address, phone, start_date, password, role)'
                ' VALUES (:id, :name, :email, :position, :date_of_birth, :address, :phone, :start_date, :password, :role)'
            ), {
                'id': new_id,
                'name': r['name'] if 'name' in r.keys() else r[1],
                'email': r['email'] if 'email' in r.keys() else r[2],
                'position': r['position'] if 'position' in r.keys() else r[3],
                'date_of_birth': r['date_of_birth'] if 'date_of_birth' in r.keys() else r[4],
                'address': r['address'] if 'address' in r.keys() else r[5],
                'phone': r['phone'] if 'phone' in r.keys() else r[6],
                'start_date': r['start_date'] if 'start_date' in r.keys() else r[7],
                'password': r['password'] if 'password' in r.keys() else r[8],
                'role': r['role'] if 'role' in r.keys() else r[9],
            })

        op.drop_table('users')
        op.rename_table('users_new', 'users')


def downgrade():
    raise NotImplementedError('Downgrade from UUID primary key to integer is not supported automatically.')
