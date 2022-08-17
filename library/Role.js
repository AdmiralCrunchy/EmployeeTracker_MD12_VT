class Role {
    constructor(roleName, salary, departName){
        this.roleName = roleName;
        this.salary = salary;
        this.departName = departName;
    }
    getRoleName(){
        return this.roleName;
    }
    getSalary(){
        return this.salary;
    }
    getDepartName(){
        return this.departName;
    }
}

module.exports = Role;