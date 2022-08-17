INSERT INTO department (department_name)
VALUES  ("Default_Department"),
        ("Sanitation"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Default_Role", 120000, 1),
        ("Junior Paralegal", 100000, 2),
        ("Janitor", 25000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Tom", "Riddle", 1, NULL),
        ("Sam", "Winchester", 2, Null),
        ("Dirk","Diggler", 3, );