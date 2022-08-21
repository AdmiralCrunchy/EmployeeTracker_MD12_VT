 const inquirer = require("inquirer");
const fs = require("fs");

const Department = require("./library/Department");
const Role = require("./library/Role");
const Employee = require("./library/Employee");

const mysql = require("mysql2");
const express = require("express");
const { config } = require("process");
const syncSql = require('sync-sql');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'ArrieBaby@2',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

function startMenu() {
    inquirer.prompt([
        {
            name:"progStart",
            type:"list",
            message: "What would we like to do today?",
            choices: ["View Teams","Create/Update Teams","Delete Teams", "Quit"]
        }
    ]).then(answer => {
        switch(answer.progStart){
            case "View Teams":
                console.log("Let's take a look.")
                viewTeams();
                break;
            case "Create/Update Teams":
                console.log("Let's make some modifications.")
                modifyTeams();
                break;
            case "Delete Teams":
                console.log("Let's take them to the grindstone.")
                deleteTeams();
                break;
            default:
                console.log("Have a nice day Goodbye!")
        }
    })
}
//--------------------------//
//-                        -//
//        VIEW TEAMS        //
//-                        -//
//--------------------------//

function viewTeams() {
    inquirer.prompt([
        {
            name:"choice",
            type:"list",
            message:"Which avenue would you like to view the employees by?",
            choices:["View by Manager", "View by Department", "View Entire Staff", "Exit Menu"]
        }
    ]).then(answer => {
        switch(answer.choice){
            case "View by Manager":
                console.log("Taking a look by manager")
                viewEmpManager();
                break;
            case "View by Department":
                console.log("Taking a look by Department")
                viewEmpDepartment();
                break;
            case "View Entire Staff":
                console.log("Taking a look at everyone!")
                viewEmpAll();
                break;
            default:
                console.log("Heading back to main menu.")
                startMenu()
        }
    })
}

function viewEmpDepartment()
{
    db.query("SELECT id AS value, department_name AS name FROM department", (err, employ_Department)=>{
        inquirer.prompt([
            {
                name:"department",
                type:"list",
                message:"What department are we using for the search?",
                choices: employ_Department,
            },
        ]).then(answers=>{
            db.query(`SELECT * FROM employees WHERE department_id = ${answers.department}`, (err, employees)=>{
                console.log(' ');
                console.table(employees);
                console.log(' ');
                viewTeams();
            })
        })
    })      
}

function viewEmpManager()
{   
    db.query("SELECT id AS value, first_Name AS name FROM employees WHERE manager_id IS NULL", (err, employ_Managers)=>{
        inquirer.prompt([
            {
                name:"manager",
                type:"list",
                message:"What manager are we using for the search?",
                choices: employ_Managers,
            },
        ]).then(answers=>{
            console.log(answers.manager);
            db.query(`SELECT * FROM employees WHERE manager_id = ${answers.manager}`, (err, employees)=>{
                console.log(' ');               
                console.table(employees);               
                console.log(' '); 
                viewTeams();              
            })
            
        })
    })    
}

function viewEmpAll()
{
    db.query("SELECT * FROM employees", (err, employees)=>{
        console.log(' ');
        console.table(employees);
        console.log(' ');
        viewTeams();
    })
}

function modifyTeams() 
{
    inquirer.prompt([
        {
            name:"choices",
            type:"list",
            message:"Would you like to create a new team or update an existing one?",
            choices:["Create New Team", "Update Existing Team", "Back"]
        }
    ]).then(answer =>{
        switch(answer.choices){
            case "Create New Team":
                console.log("Let make a new team!")
                createTeam();
                break;
            case "Update Existing Team":
                console.log("Lets change a few things.")
                updateTeam();
                break;
            default:
                console.log("Heading back to the main menu.");
                startMenu();
        }
    })
}

//--------------------------//
//-                        -//
//       CREATE TEAMS       //
//-                        -//
//--------------------------//

function createTeam(){
    inquirer.prompt([
        {
            name:"Choices",
            type:"list",
            message:"What are we looking to add today?",
            choices:["Department", "Role", "Employee", "Back"]
        }
    ]).then(answer =>{
        switch(answer.Choices){
            case "Department":
                console.log("Brand new department; Solid.")
                createDepartment();
                break;
            case "Role":
                console.log("Brand new role; Nice!")
                createRole();
                break;
            case "Employee":
                console.log("Hooray a new Hire!")
                createEmployee();
                break;
            default:
                console.log("Going back to previous menu.");
                modifyTeams();
        }
    })
}

function createDepartment(){
    
    inquirer.prompt([
        {
            name:"departName",
            type:"input",
            message:"What is the name of the Department?"
        },
    ]).then(answers=>{
         db.query('INSERT INTO department (department_name) VALUES (?)',
         [answers.departName], (err, result) =>{
            if(err){console.log(err)}
            else{
                console.log(`You created the ${answers.departName} department!`);
                createTeam();
            }
         })
    })
}

