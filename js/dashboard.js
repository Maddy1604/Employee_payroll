
// Get the "Add User" button by its ID
const addUserBtn = document.getElementById("addUserBtn");

// Attach a click event listener
addUserBtn.addEventListener("click", function() {
    // Redirect to user.html page
    window.location.href = "user.html";
});

// Fetching the employee from db.json
axios.get("http://localhost:3000/employees")
    .then(response => displayEmployeeData(response.data))

// Function to display employee data in the table
function displayEmployeeData(employees) {
    const tableContainer = document.getElementById("tableContainer");

    employees.forEach(employee => {
    const row = document.createElement("tr");

    // Name and Image Column
    const nameCell = document.createElement("td");

    // Creadting big div to store img and name
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("employee-info");

    // Creating the img and adding the source
    const profileImg = document.createElement("img");
    profileImg.classList.add("employee-image");
    profileImg.src = employee.profileImage
    profileImg.alt = employee.profileImage.alt
    
    // creating the name span
    const empName = document.createElement("span");
    empName.innerHTML = employee.name;

    // Adding the child elements to parent
    infoDiv.appendChild(profileImg);
    infoDiv.appendChild(empName);
    nameCell.appendChild(infoDiv);
    row.appendChild(nameCell);

    // Gender Column
    const genderCell = document.createElement("td");
    genderCell.textContent = employee.gender;
    row.appendChild(genderCell);

    // Departments Column
    const departmentCell = document.createElement("td");
    employee.departments.forEach(dept => {
        const deptSpan = document.createElement("span");
        deptSpan.classList.add("department");
        deptSpan.innerHTML = dept;
        departmentCell.appendChild(deptSpan);
    });
    row.appendChild(departmentCell);

    // Salary Column
    const salaryCell = document.createElement("td");
    salaryCell.innerHTML = `₹${(employee.salary)}`;
    row.appendChild(salaryCell);

    // Start Date Column
    const startDateCell = document.createElement("td");
    startDateCell.innerHTML = employee.startDate;
    row.appendChild(startDateCell);

    // Delete options manually added
    const actionCell = document.createElement("td");
    const deleteIcon = document.createElement("img");
    deleteIcon.classList = "delete-icon"
    deleteIcon.src = "../asset/delete.png"
    deleteIcon.addEventListener("click", (e) => {
        e.preventDefault()
        deleteEmployee( employee.id, row)
    });
    
    // Edit option added
    const editIcon = document.createElement("img")
    editIcon.classList = "edit-icon"
    editIcon.src = "../asset/edit.png"
    editIcon.addEventListener("click", () => editEmployee(employee.id));

    actionCell.appendChild(deleteIcon)
    actionCell.appendChild(editIcon)
    row.appendChild(actionCell)

    // Append row to table container
    tableContainer.appendChild(row);
    });
}

// Delete employee function
function deleteEmployee( id, row) {
    axios.delete(`http://localhost:3000/employees/${id}`)
        .then(() => {
        row.remove(); // Remove the row from the table
        console.log(`Employee with ID ${id} deleted successfully.`);
        });
    
}

// Edit employee function
function editEmployee(id) {
    // Fetch the employee details from the API using the ID
    axios.get(`http://localhost:3000/employees/${id}`)
      .then(response => {
        const employee = response.data;
        
        // Store employee details in localStorage to access on user.html
        localStorage.setItem("editEmployee", JSON.stringify(employee));
  
        // Redirect to user.html for editing
        window.location.href = "user.html";
      })
}
  
  
