
// Function for fetching all data of employee 
function userData() {

    empData = {};
    // Fetching employee name
    empData.name = $('#name').val().trim();
  
    // Fetching selected  employee profile image
    empData.profileImage = $('input[name="profile_image"]:checked').next('img').attr('src');
  
    // Fetching employee gender
    empData.gender = $('input[name="gender"]:checked').val();

  
    // Fetching Selected Departments by employee
    empData.departments = [];
    $('input[name="department"]:checked').each(function () {
        empData.departments.push($(this).val());
    });
  
    // Fetching employee salary
    empData.salary = $('#salary').val();
  
    // Fetching start date
    let day = $('select[name="day"]').val();
    let month = $('select[name="month"]').val();
    let year = $('select[name="year"]').val();
    empData.startDate = `${day}-${month}-${year}`; // Concatenate to form a date
  
    // Fetching notes
    empData.notes = $('#notes').val();

    const uniqueKey = `empData_${Date.now()}`;

    // employee data is stored at local storage   #add key should be unique 
    localStorage.setItem(uniqueKey, JSON.stringify(empData));
    
    // Getting the employee data
    console.log("User details:", empData)
    $.post("http://localhost:3000/employees", JSON.stringify(empData),(response) => {
        console.log(response)
    })
}

// Attching the submit button
$('.submit-btn').on('click', function (event) {
    event.preventDefault(); // Prevent the form from reloading
    userData(); // Call the function to fetch data
    alert(`User added Successfully`)
});    

// Attaching the reset button
$('.reset-btn').on('click', function (event) {
    event.preventDefault();
    $('form')[0].reset(); // Clear all input fields, checkboxes, and radio buttons
});

// Attaching the cancel button
$('.cancel-btn').on('click', function(){
    window.location.href = "dashboard.html";
})