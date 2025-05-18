var database = firebase.database();
const calendarDiv = document.getElementById('calendar');
const calendarDiv2 = document.getElementById('calendar2');
const monthNameDiv = document.getElementById('monthName');
const monthNameDiv2 = document.getElementById('monthName2');
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();
state = false;
ffill = false;
sfill = false;
sffill = false;
ssfill = false;
time = false;
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function list_quered_slots(){
    database.ref('slots').on('value', function(snapshot) {
        $("#quered-slots").empty();
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key; // Get the key of the data
            // if(data.state === "quered"){
            	const item = $('<div>').text(data.date + "," + data.type + " - ");
				const approveButton = $('<button>approve</button>');
				approveButton.on('click', function(e) {
					database.ref('slots').child(key).update({
						state: "approved"
					});
				});
				item.append(approveButton);
				$('#quered-slots').append(item);
            // }
        })
    });
}

function list_revoval_requests(){
    database.ref('slots').on('value', function(snapshot) {
        $("#removal-requests").empty();
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key; // Get the key of the data
            if(data.state === "remove_rqd"){
            	const item = $('<div>').text(data.date + "," + data.type + ", " + data.state);
				const btn = $('<button>remove</button>');
				btn.on('click', function(e) {
					database.ref('slots').child(key).update({
						state: "removed"
					});
				});
				item.append(btn);
				$('#removal-requests').append(item);
            }
        })
    });
}

function list_all(){
    database.ref('slots').on('value', function(snapshot) {
        $("#all-datas").empty();
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key;
        	const item = $('<div>').text(data.date + ", " + data.type + ", " + data.state);
			const dltbtn = $('<button>del</button>');
			dltbtn.on('click', function(e) {
				database.ref('slots').child(key).remove();
			});
			item.append(dltbtn);
			$('#all-datas').append(item);
        })
    });
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
        } else if(true) {
            $(dayDiv).attr("onclick", "open_pop('"+date.toDateString()+"')");
            $(dayDiv).css("cursor", "pointer");
            $(dayDiv).attr("class", "day mdc-ripple-surface");
            $(dayDiv).attr("data", date.toDateString());
        }
    }
    readData();
    mdc_and_rippls();
}

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
                        $(childElement).css("background", "#0000ff80");
                    } else if(data.state === "approved") {
                        if (data.date.split(" ")[2] > currentDate) {
                            $(childElement).attr("onclick", "rm_slot_pop('" + key + "', '" + JSON.stringify(data) + "')");
                        }
                        $(childElement).css("background", "blue");
                    } else if(data.state === "remove_rqd") {
                        if (data.date.split(" ")[2] > currentDate) {
                            $(childElement).attr("onclick", "cancel_rm_slot_pop('" + key + "', '" + data.date + "')");
                        }
                        $(childElement).css("background", "#0000ff80");
                    } else {
                        $(childElement)
                            .attr("onclick", "")
                            .css("background", "yellow")
                            .css("color", "red");
                    }
                }
            });
            $('#calendar2').children().each(function(index, childElement) {
                if (data.date === $(childElement).attr("data")) {
                    if (data.state === "quered") {
                        $(childElement).attr("onclick", "");
                        $(childElement).css("background", "#0000ff80");
                    } else if(data.state === "approved") {
                        $(childElement).attr("onclick", "rm_slot_pop('" + key + "', '" + JSON.stringify(data) + "')");
                        $(childElement).css("background", "blue");
                    } else if(data.state === "remove_rqd") {
                        $(childElement).attr("onclick", "cancel_rm_slot_pop('" + key + "', '" + data.date + "')");
                        $(childElement).css("background", "#0000ff80");
                    }
                    else {
                        $(childElement)
                            .attr("onclick", "")
                            .css("background", "yellow")
                            .css("color", "red");
                    }
                }
            });
        })
        if(state === "req"){
            progress_end();
            $(".calendar").css("opacity", "100%");
        }
    });
}

