// Get the "Add User" button by its ID
const addUserBtn = document.getElementById("addUserBtn");

// Attach a click event listener to Add User button
addUserBtn.addEventListener("click", function() {
    // Clear editEmployeeKey to ensure new user uses POST
    sessionStorage.removeItem("editEmployeeKey");
    window.location.href = "user.html";
});

// Fetching the employee data from db.json
axios.get("http://localhost:3000/employees")
    .then(response => displayEmployeeData(response.data))
    .catch(error => console.error("Error fetching employee data:", error));

// Function to display employee data in the table
function displayEmployeeData(employees) {
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = ''; // Clear existing rows before appending new ones

    employees.forEach(employee => {
        const row = document.createElement("tr");

        // Name and Image Column
        const nameCell = document.createElement("td");
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("employee-info");

        const profileImg = document.createElement("img");
        profileImg.classList.add("employee-image");
        profileImg.src = employee.profileImage;
        profileImg.alt = employee.name;

        const empName = document.createElement("span");
        empName.innerHTML = employee.name;

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
        salaryCell.innerHTML = `₹${employee.salary}`;
        row.appendChild(salaryCell);

        // Start Date Column
        const startDateCell = document.createElement("td");
        startDateCell.innerHTML = employee.startDate;
        row.appendChild(startDateCell);

        // Action Column with Delete and Edit options
        const actionCell = document.createElement("td");

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");

        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.src = "../asset/delete.png";
        deleteBtn.appendChild(deleteIcon);

        deleteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteEmployee(employee.id, row);
        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");

        const editIcon = document.createElement("img");
        editIcon.classList.add("edit-icon");
        editIcon.src = "../asset/edit.png";
        editBtn.appendChild(editIcon);

        editBtn.addEventListener("click", () => {
            // Store employee ID in sessionStorage for editing
            sessionStorage.setItem("editEmployeeKey", employee.id);
            window.location.href = "user.html";
        });

        // Append buttons to action cell
        actionCell.appendChild(deleteBtn);
        actionCell.appendChild(editBtn);
        row.appendChild(actionCell);

        // Append row to table container
        tableContainer.appendChild(row);
    });
}

// Delete employee function
function deleteEmployee(id, row) {
    axios.delete(`http://localhost:3000/employees/${id}`)
        .then(() => {
            row.remove();
            console.log(`Employee with ID ${id} deleted successfully.`);
        })
        .catch(error => {
            console.error("Error deleting employee:", error);
        });
}
