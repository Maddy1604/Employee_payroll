$(document).ready(function () {
    const editKey = sessionStorage.getItem("editEmployeeKey");

    if (editKey) {
        // Fetch employee data and populate the form for editing
        $.ajax({
            url: `http://localhost:3000/employees/${editKey}`,
            type: 'GET',
            success: (employeeData) => {
                $('#name').val(employeeData.name);
                $('input[name="profile_image"]').each(function() {
                    $(this).prop("checked", $(this).next('img').attr('src') === employeeData.profileImage);
                });
                $('input[name="gender"][value="' + employeeData.gender + '"]').prop("checked", true);
                $('#salary').val(employeeData.salary);
                $('#notes').val(employeeData.notes);

                // Set department checkboxes based on employeeData
                $('input[name="department"]').each(function() {
                    $(this).prop("checked", employeeData.departments.includes($(this).val()));
                });

                // Set start date fields
                const [day, month, year] = employeeData.startDate.split('-');
                $('select[name="day"]').val(day);
                $('select[name="month"]').val(month);
                $('select[name="year"]').val(year);
            },
            error: (error) => {
                console.error("Error fetching employee data:", error);
            }
        });
    } else {
        // Clear all form fields for a new user
        $('#name').val('');
        $('input[name="profile_image"]').prop("checked", false);
        $('input[name="gender"]').prop("checked", false);
        $('input[name="department"]').prop("checked", false);
        $('#salary').val('');
        $('#notes').val('');
        $('select[name="day"]').val('');
        $('select[name="month"]').val('');
        $('select[name="year"]').val('');
    }
});

// Handle form submission for add or edit
function FormSubmission() {
    const empData = {
        name: $('#name').val().trim(),
        profileImage: $('input[name="profile_image"]:checked').next('img').attr('src'),
        gender: $('input[name="gender"]:checked').val(),
        departments: [],
        salary: $('#salary').val(),
        startDate: `${$('select[name="day"]').val()}-${$('select[name="month"]').val()}-${$('select[name="year"]').val()}`,
        notes: $('#notes').val()
    };

    $('input[name="department"]:checked').each(function () {
        empData.departments.push($(this).val());
    });

    const editKey = sessionStorage.getItem("editEmployeeKey");

    if (editKey) {
        // Update existing employee using PUT
        $.ajax({
            url: `http://localhost:3000/employees/${editKey}`,
            type: 'PUT',
            data: JSON.stringify(empData),
            contentType: 'application/json',
            success: (response) => {
                console.log("Employee updated successfully:", response);
                sessionStorage.removeItem("editEmployeeKey");
                window.location.href = "dashboard.html";
            },
            error: (error) => {
                console.error("Error updating employee:", error);
                alert("Error updating employee. Please check the console for more details.");
            }
        });
    } else {
        // Add new employee using POST
        $.ajax({
            url: "http://localhost:3000/employees",
            type: 'POST',
            data: JSON.stringify(empData),
            contentType: 'application/json',
            success: (response) => {
                console.log("New employee added:", response);
                window.location.href = "dashboard.html";
            },
            error: (error) => {
                console.error("Error adding new employee:", error);
                alert("Error adding new employee. Please check the console for more details.");
            }
        });
    }
}

// Attach form submission handler
$('.submit-btn').on('click', function (event) {
    event.preventDefault();
    FormSubmission();
});

// Attach form submission handler
$('.cancel-btn').on('click', function (event) {
    event.preventDefault();
    window.location.href = "dashboard.html"
});