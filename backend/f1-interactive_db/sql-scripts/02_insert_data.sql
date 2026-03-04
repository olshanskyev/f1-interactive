\connect __DATABASE_NAME__

-- Insert initial admin user (password placeholder will be substituted)
INSERT INTO __DATABASE_SCHEMA__.users (name, password, roles) values ('admin', '__ADMIN_PWD__', 'ADMIN');
