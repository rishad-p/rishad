const calendarDiv = document.getElementById('calendar');
const monthNameDiv = document.getElementById('monthName');
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();

// Set the month name
const monthNames = [
"January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
monthNameDiv.textContent = `${monthNames[currentMonth]} ${currentYear}`;

// Generate calendar
function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add headers for days of the week
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = day;
        if (day === "Sun") { $(header).css("color", "red"); }
        calendarDiv.appendChild(header);
    });

    // Fill in empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day';
        calendarDiv.appendChild(emptyDiv);
        $(emptyDiv).css("opacity", "10%");
    }

    // Fill in the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day' + (day === currentDate ? ' current' : '');
        dayDiv.textContent = day;

        // Calculate if the current day is a Sunday
        const date = new Date(currentYear, currentMonth, day);
        if (date.getDay() === 0) { // 0 represents Sunday
            $(dayDiv).css("color", "red");
        }

        calendarDiv.appendChild(dayDiv);
        if (day < currentDate) { 
            $(dayDiv).css("opacity", "10%"); 
        } else if(day !== currentDate) {
            $(dayDiv).attr("onclick", "open_pop('"+date.toDateString()+"')");
            $(dayDiv).css("cursor", "pointer");
            $(dayDiv).attr("class", "day mdc-ripple-surface");
        }
    }
    mdc_and_rippls();
}

function open_pop(day,details){
    $("#alert-bg").css("display", "block");
    $("#alert-box").css("display", "block");
    setTimeout(()=>{
        $("#alert-box").css("opacity", "100%");
        $("#alert-box").css("transform", "scale(1)");
        $("#pop-title").html("Assign a task / (duty) <br/><br/>" + day);
        mdc_and_rippls();
    },10);
}

function close_pop(){
    $("#alert-box").css("opacity", "0%");
    $("#alert-box").css("transform", "scale(0)");
    setTimeout(()=>{
        $("#alert-bg").css("display", "none");
        $("#alert-box").css("display", "none");
    },300);
}

function quer(){
    val = new mdc.select.MDCSelect(document.querySelector('.mdc-select')).value;
    // code = 
    console.log(val,$("#code").val());
}

function mdc_and_rippls(){


    // Initialize MDC Select
    const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));

    // Example: Log selected value
    select.listen('MDCSelect:change', () => {
        if (select.value === null || select.value === "") {
            $("#pop-details").html("");
            $("#quer-btn").attr("disabled", "disabled");
            $("#quer-btn").css("opacity", "25%");
        } else if (select.value !== null || select.value !== "") {
            $("#pop-details").html(`${select.value}`);
            $("#quer-btn").removeAttr("disabled");
            $("#quer-btn").css("opacity", "100%");
        }  
    });
    
    var days = document.querySelectorAll('.mdc-ripple-surface');
    days.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });

    const listItems = document.querySelectorAll('.mdc-deprecated-list-item');
    listItems.forEach((item) => {
      new mdc.ripple.MDCRipple(item);
    });

    var btns = document.querySelectorAll('.mdc-button');
    btns.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });

    var mdctextFields = document.querySelectorAll('.mdc-text-field');
    mdctextFields.forEach(field => {
        mdc.textField.MDCTextField.attachTo(field);
    });
}

mdc_and_rippls();
generateCalendar(currentYear, currentMonth);