function createRole(){
    
    db.query('SELECT id AS value, department_Name AS name FROM department', (err, departments)=>{
        inquirer.prompt([
            {
                name:"roleName",
                type:"input",
                message:"What is the name of the Role?"
            },
            {
                name:"Salary",
                type:"input",
                message:"What is the expected salary?"
            },
            {
                name:"depart",
                type:"list",
                message:"What department is this associated with?",
                choices: departments
            },
        ]).then(answers=>{
            db.query('INSERT INTO roles (title, salary, department_id) VALUES(?,?,?);',
            [answers.roleName, answers.Salary, answers.depart], (err, result) =>{
                if(err){console.log(err)}
                else{
                    console.log(`You created the new role: ${result}.`) 
                    createTeam();
                } 
            }) 
        })
    })
}

function createEmployee(){
  
    db.query(`SELECT id AS value, department_name AS name FROM department`, (err, departments)=>{
        db.query(`SELECT id AS value, title AS name FROM roles`, (err, roles)=>{
            db.query(`SELECT id AS value, first_Name AS name FROM employees WHERE manager_id IS NULL`, (err, managers)=>{
                inquirer.prompt([
                    {
                        name:"empFirstName",
                        type:"input",
                        message:"What is the first name of the Employee?"
                    },
                    {
                        name:"empLastName",
                        type:"input",
                        message:"What is the last name of the Employee?"
                    },
                    {
                        name:"departments",
                        type:"list",
                        message:"What department is associated with this employee?",
                        choices: departments,
                    },
                    {
                        name:"roles",
                        type:"list",
                        message:"What role is this associated with?",
                        choices: roles,
                    },
                    {
                        name:"managers",
                        type:"list",
                        message:"What manager is associated with this employee?",
                        choices: managers,
                    },
                ]).then(answer=>{
                    
                    db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id, department_id) VALUES (?,?,?,?,?)",
                    [answer.empFirstName, answer.empLastName, answer.roles, answer.managers, answer.departments], (err, result)=> {
                        if (err) {console.log(err)}
                        else{console.log(`Employee ${answer.empFirstName} ${answer.empLastName} has been added to the database.` )}
                        createTeam()
                    })
                    
                })
            })
        })  
    })

    
}

//--------------------------//
//-                        -//
//       UPDATE TEAMS       //
//-                        -//
//--------------------------//


function updateTeam(){
    inquirer.prompt([
        {
            name: "selection",
            type: "list",
            message: "What would you like to update?",
            choices: ["Department", "Role", "Employee","Back"]
        }
    ]).then (answer=>{
        switch(answer.selection)
        {
            case "Department":
                updateDepartment();
                break;
            case "Role":
                updateRole();
                break;
            case "Employee":
                updateEmployee();
                break;
            case "Back":
                modifyTeams();
                break;
            default:
                break;
        }
    })
}

function updateDepartment(){
    db.query('SELECT id AS value, department_Name AS name FROM department', (err, departments)=>{
        inquirer.prompt([
            {
                name:"depart",
                type:"list",
                message:"What department would you like to update?",
                choices: departments
            },
            {
                name:"newName",
                type:"input",
                message:"What is the new name for this department?", 
            }
        ]).then (answer=>{
            db.query(`UPDATE department SET department_name = '${answer.newName}' WHERE id = ${answer.depart}`, (err, newDepart)=>{
                console.table(newDepart)
                console.log(`Department name has been changed to ${answer.newName}`);
                updateTeam();
            })
        })
    })
}

function updateRole(){
    db.query('SELECT id AS value, title AS name FROM roles', (err, roles)=>{
        inquirer.prompt([
            {
                name:"roles",
                type:"list",
                message:"What department would you like to update?",
                choices: roles
            },
            {
                name:"newName",
                type:"input",
                message:"What is the new name for this department?", 
            },
        ]).then (answer=>{
            db.query(`UPDATE roles SET title = '${answer.newName}' WHERE id = ${answer.roles}`, (err, newRole)=>{
                console.log(`Role name has been changed to ${answer.newName}`);
                updateTeam();
            })
        })
    })
}

function updateEmployee(){
    inquirer.prompt([
        {
            name: "employeeChoice",
            type: "list",
            message: "What part of employee would you like to update?",
            choices: ["Department", "Role", "Manager", "Back"]
        }
    ]).then(answer=>{
        switch(answer.employeeChoice){
            case "Department":
                updateEmployee_D();
                break;
            case "Role":
                updateEmployee_R();
                break;
            case "Manager":
                updateEmployee_M();
                break;
            case "Back":
                updateTeam();
                break;
            default:
                break;
        }
    })
}

