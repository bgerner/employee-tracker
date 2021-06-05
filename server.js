const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const db = require("./db/connection");
const cTable = require("console.table");

// following 3 funcs for update employee

const getEmployees = function () {
  const sql = `SELECT CONCAT(first_name, ' ', last_name) AS employee, id as id FROM employee;`;

  return db.promise().query(sql);
};

const getRoles = function () {
  const sql = `SELECT name AS role, id AS id FROM role;`;

  return db.promise().query(sql);
};

const updateEmployee = function (employee, role) {
    const roleId = role.chooseRole;
    const employeeId = employee.chooseEmployee;

    const sql = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err)
            return;
        }
        console.log(`Changed role!`)
        form();
    })
};

const allDept = function () {
  const sql = `SELECT * FROM department;`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(result);
    form();
  });
};

const allRoles = function () {
  const sql = `SELECT role.id, role.name, role.salary, department.name as dept FROM role
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY salary;`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(result);
    form();
  });
};

const allEmployees = function () {
  const sql = `SELECT 
    employee.id,
    employee.first_name, 
    employee.last_name, 
    role.name AS title,
    role.salary as salary,
    department.name as dept,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY last_name;`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(result);
    form();
  });
};

const form = function () {
  inquirer
    .prompt({
      type: "list",
      name: "q",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "quit",
      ],
    })
    .then((answer) => {
      if (answer.q === "View All Departments") {
        allDept();
      } else if (answer.q === "View All Roles") {
        allRoles();
      } else if (answer.q === "View All Employees") {
        allEmployees();
      } else if (answer.q === "Add a department") {
        inquirer
          .prompt({
            type: "input",
            name: "dept",
            message: "What is the department name?",
          })
          .then((deptInfo) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = deptInfo.dept;

            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(`Added ${deptInfo.dept} to departments!`);
              form();
            });
          });
      } else if (answer.q === "Add a role") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "What is the role name?",
            },
            {
              type: "input",
              name: "salary",
              message: "What is the annual salary for this role?",
            },
            {
              type: "input",
              name: "department",
              message:
                "Enter the id for the department that this role belongs to",
            },
          ])
          .then((roleInfo) => {
            const sql = `INSERT INTO role (name, salary, department_id)
            VALUES (?,?,?)`;
            const params = [
              roleInfo.name,
              roleInfo.salary,
              roleInfo.department,
            ];

            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(`Added ${roleInfo.name} to roles!`);
              form();
            });
          });
      } else if (answer.q === "Add an employee") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What is the employee's last name?",
            },
            {
              type: "input",
              name: "role",
              message: "What is the employee's role id?",
            },
            {
              type: "input",
              name: "manager",
              message: "What is the employee's manager id?",
            },
          ])
          .then((employeeInfo) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?,?,?,?)`;
            const params = [
              employeeInfo.first_name,
              employeeInfo.last_name,
              employeeInfo.role,
              employeeInfo.manager,
            ];

            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(
                `Added new employee: ${employeeInfo.first_name}` +
                  " " +
                  `${employeeInfo.last_name}`
              );
              form();
            });
          });
      } else if (answer.q === "Update an employee role") {
        getEmployees().then(([employees]) => {
          const employeeChoices = employees.map(({ employee, id }) => ({
            name: `${employee}`,
            value: `${id}`
          }));

          inquirer
            .prompt({
              type: "list",
              name: "chooseEmployee",
              message: "Which employee's role would you like to update?",
              choices: employeeChoices,
            })
            .then((chosenEmployee) => {
              let employee = chosenEmployee;
              getRoles()
                .then(([roles]) => {
                  const roleChoices = roles.map(({ role, id }) => ({
                    name: `${role}`,
                    value: `${id}`
                  }));
                  inquirer.prompt({
                    type: "list",
                    name: "chooseRole",
                    message:
                      "Select the role that you would like to assign this employee to",
                    choices: roleChoices,
                  }).then(role => updateEmployee(employee, role));
                })
            });
        });
      } else if (answer.q === "quit") {
        process.exit();
      }
    });
};

form();
