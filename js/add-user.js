$(document).ready(function () {
    const editKey = localStorage.getItem("editEmployeeKey");

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
        clearForm();
    }
});

function clearForm() {
    $('#name').val('');
    $('input[name="profile_image"]').prop("checked", false);
    $('input[name="gender"]').prop("checked", false);
    $('input[name="department"]').prop("checked", false);
    $('#salary').val('');
    $('#notes').val('');
    $('select[name="day"]').val('');
    $('select[name="month"]').val('');
    $('select[name="year"]').val('');
    clearErrors();
}

// Clear all error messages
function clearErrors() {
    $('.error-message').text('');
}

// Validate form fields before submission
function validateForm(empData) {
    clearErrors(); // Clear existing error messages
    let isValid = true;

    if (empData.name.length < 8) {
        $('#name-error').text("required at least 8 characters*");
        isValid = false;
    }
    if (!empData.profileImage) {
        $('#profile-image-error').text("required*");
        isValid = false;
    }
    if (!empData.gender) {
        $('#gender-error').text("required*");
        isValid = false;
    }
    if (empData.departments.length === 0) {
        $('#departments-error').text("required at least one department*");
        isValid = false;
    }
    if (!empData.salary) {
        $('#salary-error').text("required*");
        isValid = false;
    }

    // Validate start date
    const day = $('select[name="day"]').val();
    const month = $('select[name="month"]').val();
    const year = $('select[name="year"]').val();

    if (!day || !month || !year) {
        $('#start-date-error').text("Please select a valid start date.");
        isValid = false;
    } else {
        // Convert start date to Date object
        const startDate = new Date(`${month} ${day}, ${year}`);
        const today = new Date();

        // Check if start date is in the future
        if (startDate <= today) {
            $('#start-date-error').text("Start date must be a future date.");
            isValid = false;
        }
    }

    return isValid;
}

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

    if (!validateForm(empData)) {
        return; // Stop submission if validation fails
    }

    const editKey = localStorage.getItem("editEmployeeKey");

    if (editKey) {
        // Update existing employee using PUT
        $.ajax({
            url: `http://localhost:3000/employees/${editKey}`,
            type: 'PUT',
            data: JSON.stringify(empData),
            contentType: 'application/json',
            success: (response) => {
                console.log("Employee updated successfully:", response);
                localStorage.removeItem("editEmployeeKey");
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

// Cancel button click handler
$('.cancel-btn').on('click', function (event) {
    event.preventDefault();
    window.location.href = "dashboard.html";
});

// Reset button click handler
$('.reset-btn').on('click', function (event) {
    event.preventDefault();
    $('form')[0].reset();
    clearErrors(); // Clear errors when resetting the form
});
