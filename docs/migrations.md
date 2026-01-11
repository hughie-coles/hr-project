# Database migrations (Alembic)

Quick guide for local development:

- Stamp database (mark current DB as at head without applying migrations):

  export DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/hrdb"
  cd backend
  make alembic-stamp

- Apply migrations to a (fresh) DB:

  # create a fresh DB in the running Postgres container:
  docker compose exec db createdb -U postgres hrdb_migration

  # apply migrations to that DB
  export DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/hrdb_migration"
  cd backend
  make alembic-upgrade

- Check current revision:

  make alembic-current

Notes:
- We use `postgresql+psycopg://` to ensure SQLAlchemy uses the installed `psycopg`/`psycopg2` driver.
- If your production driver is `psycopg3` (package `psycopg`), no changes are needed; add `psycopg2-binary` only if you explicitly want the `psycopg2` driver.
