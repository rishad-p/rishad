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
        $("#visitors").empty();
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key;
        	const item = $('<div>').text(data.data.ip + ", " + JSON.stringify(data.data));
			// const dltbtn = $('<button>del</button>');
			// dltbtn.on('click', function(e) {
			// 	database.ref('visitors').child(key).remove();
			// });
			// item.append(dltbtn);
			item.css("white-space", "nowrap");
			$('#visitors').append(item);
        })
    });
}

list_quered_slots();
list_revoval_requests();
list_all();
visitors();