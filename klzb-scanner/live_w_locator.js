var datas=[];
var count = 0;

const audio = document.getElementById('audio');
const err_sound = document.getElementById('err_sound');
const already_ascanned = document.getElementById('already_ascanned');

const already_scanned_voice = document.getElementById('already_scanned_voice');
const length_not_12_voice = document.getElementById('length_not_12_voice');
const not_a_number_voice = document.getElementById('not_a_number_voice');

already_scanned_voice.muted = true;
length_not_12_voice.muted = true;
not_a_number_voice.muted = true;

$(function() {
    var resultCollector = Quagga.ResultCollector.create({
        capture: true,
        capacity: 20,
        blacklist: [{
            code: "WIWV8ETQZ1", format: "code_93"
        }, {
            code: "EH3C-%GU23RK3", format: "code_93"
        }, {
            code: "O308SIHQOXN5SA/PJ", format: "code_93"
        }, {
            code: "DG7Q$TV8JQ/EN", format: "code_93"
        }, {
            code: "VOFD1DB5A.1F6QU", format: "code_93"
        }, {
            code: "4SO64P4X8 U4YUU1T-", format: "code_93"
        }],
        filter: function(codeResult) {
            // only store results which match this constraint
            // e.g.: codeResult
            return true;
        }
    });
    var App = {
        init: function() {
            var self = this;

            Quagga.init(this.state, function(err) {
                if (err) {
                    return self.handleError(err);
                }
                //Quagga.registerResultCollector(resultCollector);
                App.attachListeners();
                App.checkCapabilities();
                Quagga.start();
            });
        },
        handleError: function(err) {
            console.log(err);
        },
        checkCapabilities: function() {
            var track = Quagga.CameraAccess.getActiveTrack();
            var capabilities = {};
            if (typeof track.getCapabilities === 'function') {
                capabilities = track.getCapabilities();
            }
            this.applySettingsVisibility('zoom', capabilities.zoom);
            this.applySettingsVisibility('torch', capabilities.torch);
        },
        updateOptionsForMediaRange: function(node, range) {
            console.log('updateOptionsForMediaRange', node, range);
            var NUM_STEPS = 6;
            var stepSize = (range.max - range.min) / NUM_STEPS;
            var option;
            var value;
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            for (var i = 0; i <= NUM_STEPS; i++) {
                value = range.min + (stepSize * i);
                option = document.createElement('option');
                option.value = value;
                option.innerHTML = value;
                node.appendChild(option);
            }
        },
        applySettingsVisibility: function(setting, capability) {
            // depending on type of capability
            if (typeof capability === 'boolean') {
                var node = document.querySelector('input[name="settings_' + setting + '"]');
                if (node) {
                    node.parentNode.style.display = capability ? 'block' : 'none';
                }
                return;
            }
            if (window.MediaSettingsRange && capability instanceof window.MediaSettingsRange) {
                var node = document.querySelector('select[name="settings_' + setting + '"]');
                if (node) {
                    this.updateOptionsForMediaRange(node, capability);
                    node.parentNode.style.display = 'block';
                }
                return;
            }
        },
        initCameraSelection: function(){
            var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

            return Quagga.CameraAccess.enumerateVideoDevices()
            .then(function(devices) {
                function pruneText(text) {
                    return text.length > 30 ? text.substr(0, 30) : text;
                }
                var $deviceSelection = document.getElementById("deviceSelection");
                while ($deviceSelection.firstChild) {
                    $deviceSelection.removeChild($deviceSelection.firstChild);
                }
                devices.forEach(function(device) {
                    var $option = document.createElement("option");
                    $option.value = device.deviceId || device.id;
                    $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                    $option.selected = streamLabel === device.label;
                    $deviceSelection.appendChild($option);

                });
            });
        },
        attachListeners: function() {
            var self = this;

            self.initCameraSelection();
            $(".controls").on("click", "button.stop", function(e) {
                e.preventDefault();
                Quagga.stop();
                self._printCollectedResults();
            });

            $(".controls .reader-config-group").on("change", "input, select", function(e) {
                e.preventDefault();
                var $target = $(e.target),
                    value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
                    name = $target.attr("name"),
                    state = self._convertNameToState(name);

                console.log("Value of "+ state + " changed to " + value);
                self.setState(state, value);
            });
        },
        _printCollectedResults: function() {
            var results = resultCollector.getResults(),
                $ul = $("#result_strip ul.collector");

            results.forEach(function(result) {
                var $li = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');

                $li.find("img").attr("src", result.frame);
                $li.find("h4.code").html(result.codeResult.code + " (" + result.codeResult.format + ")");
                $ul.prepend($li);
            });
        },
        _accessByPath: function(obj, path, val) {
            var parts = path.split('.'),
                depth = parts.length,
                setter = (typeof val !== "undefined") ? true : false;

            return parts.reduce(function(o, key, i) {
                if (setter && (i + 1) === depth) {
                    if (typeof o[key] === "object" && typeof val === "object") {
                        Object.assign(o[key], val);
                    } else {
                        o[key] = val;
                    }
                }
                return key in o ? o[key] : {};
            }, obj);
        },
        _convertNameToState: function(name) {
            return name.replace("_", ".").split("-").reduce(function(result, value) {
                return result + value.charAt(0).toUpperCase() + value.substring(1);
            });
        },
        detachListeners: function() {
            $(".controls").off("click", "button.stop");
            $(".controls .reader-config-group").off("change", "input, select");
        },
        applySetting: function(setting, value) {
            var track = Quagga.CameraAccess.getActiveTrack();
            if (track && typeof track.getCapabilities === 'function') {
                switch (setting) {
                case 'zoom':
                    return track.applyConstraints({advanced: [{zoom: parseFloat(value)}]});
                case 'torch':
                    return track.applyConstraints({advanced: [{torch: !!value}]});
                }
            }
        },
        setState: function(path, value) {
            var self = this;

            if (typeof self._accessByPath(self.inputMapper, path) === "function") {
                value = self._accessByPath(self.inputMapper, path)(value);
            }

            if (path.startsWith('settings.')) {
                var setting = path.substring(9);
                return self.applySetting(setting, value);
            }
            self._accessByPath(self.state, path, value);

            console.log(JSON.stringify(self.state));
            App.detachListeners();
            Quagga.stop();
            App.init();
        },
        inputMapper: {
            inputStream: {
                constraints: function(value){
                    if (/^(\d+)x(\d+)$/.test(value)) {
                        var values = value.split('x');
                        return {
                            width: {min: parseInt(values[0])},
                            height: {min: parseInt(values[1])}
                        };
                    }
                    return {
                        deviceId: value
                    };
                }
            },
            numOfWorkers: function(value) {
                return parseInt(value);
            },
            decoder: {
                readers: function(value) {
                    if (value === 'ean_extended') {
                        return [{
                            format: "ean_reader",
                            config: {
                                supplements: [
                                    'ean_5_reader', 'ean_2_reader'
                                ]
                            }
                        }];
                    }
                    return [{
                        format: value + "_reader",
                        config: {}
                    }];
                }
            }
        },
        state: {
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: {min: 640},
                    height: {min: 480},
                    facingMode: "environment",
                    aspectRatio: {min: 1, max: 2}
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
            frequency: 10,
            decoder: {
                readers : [{
                    format: "code_128_reader",
                    config: {}
                }]
            },
            locate: true
        },
        lastResult : null
    };

    App.init();

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        if (App.lastResult !== code) {
            if (!isNaN(code) === true) {
                if (code.length === 12) {
                    if (datas.includes(code) === false) {
                        App.lastResult = code;
                        datas.push(code);
                        count = count + 1;
                        var $node = null
                        audio.play();
                        navigator.vibrate(500);
                        $("#result_strip").prepend(code+"<br/>");
                        $("#count").html(count);
                        $("#bar").html("last_scanned: "+code);
                        $("#bar").css("background","#00800080");
                        $("#bar").css("color","white");
                        console.clear();
                        console.log(datas);
                    }
                    else
                    {
                        App.lastResult = code;
                        already_ascanned.play();
                        already_scanned_voice.play();
                        navigator.vibrate([250,250]);
                        $("#bar").html(code + ": already_ascanned");
                        $("#bar").css("background","#ffff0080");
                        $("#bar").css("color","black");
                    }
                }
                else{
                    App.lastResult = code;
                    err_sound.play();
                    length_not_12_voice.play();
                    $("#bar").html(code + ": is not a 12 length");
                    $("#bar").css("background","#ff000080");
                    $("#bar").css("color","black");
                    
                }
            }
            else{
                App.lastResult = code;
                err_sound.play();
                not_a_number_voice.play();
                $("#bar").html(code + "= not a TID");
                $("#bar").css("background","#ff000080");
                $("#bar").css("color","black");
            }

        }
    });

});

