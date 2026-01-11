"""initial migration

Revision ID: 0001_initial
Revises: 
Create Date: 2026-01-10 00:00:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
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


def downgrade():
    op.drop_table('users')
