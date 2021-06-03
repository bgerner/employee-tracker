INSERT INTO department (name)
VALUES ('Tech'),
('Sales'),
('Design'),
('Management');

INSERT INTO role (name, salary, department_id)
VALUES ('Technical Support', 100.00, 1),
('Salesman', 200.00, 2),
('Graphic Desginer', 150.00, 3),
('Manager', 300.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ronald', 'Firbank', 4, NULL),
('Virginia', 'Woolf', 4, NULL),
('Piers', 'Gaveston', 3, 1),
('Charles', 'LeRoi', 2, 1),
('Katherine', 'Mansfield', 1, 1),
('Dora', 'Carrington', 3, 2),
('Edward', 'Bellamy', 2, 2),
('Montague', 'Summers', 1, 1),
('Octavia', 'Butler', 1, 1),
('Unica', 'Zurn', 1, 2);