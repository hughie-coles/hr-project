# Makefile for backend dev tasks
.PHONY: alembic-upgrade alembic-stamp alembic-current install

# Use poetry run to ensure virtualenv environment
alembic-upgrade:
	DATABASE_URL=${DATABASE_URL} poetry run alembic upgrade head

alembic-stamp:
	DATABASE_URL=${DATABASE_URL} poetry run alembic stamp head

alembic-current:
	DATABASE_URL=${DATABASE_URL} poetry run alembic current

install:
	poetry install
