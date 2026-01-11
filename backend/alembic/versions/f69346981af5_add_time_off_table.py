"""Generate a migration.

Revision ID: f69346981af5
Revises: 5a1b2c3d4e5f
Create Date: 2026-01-11 04:39:49.793246
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'f69346981af5'
down_revision = '5a1b2c3d4e5f'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    if dialect == 'postgresql':
        op.create_table(
            'time_off',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('start_date', sa.String(), nullable=False),
            sa.Column('end_date', sa.String(), nullable=False),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('status', sa.String(), nullable=False, server_default='pending'),
            sa.Column('notes', sa.String(), nullable=True),
        )
    else:
        op.create_table(
            'time_off',
            sa.Column('id', sa.String(length=36), primary_key=True),
            sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('start_date', sa.String(), nullable=False),
            sa.Column('end_date', sa.String(), nullable=False),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('status', sa.String(), nullable=False, server_default='pending'),
            sa.Column('notes', sa.String(), nullable=True),
        )


def downgrade():
    op.drop_table('time_off')
