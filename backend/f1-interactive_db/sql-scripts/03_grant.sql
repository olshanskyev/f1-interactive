-- Minimal default-privilege rules for the runtime Postgres user
-- These run against the `POSTGRES_DB` database the official image created.
ALTER DEFAULT PRIVILEGES IN SCHEMA __DATABASE_SCHEMA__ GRANT ALL ON TABLES TO __POSTGRES_USER__;
ALTER DEFAULT PRIVILEGES IN SCHEMA __DATABASE_SCHEMA__ GRANT USAGE, SELECT ON SEQUENCES TO __POSTGRES_USER__;
