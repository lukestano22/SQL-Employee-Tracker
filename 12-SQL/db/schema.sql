DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

\c tracker_db;

CREATE TABLE department(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    salary INT,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    jobs_id INT,
    FOREIGN KEY (jobs_id)
    REFERENCES jobs(id)
    ON DELETE SET NULL
);