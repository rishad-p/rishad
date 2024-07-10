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
		$("#boot_bg").css("background", "#ffffff40");
		$("#boot_bg").css("backdrop-filter", "blur(10px)");
		$("#boot_bg").attr("onclick", "menu_toggle(this)");
		setTimeout(() =>{
			clearInterval(boot);
			$(".cir").css("animation", "none");
			$(".cir").css("border-radius", "100px");

			$("#cir1").css("width", "60px");
			$("#cir1").css("height", "10px");
			$("#cir4").css("width", "60px");
			$("#cir4").css("height", "10px");

			$("#boot_bg").css("width", "80px");
			$("#boot_bg").css("height", "80px");
			$("#boot_bg").css("top", "10px");
			$("#boot_bg").css("right", "10px");
			// $("#boot_bg").css("", "");
		}, 300);
		setTimeout(() =>{
			$(".cir").css("border-radius", "100px");
		}, 2000);
	}, 2000);
}

function menu_toggle(e){
	if(){

	}
	$("#boot_bg").css("width", "100vw");
	$("#boot_bg").css("height", "100vh");

	$(".cir").css("width", "250px");
	$(".cir").css("height", "50px");
	$(".cir").css("margin", "20px");
	setTimeout(() =>{
		$("#boot_bg").css("border-radius", "0px");
		$("#boot_bg").css("top", "0px");
		$("#boot_bg").css("right", "0px");


	}, 300);
}