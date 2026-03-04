\connect __DATABASE_NAME__

CREATE SCHEMA IF NOT EXISTS __DATABASE_SCHEMA__;
drop table if exists __DATABASE_SCHEMA__.users cascade;

CREATE TABLE __DATABASE_SCHEMA__.users (
    id bigserial NOT NULL,
    "name" varchar(256) NULL,
    "password" varchar(256) NULL,
    roles varchar(256) NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
