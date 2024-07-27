start();
function start(){
	boot_animate();
	boot = setInterval(() =>{ boot_animate(); }, 2000);

	if ( DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function" ) {
		DeviceMotionEvent.requestPermission();
	}
	window.addEventListener("devicemotion", function(e){
		val = Math.trunc(e.accelerationIncludingGravity.y);
		$("#bg").css("background-position", "0% "+ val +"0%");
	});
}

function boot_animate(){
	setTimeout(() =>{
		$("#cir4").css("border-radius", "100% 00% 00% 00%");
		setTimeout(() =>{
			$("#cir4").css("border-radius", "00% 100% 00% 00%");
			setTimeout(() =>{
				$("#cir4").css("border-radius", "00% 00% 100% 00%");
				setTimeout(() =>{
					$("#cir4").css("border-radius", "00% 00% 00% 100%");
				}, 500);
			}, 500);
		}, 500);
	}, 500);
}

function load(){
	setTimeout(() =>{
        $("#boot_bg").css("top","10vh");
        $("#boot_bg").css("right","10vh");
        $("#boot_bg").css("border-radius", "20px");
		// $("#boot_bg").css("backdrop-filter", "blur(10px)");
		$("#boot_bg").attr("onclick", "menu_toggle()");
		setTimeout(() =>{
			clearInterval(boot);
			$(".cir").css("animation", "none");
			$(".cir").css("border-radius", "100px");
			$("#cir1").css("width", "60px");
			$("#cir1").css("height", "10px");
			$("#cir4").css("width", "60px");
			$("#cir4").css("height", "10px");
			$("#boot_bg").css("background", "#ffffff40");
			$("#boot_bg").css("width", "70px");
			$("#boot_bg").css("height", "70px");
			$("#boot_bg").css("top", "10px");
			$("#boot_bg").css("right", "10px");
		}, 300);
		setTimeout(() =>{
			$(".cir").css("border-radius", "100px");
		}, 2000);
	}, 2000);
}

function menu_toggle(){
	if($("#boot_bg").attr("data") === "off"){
		$("body").css("overflow-y", "hidden");
		$("#boot_bg").attr("onclick", " ");
		$("#boot_bg").attr("data", "on");
		$("#boot_bg").css("width", "100vw");
		$("#boot_bg").css("height", "100vh");
		$("#boot_bg").css("top", "10vh");
		$("#boot_bg").css("right", "10vh");
		$("#close").css("width", "70px");
		$("#close").css("height", "70px");
		$("#close").css("box-shadow", "0px 0px 0px 4px yellow");
		$(".cir").css("width", "250px");
		$(".cir").css("height", "50px");
		$(".cir").css("margin", "20px");
		$("#cir1").attr("onclick", "navigate_menu('bg')");
		$("#cir2").attr("onclick", "open_config()");
		$("#cir4").attr("onclick", "navigate_menu('contents')");
		$("#rishad").css("transform", "scale(100%)");
		setTimeout(() =>{
			$("#boot_bg").css("border-radius", "0px");
			$("#boot_bg").css("top", "0px");
			$("#boot_bg").css("right", "0px");
			$("#boot_bg").css("background", "#00000047");
			$(".cir").css("background", "transparent");
			$(".cir").css("box-shadow", "0px 0px 0px 4px yellow");

		}, 300);
	}
	else if($("#boot_bg").attr("data") === "on"){
		$("body").css("overflow-y", "auto");
		$("#boot_bg").attr("data", "off");
		$("#boot_bg").css("top", "10vh");
		$("#boot_bg").css("right", "10vh");
		$("#cir2").css("border-radius", "100px");
		$("#cir2").css("display", "flex");
		$("#cir2").css("font-size", "50px");
		$("#back").css("width", "0px");
		$("#back").css("height", "0px");
		$("#back").css("box-shadow", "none");
		$("#config").css("height", "0%");
		$("#config").css("width", "0%");
		$("#rishad").css("transform", "scale(0%)");
		setTimeout(() =>{
			$("#boot_bg").attr("onclick", "menu_toggle()");
			$("#boot_bg").css("width", "70px");
			$("#boot_bg").css("height", "70px");
			$("#boot_bg").css("border-radius", "20px");
			$("#boot_bg").css("top", "10px");
			$("#boot_bg").css("right", "10px");
			$("#boot_bg").css("background", "#ffffff40");
			$("#close").css("width", "0px");
			$("#close").css("height", "0px");
			$("#close").css("box-shadow", "none");
			$("#cir1").css("width", "60px");
			$("#cir1").css("height", "10px");
			$("#cir2").css("width", "0px");
			$("#cir2").css("height", "0px");
			$("#cir3").css("width", "0px");
			$("#cir3").css("height", "0px");
			$("#cir4").css("width", "60px");
			$("#cir4").css("height", "10px");
			$(".cir").css("margin", "3px");
			$(".cir").css("background", "yellow");
			$(".cir").css("box-shadow", "none");
			$("#cir1").attr("onclick", " ");
			$("#cir2").attr("onclick", " ");
			$("#cir4").attr("onclick", " ");
		}, 300);
	}
}

