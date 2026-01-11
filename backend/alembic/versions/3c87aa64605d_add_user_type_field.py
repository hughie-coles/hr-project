"""Generate a migration.

Revision ID: 3c87aa64605d
Revises: 4b18fbfbc80e
Create Date: 2026-01-11 01:21:04.546391
"""

from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = '3c87aa64605d'
down_revision = '4b18fbfbc80e'
branch_labels = None
depends_on = None


def upgrade():
    # Add user_type column with default 'user'
    op.add_column('users', sa.Column('user_type', sa.String(), nullable=False, server_default='user'))
    
    # Update CEO to admin
    op.execute("UPDATE users SET user_type = 'admin' WHERE position LIKE '%CEO%'")


def downgrade():
    op.drop_column('users', 'user_type')
