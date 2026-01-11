"""change file_path to s3_key

Revision ID: 5a1b2c3d4e5f
Revises: 4b18fbfbc80e
Create Date: 2026-01-11 01:32:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a1b2c3d4e5f'
down_revision = '3c87aa64605d'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    # Check if resources table exists and has file_path column
    inspector = sa.inspect(conn)
    if 'resources' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('resources')]
        
        if 'file_path' in columns and 's3_key' not in columns:
            # Rename file_path to s3_key
            op.alter_column('resources', 'file_path', new_column_name='s3_key')
        elif 'file_path' in columns and 's3_key' in columns:
            # Both exist, drop file_path
            op.drop_column('resources', 'file_path')
        elif 's3_key' not in columns:
            # Only s3_key doesn't exist, add it (nullable first)
            op.add_column('resources', sa.Column('s3_key', sa.String(), nullable=True))
            # If file_path exists, drop it
            if 'file_path' in columns:
                op.drop_column('resources', 'file_path')
            # Make s3_key non-nullable after migration
            op.alter_column('resources', 's3_key', nullable=False)


def downgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    inspector = sa.inspect(conn)
    if 'resources' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('resources')]
        
        if 's3_key' in columns and 'file_path' not in columns:
            # Rename s3_key back to file_path
            op.alter_column('resources', 's3_key', new_column_name='file_path')
        elif 's3_key' in columns and 'file_path' in columns:
            # Both exist, drop s3_key
            op.drop_column('resources', 's3_key')
        elif 'file_path' not in columns:
            # Only file_path doesn't exist, add it
            op.add_column('resources', sa.Column('file_path', sa.String(), nullable=True))
            # If s3_key exists, we could migrate data here
            if 's3_key' in columns:
                op.drop_column('resources', 's3_key')
            # Make file_path non-nullable after migration
            op.alter_column('resources', 'file_path', nullable=False)
