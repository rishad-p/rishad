const calendarDiv = document.getElementById('calendar');
const calendarDiv2 = document.getElementById('calendar2');
const monthNameDiv = document.getElementById('monthName');
const monthNameDiv2 = document.getElementById('monthName2');
const statusDiv = document.getElementById('connection');
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();
const database = firebase.database();
state = false;
ffill = false;
sfill = false;
// Set the month name
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function load(){
    setTimeout(()=>{
        $('html,body').animate({scrollTop: $(".day.current").offset().top - 100},'slow');
    }, 1500);
}

// Generate calendar
function generateCalendar(year, month) {
    $("#calendar").empty();
    monthNameDiv.textContent = `${monthNames[currentMonth]} ${currentYear}`;
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
        dayDiv.textContent = day;

        // Calculate if the current day is a Sunday
        const date = new Date(currentYear, currentMonth, day);
        if (date.getDay() === 0) { // 0 represents Sunday
            $(dayDiv).css("color", "red");
        }

        calendarDiv.appendChild(dayDiv);
        if (day < currentDate) { 
            $(dayDiv).css("opacity", "10%");
            $(dayDiv).attr("onclick", "");
            $(dayDiv).css("cursor", "auto");
            $(dayDiv).attr("class", "day");
            $(dayDiv).attr("data", date.toDateString());
        } else if(day === currentDate) {
            $(dayDiv).attr("onclick", "");
            $(dayDiv).css("cursor", "auto");
            $(dayDiv).attr("class", "day current");
            $(dayDiv).attr("data", date.toDateString());
        } else if(ffill === "filled") {
            $(dayDiv).attr("onclick", "");
            $(dayDiv).css("cursor", "auto");
            $(dayDiv).attr("class", "day");
            $(dayDiv).attr("data", date.toDateString());
        } else {
            $(dayDiv).attr("onclick", "open_pop('"+date.toDateString()+"')");
            $(dayDiv).css("cursor", "pointer");
            $(dayDiv).attr("class", "day mdc-ripple-surface");
            $(dayDiv).attr("data", date.toDateString());
        }
    }
    readData();
    mdc_and_rippls();
}

