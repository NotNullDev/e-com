create database e_com;

CREATE ROLE e_com LOGIN;
ALTER USER e_com WITH PASSWORD 'e_com';

ALTER DATABASE e_com OWNER TO e_com;

\c e_com
ALTER SCHEMA public OWNER TO e_com;
\c e_com
GRANT ALL on schema public to e_com;