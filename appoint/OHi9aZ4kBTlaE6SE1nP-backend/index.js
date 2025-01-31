const database = firebase.database();

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

list_quered_slots();

function approve_slot(){

}