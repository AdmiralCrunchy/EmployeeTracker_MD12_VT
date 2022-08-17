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
                console.logs("Let's take them to the grindstone.")
                deleteTeams();
                break;
            default:
                console.log("Have a nice day Goodbye!")
        }
    })
}

//functions that 

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
    const department = selectDepartment();
    const depart_Roles = department.map(x=> {name: x.department_name; value: x.id} );

    inquirer.prompt([
        {
            name:"manager",
            type:"list",
            message:"What department are we using for the search?",
            choices: manager_Employee,
        },
    ]).then(answers=>{
        viewTeams();
    })
}

async function viewEmpManager()
{   
    let managers = [];
    console.log("Mangers Step 1:",managers)
    managers = await selectManagers();
    console.log("Mangers Step 2:",managers)
    // const manager_Employee = managers.map(x=> {name: `${x.first_name} ${x.last_name}`; value: x.id});
    // console.log(manager_Employee);

    inquirer.prompt([
        {
            name:"manager",
            type:"list",
            message:"What manager are we using for the search?",
            choices: ["Hello", "Butter", "Kelp"],
            // choices: manager_Employee,
        },
    ]).then(answers=>{
        viewTeams();
        console.log(' ')
        console.log("Mangers Step 3:",managers)
    })


}

function viewEmpAll()
{
    const sql = `SELECT * FROM employee`;
  
    db.query(sql, function (err, data) {
        console.log(' ');
        console.table(data);
        console.log(' ');
    });

    console.log("This is running!")

        viewTeams();
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
         db.query('INSERT INTO department (department_name) VALUES(?);',
         [`${answers.departName}`], (err, result) =>{
            if(err){console.log(err)}
            else{
            console.log(`You created the ${answers.departName}`)
            createTeam();}
         })
    })
}

async function selectDepartment(){
    
    const sql = `SELECT id, department_name FROM department`
    let answer = await runSelect(sql);
    return answer
}

function runSelect(sql){

    let data = null;
    console.log("We are making it to runSelect");
    db.query(sql, (err, rows) => {
        console.log("You are getting your Data:", rows)
        return data = rows
      })

}

function createRole(){
    
    const department = selectDepartment();
    console.log("The answer that we are looking for is :", department);
    const depart_Roles = department.map(x=> {name: x.department_name; value: x.id} );
    
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
            choices: depart_Roles
        },
    ]).then(answers=>{
        db.query('INSERT INTO roles (title, salary, department_id) VALUES(?,?,?);',
        [`${answers.roleName}, ${answers.Salary}, ${answers.depart}`], (err, result) =>{
            if(err){console.log(err)}
            else{
                console.log(`You created the new role: ${answers.roleName}.`) 
                createTeam();
            } 
        })
        
        
    })

}

function selectRoles(){
    const sql = `SELECT id, title FROM roles`

    return runSelect(sql);
}

function selectManagers(){
    const sql = `SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`

    return runSelect(sql);
}


function createEmployee(){
  
// const roles = selectRoles();
// const roles_Employee = roles.map(x=> {name: `${x.title}`; value: x.id} );
// const managers = selectManagers();
// const manager_Employee = managers.map(x=> {name: `${x.first_name} ${x.last_name}`; value: x.id});


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
            name:"role",
            type:"list",
            message:"What role is this associated with?",
            choices: roles_Employee,
        },
        {
            name:"manager",
            type:"list",
            message:"What manager is associated with this employee?",
            choices: manager_Employee,
        },
    ]).then(answers=>{
        
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",
        [`${answers.empFirstName}, ${answer.empLastName}, ${answer.role}, ${answer.manager}`], (err, result)=> {
            if (err) {console.log(err)}
            else{console.log(`Employee ${answers.empFirstName} ${answers.empLastName} has been added to the database.` )}
        })
        createTeam()
    })
}

function updateDepartment(){

}

function updateRole(){

}

function updateManager(){

}



function deleteTeams() {
    startMenu();
}




startMenu()