function open_pop(day){
    progress_start();
    // updateConnectionStatus();
    filled_slots();
    $.ajax("add-slot").then(function(resp) {
        $("#pop-body").empty();
        $("#pop-body").append(resp);
        $("#alert-bg").css("display", "block");
        $("#alert-box").css("display", "block");
        if(sffill === "filled"){
            $("#amzndlryvyt").attr("class", "mdc-deprecated-list-item mdc-deprecated-list-item--disabled");
        }
        if(ssfill === "filled"){
            $("#amzndlrymtl").attr("class", "mdc-deprecated-list-item mdc-deprecated-list-item--disabled");
        }
        // Initialize MDC Select
        const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
        // Example: Log selected value
        select.listen('MDCSelect:change', () => {
            if (select.value === null || select.value === "") {
                $("#pop-details").html("");
                $("#quer-btn").attr("disabled", "disabled");
                $("#quer-btn").css("opacity", "25%");
            } else if (select.value !== null || select.value !== "") {
                $("#pop-details").html("#"+select.value);
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
        // updateConnectionStatus();
    });
}

function rm_slot_pop(key, data){
    $("#pop-body").empty();
    $("#pop-body").html(
        "<p id='pop-details'></p>" +
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
        $("#pop-title").html("#" + JSON.parse(data).type);
        $("#pop-details").html("Remove slot on " + JSON.parse(data).date+" .?");
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
    // updateConnectionStatus();
    val = new mdc.select.MDCSelect(document.querySelector('.mdc-select')).value;
    date = $("#pop-title").attr("data");
    if(val === "na"){ state = "na"} else { state = 'approved'}
    if ( true
        // [
        //     "amzndlryvyt", 
        //     "amzndlrykpt", 
        //     "amzndlrycdl"
        // ].includes(val) && $("#code").val() === "btm" && $("#code").val() != "klzb" 
        // || 
        // [
        //     "amzndlrympd",
        //     "amzndlrymtl",
        //     "amzndlrykbk",
        //     "amzndlrymnd"
        // ].includes(val) && $("#code").val() === "klzb" && $("#code").val() != "btm"
    ) {
        $("#code").css("box-shadow", "green 0px 0px 0px 2px");
        $("#code").css("color", "green");
        $("#code").css("border-radius", "15px");
        $("#code-helper").html("");
        $("#code-helper").css("opacity", "1");
        database.ref('slots').push({
            type: val,
            date:date,
            state: state,
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
    if ( 
        [
            "amzndlryvyt", 
            "amzndlrykpt", 
            "amzndlrycdl"
        ].includes(val) && $("#code").val() === "btm" && $("#code").val() != "klzb" 
        || 
        [
            "amzndlrympd",
            "amzndlrymtl",
            "amzndlrykbk",
            "amzndlrymnd"
        ].includes(val) && $("#code").val() === "klzb" && $("#code").val() != "btm"
    ) {
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
    if ( 
        [
            "amzndlryvyt", 
            "amzndlrykpt", 
            "amzndlrycdl"
        ].includes(val) && $("#code").val() === "btm" && $("#code").val() != "klzb" 
        || 
        [
            "amzndlrympd",
            "amzndlrymtl",
            "amzndlrykbk",
            "amzndlrymnd"
        ].includes(val) && $("#code").val() === "klzb" && $("#code").val() != "btm"
    ) {
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
    vytcnt = 0;
    mtlcnt = 0;
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
        $("#fcount").html(12 - (fappdcount+frmrqdcount) + " remaining");
        if(fappdcount+frmrqdcount >= 12){ 
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
                if(childSnapshot.val().type === "amzndlryvyt") { vytcnt = vytcnt+1; }
                if(childSnapshot.val().type === "amzndlrymtl") { mtlcnt = mtlcnt+1; }
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
                if(childSnapshot.val().type === "amzndlryvyt") { vytcnt = vytcnt+1; }
                if(childSnapshot.val().type === "amzndlrymtl") { mtlcnt = mtlcnt+1; }
            }
        });
        if(currentDate > 14){
            if(sappdcount+srmrqdcount >= 12){
                sfill = "filled";
                generateCalendar2(currentYear, currentMonth + 1); 
            } else {
                sfill = "blank";
                generateCalendar2(currentYear, currentMonth + 1);
            }
            if(currentDate > 19 && currentDate < 25){
                if(vytcnt >= 7){
                    sffill = "filled";
                } else {
                    sffill = "blank";
                }
                if(mtlcnt >= 7){
                    ssfill = "filled";
                } else {
                    ssfill = "blank";
                }
            }
            // $("#vytcnt").html(vytcnt + " / 7 Vythiry");
            // $("#mtlcnt").html(mtlcnt + " / 7 Muttil");
            $("#scount").html( (12 - (Number(sappdcount) + Number(srmrqdcount))) + " remaining");
        }
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

function visitors(){
    database.ref('visitors').on('value', function(snapshot) {
    	$("#today_visitors").empty();
    	$("#yesterday_visitors").empty();
    	$("#day_bf_yesterday_visitors").empty();
        $("#past_visitors").empty();
    	var today_count = 0;
    	var yesterday_count = 0;
    	var day_bf_yesterday_count = 0;
    	var past_count = 0;
    	snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key;
        	const item = $('<tr>').html(
        		"<td><div class='dt'>"+data.data.ip+"</div></td>"+
        		"<td><div class='dt'>"+data.data.ip_v+"</div></td>"+
        		"<td><div class='dt'>"+data.data.aprox_city_name + "</div></td>" +
        		"<td><div class='dt'>"+data.data.region+"</div></td>"+
        		"<td><div class='dt'>"+data.data.country_capital+"</div></td>"+
        		"<td><div class='dt'>"+data.data.country_name+"</div></td>"+
        		"<td><div class='dt'>"+data.data.timezone+"</div></td>"+
        		"<td><div class='dt'>"+data.data.nsp+"</div></td>"+
        		"<td><div class='dt'>"+data.data.platform.split(' ').slice(0, 1).join(' ')+"</div></td>"+
        		"<td><div class='dt'>"+data.data.user_agent+"</div></td>"+
        		"<td><div class='dt'>"+data.data.system_theme+"</div></td>"+
        		"<td><div class='dt'>"+data.data.battery_level+"</div></td>"+
        		"<td><div class='dt'>"+data.data.referrer+"</div></td>"+
        		"<td><div class='dt'>"+data.data.url+"</div></td>"+
        		"<td><div class='dt'>"+data.data.local_time+"</div></td>"
        	);
            if (data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date().toDateString()) {
            	today_count = today_count+1;
	        	$('#today_visitors').prepend(item);
            } else if(data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
            	yesterday_count = yesterday_count + 1;
            	$('#yesterday_visitors').prepend(item);
            } else if(data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 2)).toDateString()) {
            	day_bf_yesterday_count = day_bf_yesterday_count + 1;
            	$('#day_bf_yesterday_visitors').prepend(item);
            } else if(
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 3)).toDateString() ||
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 4)).toDateString() ||
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 5)).toDateString() ||
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 6)).toDateString() ||
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 7)).toDateString() ||
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 8)).toDateString() ||
            		data.data.utc_time.split(' ').slice(0, 4).join(' ') === new Date(new Date().setDate(new Date().getDate() - 9)).toDateString() 

            	) {
	            	// day_bf_yesterday_count = day_bf_yesterday_count + 1;
	            	$('#past_visitors').prepend(item);
            } else {
            	past_count = past_count + 1;
            	
            }
    	});
    	console.log("today count           ",today_count);
    	console.log("yesterday_count       ",yesterday_count);
    	console.log("day_bf_yesterday_count",day_bf_yesterday_count);
    	console.log("past_count            ",past_count);

        $("#today_visitors, #yesterday_visitors, #day_bf_yesterday_visitors, #past_visitors").prepend(
        	"<tr>"+
	        	"<th>ip</th>"+
	        	"<th>ip_v</th>"+
	        	"<th>aprox_city</th>"+
	        	"<th>region</th>"+
	        	"<th>capital</th>"+
	        	"<th>country</th>"+
	        	"<th>timezone</th>"+
	        	"<th>nsp</th>"+
	        	"<th>platf</th>"+
	        	"<th>user_agent</th>"+
	        	"<th>theme</th>"+
	        	"<th>bat</th>"+
	        	"<th>referrer</th>"+
	        	"<th>url</th>"+
	        	"<th>local_time</th>"+
        	"</tr>"
        );
    });
}

list_quered_slots();
list_revoval_requests();
list_all();
generateCalendar(currentYear, currentMonth);
generateCalendar2(currentYear, currentMonth + 1);
visitors();