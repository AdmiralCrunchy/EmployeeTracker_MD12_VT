INSERT INTO department (department_name)
VALUES  ('Default_Department'),
        ('Sanitation'),
        ('Legal'),
        ('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Default_Role', 120000, 1),
        ('Junior Paralegal', 100000, 1),
        ('Janitor', 25000, 2),
        ('Hardware Engineer', 250000,3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Tom', 'Riddle', 1, NULL),
        ('Sam', 'Winchester', 2, NULL),
        ('Dirk','Diggler', 2, 1),
        ('Joe', 'Mama', 2, 2);