function updateEmployee_D(){
    db.query('SELECT id AS value, department_Name AS name FROM department', (err, departments)=>{
        inquirer.prompt([
            {
                name:"depart",
                type:"list",
                message:"What department are they from?",
                choices: departments
            }
        ]).then(answer=>{
            db.query(`SELECT id AS value, first_Name AS name FROM employees WHERE department_id = ${answer.depart}`, (err, choice)=>{
                inquirer.prompt([
                    {
                        name:"employee",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: choice
                    }
                ]).then(answerEmp=>{
                    db.query('SELECT id AS value, department_Name AS name FROM department', (err, newDepart)=>{
                        inquirer.prompt([
                            {
                                name:"newDepart",
                                type:"list",
                                message:"What department are they from?",
                                choices: newDepart,
                            }
                        ]).then(answer=>{
                            db.query(`UPDATE employees SET department_id = '${answer.newDepart}' WHERE id = ${answerEmp.choice}`, (err, finish)=>{
                                console.log("Employee is in a new Department")
                                updateEmployee()
                            })
                        })
                    })
                })
            })
        })
    })
}
function updateEmployee_R(){
    
}
function updateEmployee_M(){
    db.query('SELECT id AS value, first_Name AS name FROM employees WHERE manager_id IS NULL', (err, managers)=>{
        inquirer.prompt([
            {
                name:"manager",
                type:"list",
                message:"What manager do they have?",
                choices: managers
            }
        ]).then(answer=>{
            db.query(`SELECT id AS value, first_Name AS name FROM employees WHERE manager_id = ${answer.manager}`, (err, choice)=>{
                inquirer.prompt([
                    {
                        name:"employee",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: choice
                    }
                ]).then(answerEmp=>{
                    db.query('SELECT id AS value, first_Name AS name FROM employees WHERE manager_id IS NULL', (err, newManager)=>{
                        inquirer.prompt([
                            {
                                name:"newManager",
                                type:"list",
                                message:"Who is their new Manager?",
                                choices: newManager,
                            }
                        ]).then(answer=>{
                            console.log("Does this even work?", answerEmp.employee)
                            db.query(`UPDATE employees SET manager_id = '${answer.newManager}' WHERE id = ${answerEmp.employee}`, (err, finish)=>{
                                console.log("Employee has a new Manager")
                                updateEmployee()
                            })
                        })
                    })
                })
            })
        })
    })
}

//--------------------------//
//-                        -//
//       DELETE TEAMS       //
//-                        -//
//--------------------------//

function deleteTeams() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "What would you like to delete today?",
            choices: ["Department", "Role", "Employee", "Back"]
        }
    ]).then(answer=>{
        switch(answer.choice)
        {
            case "Department":
                deleteDepartment();
                break;
            case "Role" :
                deleteRole();
                break;
            case "Employee":
                deleteEmployee();
                break;
            case "Back":
                startMenu();
                break;
        }
    })
}

function deleteDepartment() {
    db.query('SELECT id AS value, department_Name AS name FROM department', (err, departments)=>{
        inquirer.prompt([
            {
                name:"depart",
                type:"list",
                message:"What department would you like to delete?",
                choices: departments
            },
        ]).then(answer=>{
            db.query(`DELETE FROM department WHERE id = ${answer.depart}`, (err, gonzo)=>{
                console.log("The department has been destroyed.");
                deleteTeams()
            })
        })
    })
}

function deleteRole() {
    db.query('SELECT id AS value, title AS name FROM roles', (err, roles)=>{
        inquirer.prompt([
            {
                name:"roles",
                type:"list",
                message:"What role would you like to delete?",
                choices: roles
            },
        ]).then(answer=>{
            db.query(`DELETE FROM roles WHERE id = ${answer.roles}`, (err, gonzo)=>{
                console.log("The role has been destroyed.");
                deleteTeams()
            })
        })
    })
}

function deleteEmployee(){
    db.query('SELECT id AS value, department_Name AS name FROM department', (err, departments)=>{
        inquirer.prompt([
            {
                name:"depart",
                type:"list",
                message:"What department is the Employee From?",
                choices: departments
            },
        ]).then(answer=>{
            db.query(`SELECT id AS value, title AS name FROM roles WHERE department_id = ${answer.depart}`, (err, roles)=>{
                inquirer.prompt([
                    {
                        name:"roles",
                        type:"list",
                        message:"What role does the Employee have?",
                        choices: roles
                    },
                ]).then(answer=>{
                    db.query(`SELECT id AS value, first_Name AS name FROM employees WHERE role_id = ${answer.roles}`, (err, employees)=>{
                        inquirer.prompt([
                            {
                                name:"employees",
                                type:"list",
                                message:"Choose who to execute?",
                                choices: employees
                            },
                        ]).then(answer=>{
                            db.query(`DELETE FROM employees WHERE id = ${answer.employees}`, (err, gonzo)=>{
                                console.log("The employee has been destroyed, hope you are happy.");
                                deleteTeams()
                            })
                        })
                    })
                })
            })
        })
    })
}



startMenu()