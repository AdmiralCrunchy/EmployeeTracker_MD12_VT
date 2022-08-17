class Employee {
    constructor(firstName, lastName, roleName, managerName){
        this.firstName = firstName;
        this.lastName = lastName;
        this. roleName = roleName;
        this.managerName = managerName;
    }
    getFirstName(){
        return this.firstName;
    }
    getLastName(){
        return this.lastName;
    }
    getRoleName(){
        return this.roleName;
    }
    getManagerName(){
        return this.managerName;
    }
}

module.exports = Employee;