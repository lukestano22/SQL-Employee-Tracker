const inquirer = require('inquirer')
const { Pool } = require("pg")

const pool = new Pool(
    {
      user: 'postgres',
      password: 'Fr00tl00ps',
      host: 'localhost',
      database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
)
pool.connect()

async function viewDepartments() {
    try{
    const query = 'SELECT department.id AS id, department.name AS name FROM department'
    const result = await pool.query(query);
    return result.rows;
    } catch (error) {
        console.error('Error retrieving data:', error);
        return [];
    }
}

async function viewAllRoles() {
    try {
      const query = `
        SELECT jobs.id AS id,
               jobs.title AS title,
               jobs.salary AS salary,
               department.name AS department
        FROM jobs
        INNER JOIN department ON jobs.department_id = department.id;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error retrieving roles:', error);
      return [];
    }
  }

async function viewEmployees() {
    try{
        const query = 
        `SELECT 
            employee.id AS id,
            employee.first_name AS first_name,
            employee.last_name AS last_name,
            jobs.title AS title,
            department.name AS department,
            jobs.salary AS salary
        FROM 
            employee
        INNER JOIN 
            jobs ON employee.jobs_id = jobs.id
        INNER JOIN 
            department ON jobs.department_id = department.id;`
        const result = await pool.query(query)
        return result.rows
    } catch (error){
        console.error('Error retrieving data:', error)
        return []
    }
}
async function addDepartment() {
    try {
        const departmentInfo = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter department name:'
            }
        ]);

        const query = 'INSERT INTO department (name) VALUES ($1)';
        const values = [departmentInfo.name];
        await pool.query(query, values);

        console.log('Department added successfully!');
    } catch (error) {
        console.error('Error adding department:', error);
    }
}
async function addRole(){
    try {
        // Prompt user for employee information
        const roleInfo = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter job title:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter job salary:'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter department ID:'
            }
        ]);

        // Insert the employee data into the database
        const query = 'INSERT INTO jobs (title, salary, department_id) VALUES ($1, $2, $3)';
        const values = [roleInfo.title, roleInfo.salary, roleInfo.department_id];
        await pool.query(query, values);

        console.log('Role added successfully!');
    } catch (error) {
        console.error('Error adding role:', error);
    }
}

async function addEmployee() {
    try {
        // Prompt user for employee information
        const employeeInfo = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter employee first name:'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter employee last name:'
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter employee role ID:'
            }
        ]);

        // Insert the employee data into the database
        const query = 'INSERT INTO employee (first_name, last_name, jobs_id) VALUES ($1, $2, $3)';
        const values = [employeeInfo.firstName, employeeInfo.lastName, employeeInfo.roleId];
        await pool.query(query, values);

        console.log('Employee added successfully!');
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}
async function changeEmployeeRole(employeeId, newRoleId) {
    try {
        // Update the employee's role in the database
        
        const query = 'UPDATE employee SET jobs_id = $1 WHERE id = $2';
        const values = [newRoleId, employeeId];
        const result = await pool.query(query, values);

        // Check if the update was successful
        if (result.rowCount === 1) {
            console.log('Employee role updated successfully!');
        } else {
            console.log('Employee not found or role not updated.');
        }
    } catch (error) {
        console.error('Error changing employee role:', error);
    }
}


const mainMenu = () => {
    inquirer.prompt([
        {
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
        }
    ]).then(async answer => {
        switch (answer.option){
            case 'Exit':
                console.log('Exiting...');
                pool.end();
                break;
        }
        switch (answer.option) {
            case 'View all departments':
                try {
                    const departments = await viewDepartments();
                    console.log('\nDepartments:');
                    console.table(departments);
                } catch (error) {
                    console.error('Error viewing departments:', error);
                }
                mainMenu(); // After displaying departments, go back to the main menu
                break;
        }
        switch (answer.option) {
            case 'View all roles':
                try{
                const roles = await viewAllRoles();
                console.log('\nRoles:');
                console.table(roles); // Use console.table for better formatting
                } catch (error){
                    console.error('Error viewing roles:', error)
                }
                mainMenu();
                break;
        }
        switch (answer.option) {
            case 'View all employees':
                try {
                    const employees = await viewEmployees();
                    console.log('\nEmployees:');
                    console.table(employees)
                } catch (error) {
                    console.error('Error viewing employees:', error);
                }
                mainMenu(); // After displaying departments, go back to the main menu
                break;
        }
        switch (answer.option) {
            case 'Add an employee':
                try {
                    await addEmployee(); // Await the addEmployee() function call
                } catch (error) {
                    console.error('Error adding employee:', error);
                }
                mainMenu(); // After adding employee, go back to the main menu
                break;
        }
        switch (answer.option) {
            case 'Add a role':
                try {
                    await addRole();
                } catch (error) {
                    console.error('Error adding role:', error)
                }
                mainMenu();
                break;
        }
        switch (answer.option) {
            case 'Add a department':
                try{
                    await addDepartment()
                }
                catch(error){
                    console.error('Error adding department:', error)
                }
                mainMenu()
                break
        }
        switch (answer.option) {
            case 'Update an employee role':
                try {
                    const { employeeId, newRoleId } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'employeeId',
                            message: 'Enter the ID of the employee whose role you want to update:'
                        },
                        {
                            type: 'input',
                            name: 'newRoleId',
                            message: 'Enter the ID of the new role:'
                        }
                    ]);
                    await changeEmployeeRole(employeeId, newRoleId);
                } catch (error) {
                    console.error('Error updating employee role:', error);
                }
                mainMenu();
                break;
        }
        
})
}
mainMenu()