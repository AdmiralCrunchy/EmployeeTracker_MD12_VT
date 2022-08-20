USE employee_db;

SELECT firstName AS name,
FROM employees
JOIN title on roles.id = employees.id
JOIN roles on employees.id = roles.id;