-- Create the database user, password, database, and schema
-- Placeholders will be replaced by the docker entrypoint wrapper
CREATE USER __DATABASE_USER__ WITH PASSWORD '__DATABASE_PASSWORD__';
CREATE DATABASE __DATABASE_NAME__ OWNER __DATABASE_USER__;
\connect __DATABASE_NAME__
CREATE SCHEMA IF NOT EXISTS __DATABASE_SCHEMA__ AUTHORIZATION __DATABASE_USER__;
