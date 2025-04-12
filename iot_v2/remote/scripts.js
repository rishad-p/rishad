// Reference to the Firebase database
const db = firebase.database();

readData();
srcblock();
song = document.getElementById("song");
function load(){
    // Call readData function to initially load data
    scr = document.getElementById('scr');
    $('#load').css('background-color','rgba(0,0,0,0.5)');
    $('#load').css('backdrop-filter','blur(10px)');
    setTimeout(function(){
        $('#load').css('background-color','rgba(0,0,0,0.25)');
        $('#load').css('backdrop-filter','blur(5px)');
        $('#load').css('border-radius', '0px 0px 100px 0px');
        $('#load').css('filter', 'blur(10px)');
        setTimeout(function(){
            // $('#load').hide('slow');
            $('#load').css('height', '0vh');
            $('#load').css('width', '0vw');
            
        },250); 
    },250);

    scr.scrollBy({top:0,left:10000,behavior:'smooth'});
    setTimeout(function(){
        $('.platestart').attr('class','plates');
        setTimeout(function(){
            scr.scrollBy({top:0,left:-10000,behavior:'smooth'});
        },1000); 
    },500);
}

function clic(thi, btn){
    if($(thi).attr("data") === 'off'){
             if (btn === 'flash') { db.ref('iot').update({ flash: 'on' }); }
        else if (btn === 'flash_int') { db.ref('iot').update({ flash: 'int' }); }
        else if (btn === 'vibrate') { db.ref('iot').update({ vibrate: 'on' }); }
        else if (btn === 'vibrate_int') { db.ref('iot').update({ vibrate: 'int' }); }
        else if (btn === 'music') { db.ref('iot').update({ music: 'on' }); }
    }
    else if($(thi).attr("data") === 'on'){
             if (btn === 'flash') { db.ref('iot').update({ flash: 'off' }); }
        else if (btn === 'flash_int') { db.ref('iot').update({ flash: 'off' }); }
        else if (btn === 'vibrate') { db.ref('iot').update({ vibrate: 'off' }); }
        else if (btn === 'vibrate_int') { db.ref('iot').update({ vibrate: 'off' }); }
        else if (btn === 'music') { db.ref('iot').update({ music: 'off' }); }
    }
}

vibrate_loop = false;
vibrate_int_loop = false;

function readData() {
    db.ref('iot').on('value', function(snapshot) {

        flash = snapshot.val().flash;
        if (flash === 'off') {
            $("#flash").attr("class", "plate off");
            $("#flash").attr("data", "off");
            $("#flash_int").attr("class", "plate off");
            $("#flash_int").attr("data", "off");
            $("#flash_iframe").attr("src", " ");
            flashoff();
        }
        else if (flash === 'on') {
            $("#flash").attr("class", "plate on");
            $("#flash").attr("data", "on");
            $("#flash_int").attr("class", "plate off");
            $("#flash_int").attr("data", "off");
            $("#flash_iframe").attr("src", " ");
            flashon();
        }
        else if (flash === 'int') {
            $("#flash").attr("class", "plate off");
            $("#flash").attr("data", "off");
            $("#flash_int").attr("class", "plate on");
            $("#flash_int").attr("data", "on");
            $("#flash_iframe").attr("src", "flash_int.html");
        }

        vibrate = snapshot.val().vibrate;
        if (vibrate === 'off') {
            $("#vibrate").attr("class", "plate off");
            $("#vibrate").attr("data", "off");
            $("#vibrate_int").attr("class", "plate off");
            $("#vibrate_int").attr("data", "off");
            clearInterval(vibrate_loop);
            clearInterval(vibrate_int_loop);
        }
        else if (vibrate === 'on') {
            $("#vibrate").attr("class", "plate on");
            $("#vibrate").attr("data", "on");
            $("#vibrate_int").attr("class", "plate off");
            $("#vibrate_int").attr("data", "off");
            clearInterval(vibrate_int_loop);
            vibrate_loop = setInterval(() => {
                navigator.vibrate(500);
            },500);
        }
        else if (vibrate === 'int') {
            $("#vibrate").attr("class", "plate off");
            $("#vibrate").attr("data", "off");
            $("#vibrate_int").attr("class", "plate on");
            $("#vibrate_int").attr("data", "on");
            clearInterval(vibrate_loop);
            vibrate_int_loop = setInterval(() => {
                navigator.vibrate([250,250]);
            },500);
        }

        music = snapshot.val().music;
        if (music === 'off') {
            $("#music").attr("class", "plate off");
            $("#music").attr("data", "off");
            song.pause();
        }
        else if (music === 'on') {
            $("#music").attr("class", "plate on");
            $("#music").attr("data", "on");
            song.play();
        }

    });
}

function flashon(){
    const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
    if (SUPPORTS_MEDIA_DEVICES) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const cameras = devices.filter((device) => device.kind === 'videoinput');
        if (cameras.length === 0) {
          throw 'No camera found on this device.';
        }
        const camera = cameras[cameras.length - 1];
        navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: camera.deviceId,
            facingMode: ['user', 'environment'],
            height: {ideal: 1080},
            width: {ideal: 1920}
          }
        }).then(stream => {
          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track)
          const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {
              track.applyConstraints({
                advanced: [{torch: true}]
              });
          });
        });
      });
    }
}

function flashoff(){
    const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
    if (SUPPORTS_MEDIA_DEVICES) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const cameras = devices.filter((device) => device.kind === 'videoinput');
        if (cameras.length === 0) {
          throw 'No camera found on this device.';
        }
        const camera = cameras[cameras.length - 1];
        navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: camera.deviceId,
            facingMode: ['user', 'environment'],
            height: {ideal: 1080},
            width: {ideal: 1920}
          }
        }).then(stream => {
          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track)
          const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {
              track.applyConstraints({
                advanced: [{torch: false}]
              });
          });
        });
      });
    }
}

function srcblock() {
    document.addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);
    document.addEventListener("keydown", function(e) {
    //document.onkeydown = function(e) {
      // "I" key
      if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
        disabledEvent(e);
      }
      // "J" key
      if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
        disabledEvent(e);
      }
      // "S" key + macOS
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        disabledEvent(e);
      }
      // "U" key
      if (e.ctrlKey && e.keyCode == 85) {
        disabledEvent(e);
      }
      // "F12" key
      if (event.keyCode == 123) {
        disabledEvent(e);
      }
    }, false);
    function disabledEvent(e){
      if (e.stopPropagation){
        e.stopPropagation();
      } else if (window.event){
        window.event.cancelBubble = true;
      }
      e.preventDefault();
      return false;
    }
}