INSERT INTO department (department_name)
VALUES  ('Default_Department'),
        ('Sanitation'),
        ('Legal'),
        ('Engineering'),
        ('Human Resources'),
        ('Information Technology'),
        ('Research & Devleopment');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Default_Role', 120000, 1),
        ('Janitor', 25000, 2),
        ('Junior Paralegal', 100000, 3),
        ('Hardware Engineer', 250000, 4),
        ('Human Resources Expert', 50000, 5),
        ('Lead Tech', 100000, 6),
        ('Lead Biological Engineer', 80000, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_id, department_id)
VALUES  ('Tom', 'Riddle', 1, NULL, 1),
        ('Dean', 'Winchester',2, NULL, 2),
        ('Sam', 'Winchester', 3, NULL, 3),
        ('Jack', 'Sparrow', 4, NULL, 4),
        ('John', 'Connar', 5, NULL, 5),
        ('Darth', 'Vader', 6, NULL, 6),
        ('Rocky', 'Balboa', 7, NULL, 7),
        ('Dirk','Diggler', 1, 1, 1),
        ('Joe', 'Mama', 2, 2, 2),
        ('Bart', 'Simpson',  3, 3, 3),
        ('Lisa', 'Simpson',  4, 4, 4),
        ('Marge', 'Simpson',  5, 5, 5),
        ('Homer', 'Simpson',  6, 6, 6),
        ('Maggie', 'Simpson',  7, 7, 7),
        ('Marty', 'McFly',  1, 1, 1),
        ('Kevin', 'McCallister',  2, 2, 2),
        ('Ace', 'Ventura',  3, 3, 3),
        ('Tommy', 'Vercetti',  4, 4, 4),
        ('Whoopi', 'Goldberg',  5, 5, 5),
        ('John', 'Malkovich',  6, 6, 6),
        ('Willy', 'Wonka',  7, 7, 7);