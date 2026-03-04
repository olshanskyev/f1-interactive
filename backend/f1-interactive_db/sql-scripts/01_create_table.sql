-- Create schema owned by the runtime Postgres user (substituted from POSTGRES_USER)
-- The official Postgres image runs init scripts connected to the DB from `POSTGRES_DB`.
CREATE SCHEMA IF NOT EXISTS __DATABASE_SCHEMA__ AUTHORIZATION __POSTGRES_USER__;
drop table if exists __DATABASE_SCHEMA__.users cascade;

CREATE TABLE __DATABASE_SCHEMA__.users (
    id bigserial NOT NULL,
    "name" varchar(256) NULL,
    "password" varchar(256) NULL,
    roles varchar(256) NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