function navigate_menu(value){
    $('html,body').animate({scrollTop: $("#"+value).offset().top},'slow');
    menu_toggle();
}

function open_config(){
	$("#cir2").css("height", "50vh");
	$("#cir2").css("width", "250px");
	$("#cir2").css("border-radius", "0px 50px 50px 50px");
	$("#cir2").css("display", "unset");
	$("#cir2").css("font-size", "0px");
	$("#cir2").attr("onclick", "");
	$(".cir").css("margin", "0px");
	$("#cir1").css("width", "0px");
	$("#cir1").css("height", "0px");
	$("#cir1").css("box-shadow", "none");
	$("#cir3").css("width", "0px");
	$("#cir3").css("height", "0px");
	$("#cir3").css("box-shadow", "none");
	$("#cir4").css("width", "0px");
	$("#cir4").css("height", "0px");
	$("#cir4").css("box-shadow", "none");
	$("#back").css("width", "70px");
	$("#back").css("height", "70px");
	$("#back").css("box-shadow", "yellow 0px 0px 0px 4px");
	$("#back").attr("onclick", "close_config()");
	$("#config").css("height", "50vh");
	$("#config").css("width", "250px");
	$("#rishad").css("transform", "scale(0%)");
}

function close_config(){
	$("#cir2").css("border-radius", "100px");
	$("#cir2").css("display", "flex");
	$("#cir2").css("font-size", "50px");
	setTimeout(() =>{
		$("#cir2").attr("onclick", "open_config()");
	}, 500)
	$(".cir").css("width", "250px");
	$(".cir").css("height", "50px");
	$(".cir").css("margin", "20px");
	$(".cir").css("box-shadow", "0px 0px 0px 4px yellow");
	$("#back").css("width", "0px");
	$("#back").css("height", "0px");
	$("#back").css("box-shadow", "none");
	$("#config").css("height", "0%");
	$("#config").css("width", "0%");
	$("#rishad").css("transform", "scale(100%)");
}

function screen(e){
	if ($(e).attr('data') === 'off') {
		$(e).attr("data", "on");
		$(e).html('&#xe5d1;');
	    if (document.documentElement.requestFullscreen) {
	      document.documentElement.requestFullscreen();
	    } else if (document.documentElement.msRequestFullscreen) {
	      document.documentElement.msRequestFullscreen();
	    } else if (document.documentElement.mozRequestFullScreen) {
	      document.documentElement.mozRequestFullScreen();
	    } else if (document.documentElement.webkitRequestFullscreen) {
	      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	}
	else if ($(e).attr('data') === 'on') {
		$(e).attr("data", "off");
		$(e).html('&#xe5d0;');
	    if (document.exitFullscreen) {
	      document.exitFullscreen();
	    } else if (document.msExitFullscreen) {
	      document.msExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	      document.webkitExitFullscreen();
	    }
	}
}

function theme(e){
	if ($(e).attr('data') === 'off') {
		$(e).attr("data", "on");
		$("#contents").css("background", "white");
		$(e).html('&#xe51c;');
	}
	else if ($(e).attr('data') === 'on') {
		$(e).attr("data", "off");
		$("#contents").css("background", "black");
		$(e).html('&#xe518;');
	}
}