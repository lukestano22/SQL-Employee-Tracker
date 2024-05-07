INSERT INTO department(name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Pirate');

INSERT INTO jobs(title, salary, department_id)
VALUES
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Swordsman', 1000000, 5),
    ('Lawyer', 190000, 4);

INSERT INTO employee(first_name, last_name, jobs_id)
VALUES
    ('Mike', 'Wazowski', 1),
    ('Heinz', 'Doofenshmirtz', 2),
    ('Kevin', 'Malone', 5),
    ('Joseph', 'Biden', 6),
    ('Roronoa', 'Zoro', 7),
    ('Tad', 'Strange', 8),
    ('Tom', 'Hanks', 3),
    ('Bob', 'Duncan', 4);