if (localStorage.login_stat === "true") {
    $("#login_window").css("display","none");
}

function login(){
    if($("#un").val() === 'klzb' && $("#pw").val() === 'klzb@123'){
        localStorage.login_stat = "true";
        $("#login_window").css("transform","translate(25px, 25px)");
        setTimeout(function(){
            $("#login_window").css("transform","translate(-100vw, -100vh)");
        },400);
    }
    else{
        alert('incorrect_credentials');
    }
}

function data_share(){
    navigator.share({
        title: document.title,
        text: datas
    });
}

function voice_toggle(e){
    if($(e).attr('data')==='off'){
        $(e).html('&#xe050;');
        $(e).attr('data','on');

        already_scanned_voice.muted = false;
        length_not_12_voice.muted = false;
        not_a_number_voice.muted = false;
    }
    else if($(e).attr('data')==='on'){
        $(e).html('&#xe04f;');
        $(e).attr('data','off');

        already_scanned_voice.muted = true;
        length_not_12_voice.muted = true;
        not_a_number_voice.muted = true;
    }
}

function screen_toggle(e){
    var elem = document.documentElement;
    if($(e).attr('data')==='off'){
        $(e).html('&#xe5d1;');
        $(e).attr('data','on');

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    else if($(e).attr('data')==='on'){
        $(e).html('&#xe5d0;');
        $(e).attr('data','off');
        
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

function torch(e){
    if ($(e).attr("data") === "off") {
        $(e).attr("data","on");
        $(e).html("<i class='material-icons' style='color:white;'>&#xf00a;</i>");
        // flashon();
    }
    else if ($(e).attr("data") === "on") {
        $(e).attr("data","off");
        $(e).html("<i class='material-icons'>&#xf00b;</i>");
        // flashoff();
    }
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