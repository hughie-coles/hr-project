"""Generate a migration.

Revision ID: d2acfc720a47
Revises: f69346981af5
Create Date: 2026-01-11 04:46:17.154368
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'd2acfc720a47'
down_revision = 'f69346981af5'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    if dialect == 'postgresql':
        op.create_table(
            'notifications',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('message', sa.String(), nullable=False),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('read', sa.String(), nullable=False, server_default='false'),
            sa.Column('type', sa.String(), nullable=True),
            sa.Column('link', sa.String(), nullable=True),
        )
    else:
        op.create_table(
            'notifications',
            sa.Column('id', sa.String(length=36), primary_key=True),
            sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('message', sa.String(), nullable=False),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('read', sa.String(), nullable=False, server_default='false'),
            sa.Column('type', sa.String(), nullable=True),
            sa.Column('link', sa.String(), nullable=True),
        )


def downgrade():
    op.drop_table('notifications')