// Generate calendar
function generateCalendar2(year, month) {
    $("#calendar2").empty();
    monthNameDiv2.textContent = `${monthNames[currentMonth+1]} ${currentYear}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add headers for days of the week
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = day;
        if (day === "Sun") { $(header).css("color", "red"); }
        calendarDiv2.appendChild(header);
    });

    // Fill in empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day';
        calendarDiv2.appendChild(emptyDiv);
        $(emptyDiv).css("opacity", "10%");
    }

    // Fill in the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;

        // Calculate if the current day is a Sunday
        const date = new Date(year, month, day);
        if (date.getDay() === 0) { // 0 represents Sunday
            $(dayDiv).css("color", "red");
        }

        calendarDiv2.appendChild(dayDiv);
        if(sfill === "filled") {
            $(dayDiv).attr("onclick", "");
            $(dayDiv).css("cursor", "auto");
            $(dayDiv).attr("class", "day");
            $(dayDiv).attr("data", date.toDateString());
        } else if(currentDate > 20) {
            $(dayDiv).attr("onclick", "open_pop('"+date.toDateString()+"')");
            $(dayDiv).css("cursor", "pointer");
            $(dayDiv).attr("class", "day mdc-ripple-surface");
            $(dayDiv).attr("data", date.toDateString());
        }

    }
    readData();
    mdc_and_rippls();
}

// Function to read data from Firebase
function readData() {
    progress_start();
    database.ref('slots').on('value', function(snapshot) {
        // dataList.innerHTML = ''; // Clear previous data
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key; // Get the key of the data
            $('#calendar').children().each(function(index, childElement) {
                if (data.date === $(childElement).attr("data")) {
                    if (data.date.split(" ")[2] > currentDate) {
                        $(childElement).css("cursor", "pointer");
                    }
                    if (data.state === "quered") {
                        $(childElement).attr("onclick", "");
                        if (data.type === "amzndlryvyt") {
                            $(childElement).css("background", "#00800080");
                        } else if (data.type === "amzndlrymtl") {
                            $(childElement).css("background", "#0000ff80");
                        }
                    } else if(data.state === "approved") {
                        if (data.date.split(" ")[2] > currentDate) {
                            $(childElement).attr("onclick", "rm_slot_pop('" + key + "', '" + data.date + "')");
                        }
                        if (data.type === "amzndlryvyt") {
                            $(childElement).css("background", "green");
                        } else if (data.type === "amzndlrymtl") {
                            $(childElement).css("background", "blue");
                        }
                    } else if(data.state === "remove_rqd") {
                        if (data.date.split(" ")[2] > currentDate) {
                            $(childElement).attr("onclick", "cancel_rm_slot_pop('" + key + "', '" + data.date + "')");
                        }
                        if (data.type === "amzndlryvyt") {
                            $(childElement).css("background", "#00800080");
                        } else if (data.type === "amzndlrymtl") {
                            $(childElement).css("background", "#0000ff80");
                        }
                    }
                }
            });
            $('#calendar2').children().each(function(index, childElement) {
                if (data.date === $(childElement).attr("data")) {
                    if (data.state === "quered") {
                        $(childElement).attr("onclick", "");
                        if (data.type === "amzndlryvyt") {
                            $(childElement).css("background", "#00800080");
                        } else if (data.type === "amzndlrymtl") {
                            $(childElement).css("background", "#0000ff80");
                        }
                    } else if(data.state === "approved") {
                        $(childElement).attr("onclick", "rm_slot_pop('" + key + "', '" + data.date + "')");
                        if (data.type === "amzndlryvyt") {
                            $(childElement).css("background", "green");
                        } else if (data.type === "amzndlrymtl") {
                            $(childElement).css("background", "blue");
                        }
                    } else if(data.state === "remove_rqd") {
                        $(childElement).attr("onclick", "cancel_rm_slot_pop('" + key + "', '" + data.date + "')")
                        if (data.type === "amzndlryvyt") {
                            $(childElement).css("background", "#00800080");
                        } else if (data.type === "amzndlrymtl") {
                            $(childElement).css("background", "#0000ff80");
                        }
                    }
                }
            });
        })
        if(state === "req"){
            progress_end();
            $(".calendar").css("opacity", "100%");
            // $('html,body').animate({scrollTop: $(".day.current").offset().top - 100},'slow');
        }
    });
}

function open_pop(day){
    progress_start();
    $.ajax("add-slot").then(function(resp) {
        $("#pop-body").empty();
        $("#pop-body").append(resp);
        $("#alert-bg").css("display", "block");
        $("#alert-box").css("display", "block");
        // Initialize MDC Select
        const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
        // Example: Log selected value
        select.listen('MDCSelect:change', () => {
            if (select.value === null || select.value === "") {
                $("#pop-details").html("");
                $("#quer-btn").attr("disabled", "disabled");
                $("#quer-btn").css("opacity", "25%");
            } else if (select.value !== null || select.value !== "") {
                if (select.value === "amzndlrymtl") {
                    $("#pop-details").html("Amazon delivery - Muttil-root (GOBA)");
                } else if(select.value === "amzndlryvyt") {
                    $("#pop-details").html("Amazon delivery - Vythiri-root (B-TEAM)");
                }
                $("#quer-btn").removeAttr("disabled");
                $("#quer-btn").css("opacity", "100%");
            }  
        });
        setTimeout(()=>{
            $("#alert-box").css("opacity", "100%");
            $("#alert-box").css("transform", "scale(1)");
            $("#pop-title").html("Assign a task / (duty) <br/><br/>" + day);
            $("#pop-title").attr("data", day);
            mdc_and_rippls();
            progress_end();
        },10);
    }).fail(function(err) {
        updateConnectionStatus();
    });
}

function rm_slot_pop(key, day){
    $("#pop-body").empty();
    $("#pop-body").html(
        "<label class='mdc-text-field mdc-text-field--filled'>" +
            "<span class='mdc-text-field__ripple'></span>" +
            "<span class='mdc-floating-label'>Enter secret code</span>" +
            "<input class='mdc-text-field__input' name='code' id='code' type='text'>" +
            "<span class='mdc-line-ripple'></span>" +
        "</label>" +
        "<div class='mdc-text-field-helper-line'>" +
            "<div class='mdc-text-field-helper-text' id='code-helper' aria-hidden='true' style='color: red;'></div>" +
        "</div>"+
        "<div class='pop-submit-area'>"+
            "<button id='pop-close-btn' class='mdc-button mdc-button--outlined' onclick='close_pop()'>close"+
                "<span class='mdc-button__ripple'></span>"+
            "</button>"+
            "<text>&nbsp;</text>"+
            "<button id='quer-btn' class='mdc-button mdc-button--outlined' onclick='rm_slot(`"+key+"`)'>"+
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                "<span class='mdc-button__ripple'></span>"+
            "</button>"+
        "</div>"
    );
    $("#alert-bg").css("display", "block");
    $("#alert-box").css("display", "block");
    $("#quer-btn").css("opacity", "100%");
    setTimeout(()=>{
        $("#alert-box").css("opacity", "100%");
        $("#alert-box").css("transform", "scale(1)");
        $("#pop-title").html("Remove slot on " + day);
        $("#pop-title").attr("data", day);
        mdc_and_rippls();
    },10);
}

function cancel_rm_slot_pop(key, day){
    $("#pop-body").empty();
    $("#pop-body").html(
        "<label class='mdc-text-field mdc-text-field--filled'>" +
            "<span class='mdc-text-field__ripple'></span>" +
            "<span class='mdc-floating-label'>Enter secret code</span>" +
            "<input class='mdc-text-field__input' name='code' id='code' type='text'>" +
            "<span class='mdc-line-ripple'></span>" +
        "</label>" +
        "<div class='mdc-text-field-helper-line'>" +
            "<div class='mdc-text-field-helper-text' id='code-helper' aria-hidden='true' style='color: red;'></div>" +
        "</div>"+
        "<div class='pop-submit-area'>"+
            "<button id='pop-close-btn' class='mdc-button mdc-button--outlined' onclick='close_pop()'>close"+
                "<span class='mdc-button__ripple'></span>"+
            "</button>"+
            "<text>&nbsp;</text>"+
            "<button id='quer-btn' class='mdc-button mdc-button--outlined' onclick='cancel_rm_slot(`"+key+"`)'>"+
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                "<span class='mdc-button__ripple'></span>"+
            "</button>"+
        "</div>"
    );
    $("#alert-bg").css("display", "block");
    $("#alert-box").css("display", "block");
    $("#quer-btn").css("opacity", "100%");
    setTimeout(()=>{
        $("#alert-box").css("opacity", "100%");
        $("#alert-box").css("transform", "scale(1)");
        $("#pop-title").html("Undo removal request on " + day);
        $("#pop-title").attr("data", day);
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
    date = $("#pop-title").attr("data");
    if (val === "amzndlrymtl" && $("#code").val() === "klzb" || val === "amzndlryvyt" && $("#code").val() === "btm") {
        $("#code").css("box-shadow", "green 0px 0px 0px 2px");
        $("#code").css("color", "green");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("");
        $("#code-helper").css("opacity", "1");
        database.ref('slots').push({
            type: val,
            date:date,
            state: 'approved',
            timestamp: Date.now()
        }).then((row)=>{
            close_pop();
        }).catch((error)=>{
            console.log(error);
        });
    } else {
        $("#code").css("box-shadow", "red 0px 0px 0px 2px");
        $("#code").css("color", "red");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("invalid code / wrong code");
        $("#code-helper").css("opacity", "1");
    }
    filled_slots();
}

function rm_slot(key){
    database.ref('slots').child(key).once('value', row => {
        val = row.val().type
    });
    if (val === "amzndlrymtl" && $("#code").val() === "klzb" || val === "amzndlryvyt" && $("#code").val() === "btm") {
        $("#code").css("box-shadow", "green 0px 0px 0px 2px");
        $("#code").css("color", "green");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("");
        $("#code-helper").css("opacity", "1");
        database.ref('slots').child(key).update({
            state: "remove_rqd"
        }).then((row)=>{
            close_pop();
        }).catch((error)=>{
            console.log(error);
        });
    } else {
        $("#code").css("box-shadow", "red 0px 0px 0px 2px");
        $("#code").css("color", "red");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("invalid code / wrong code");
        $("#code-helper").css("opacity", "1");
    }
    filled_slots();
}

function cancel_rm_slot(key){
    database.ref('slots').child(key).once('value', row => {
        val = row.val().type
    });
    if (val === "amzndlrymtl" && $("#code").val() === "klzb" || val === "amzndlryvyt" && $("#code").val() === "btm") {
        $("#code").css("box-shadow", "green 0px 0px 0px 2px");
        $("#code").css("color", "green");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("");
        $("#code-helper").css("opacity", "1");
        database.ref('slots').child(key).update({
            state: "approved"
        }).then((row)=>{
            close_pop();
        }).catch((error)=>{
            console.log(error);
        });
    } else {
        $("#code").css("box-shadow", "red 0px 0px 0px 2px");
        $("#code").css("color", "red");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("invalid code / wrong code");
        $("#code-helper").css("opacity", "1");
    }
    filled_slots();
}

filled_slots();
function filled_slots(){
    fappdcount = 0;
    frmrqdcount = 0;
    sappdcount = 0;
    srmrqdcount = 0;
    database.ref('slots').orderByChild('state').equalTo('approved').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            date = new Date(childSnapshot.val().date);
            mnt = date.toLocaleString('en-US', { month: 'short' });
            year = date.getFullYear();
            if(`${mnt} ${year}` === `${monthNames[currentMonth].slice(0, 3)} ${currentYear}`){
                fappdcount = fappdcount + 1;
            }
        });
    });
    database.ref('slots').orderByChild('state').equalTo('remove_rqd').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            date = new Date(childSnapshot.val().date);
            mnt = date.toLocaleString('en-US', { month: 'short' });
            year = date.getFullYear();
            if(`${mnt} ${year}` === `${monthNames[currentMonth].slice(0, 3)} ${currentYear}`){
                frmrqdcount = frmrqdcount + 1;
            }
        });
        $("#fcount").html(fappdcount+frmrqdcount + " / 14 filled");
        if(fappdcount+frmrqdcount >= 14){ 
            ffill = "filled"; generateCalendar(currentYear, currentMonth);
        } else { ffill = "blank"; generateCalendar(currentYear, currentMonth); }
    });
    
    database.ref('slots').orderByChild('state').equalTo('approved').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            date = new Date(childSnapshot.val().date);
            mnt = date.toLocaleString('en-US', { month: 'short' });
            year = date.getFullYear();
            if(`${mnt} ${year}` === `${monthNames[currentMonth+1].slice(0, 3)} ${currentYear}`){
                sappdcount = sappdcount + 1;
            }
        });
    });
    database.ref('slots').orderByChild('state').equalTo('remove_rqd').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            date = new Date(childSnapshot.val().date);
            mnt = date.toLocaleString('en-US', { month: 'short' });
            year = date.getFullYear();
            if(`${mnt} ${year}` === `${monthNames[currentMonth+1].slice(0, 3)} ${currentYear}`){
                srmrqdcount = srmrqdcount + 1;
            }
        });
        if(currentDate > 14){
            if(sappdcount+srmrqdcount >= 7){
                sfill = "filled"; generateCalendar2(currentYear, currentMonth + 1); 
            } else { sfill = "blank"; generateCalendar2(currentYear, currentMonth + 1); }
            $("#scount").html(sappdcount+srmrqdcount + " / 7 filled");
        }
    });
}

// list_quered_slots();
function list_quered_slots(){
    database.ref('slots').orderByChild('state').equalTo('quered').on('value', function(snapshot) {
        $("#quered-slots").empty();
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key; // Get the key of the data
            $("#quered-slots").append(
                "<div>" + 
                    data.date + "," + data.type +
                "</div>"
            );
        });
    });
}

function progress_start(){
    $("#progress-bar").css("left", "0px");
    $("#progress-bar").css("right", "auto");
    $("#progress-bar").css("width", "100%");
}

function progress_end(){
    $("#progress-bar").css("left", "auto");
    $("#progress-bar").css("right", "0px");
    $("#progress-bar").css("width", "0%");
}

function mdc_and_rippls(){
    
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

function updateConnectionStatus() {
    if (navigator.onLine) {
        state = "pent";
        $.ajax({
            url: 'https://rishad-p.github.io/fetch.txt',
            cache: false, 
            method: 'GET',
            success: function (data) {
                state = "req";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                state = "failed";
            }
        });
        setTimeout(() => {
            if (state === "req") {
                $('#connection')
                    .html('&#xe2bf;')
                    .css('color', 'green');
                setTimeout(()=>{
                    $("#connection")
                        .css("color", "transparent")
                        .css("font-size", "1000px")
                        .css("border-radius", "500px")
                        .css("text-shadow", "none")
                        .css("transform", "scale(0.5) translate(-50%, -150%)")
                        .attr("onclick", "");
                }, 500);
            } else {
                $('#connection')
                    .html('&#xe2c1;')
                    .css('color', 'yellow')
                    .css("font-size", "100px")
                    .css("border-radius", "0px")
                    .css("text-shadow", "0px 0px 10px #00000080")
                    .css("transform", "scale(1) translate(0%, 0%)")
                    .attr("onclick", "updateConnectionStatus()");
                console.log('no internet: connected without internet');
                updateConnectionStatus();
            }
        }, 1000);
    } else {
        $('#connection')
            .html('&#xe2c1;')
            .css('color', 'red')
            .css("font-size", "100px")
            .css("border-radius", "0px")
            .css("text-shadow", "0px 0px 10px #00000080")
            .css("transform", "scale(1) translate(0%, 0%)")
            .attr("onclick", "");
    }
}

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

updateConnectionStatus();
// setInterval(()=>{
//     updateConnectionStatus();
// },5000);


mdc_and_rippls();
generateCalendar(currentYear, currentMonth);
if(currentDate > 14){
    generateCalendar2(currentYear, currentMonth + 1);
}