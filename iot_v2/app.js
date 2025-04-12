
// Reference to the Firebase database
const database = firebase.database();

// Function to write data to Firebase
function writeData() {
  const textInput = document.getElementById('textInput');
  const textValue = textInput.value;

  // Push data to Firebase
  database.ref('items').push({
    text: textValue,
    numbers:5678,
    state: 'off'
  });

  textInput.value = ''; // Clear input field after adding data
}

// Function to read data from Firebase
function readData() {
    $("#progress").html("started");
    database.ref('items').on('value', function(snapshot) {
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = ''; // Clear previous data

        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            const key = childSnapshot.key; // Get the key of the data
            const listItem = document.createElement('li');
            listItem.textContent = data.text;

            // Add delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
              deleteData(key);
            };

            // Add update button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = function(e) {
              const newText = prompt('Enter the new text', data.text);
              if (newText === null) {
                return;
              }
              updateData(key, newText);
            };

            const toggleButton = document.createElement('button');
            toggleButton.textContent = data.state;
            toggleButton.onclick = function(e) {
              toggleData(key);
            };

            listItem.appendChild(deleteButton);
            listItem.appendChild(updateButton);
            listItem.appendChild(toggleButton);
            dataList.appendChild(listItem);

        });
        $("#progress").html("ended");
    });
}

// Function to delete data from Firebase
function deleteData(key) {
  database.ref('items').child(key).remove();
}

// Function to update data in Firebase
function updateData(key, newText) {
  database.ref('items').child(key).update({
    text: newText
  });
}

function toggleData(key){
    var itemRef = database.ref('items').child(key);
    itemRef.once('value').then(function(snapshot) {
        mydata = snapshot.val().state;
        if (mydata === 'off') {
            database.ref('items').child(key).update({
                state: 'on'
            });
        }
        else if (mydata === 'on') {
            database.ref('items').child(key).update({
                state: 'off'
            });
        }
    });
}

// Call readData function to initially load data
readData();