"""add resources table

Revision ID: 4b18fbfbc80e
Revises: 9fd18f46b682
Create Date: 2026-01-11 01:16:17.332491
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '4b18fbfbc80e'
down_revision = '9fd18f46b682'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    if dialect == 'postgresql':
        op.create_table(
            'resources',
            sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column('filename', sa.String(), nullable=False),
            sa.Column('original_filename', sa.String(), nullable=False),
            sa.Column('file_path', sa.String(), nullable=False),
            sa.Column('file_size', sa.Integer(), nullable=False),
            sa.Column('uploaded_by_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('description', sa.String(), nullable=True),
        )
    else:
        op.create_table(
            'resources',
            sa.Column('id', sa.String(length=36), primary_key=True),
            sa.Column('filename', sa.String(), nullable=False),
            sa.Column('original_filename', sa.String(), nullable=False),
            sa.Column('file_path', sa.String(), nullable=False),
            sa.Column('file_size', sa.Integer(), nullable=False),
            sa.Column('uploaded_by_id', sa.String(length=36), sa.ForeignKey('users.id'), nullable=True),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('description', sa.String(), nullable=True),
        )


def downgrade():
    op.drop_table('resources')
