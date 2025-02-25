var database = firebase.database();

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
            } else {
            	past_count = past_count + 1;
            	$('#past_visitors').prepend(item);
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
visitors();