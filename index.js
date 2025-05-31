
function onload() {
    boot();
    $(".world>path").attr("id", "world");
    setTimeout(()=>{
        $(".hello").css("transform", "scale(1)");
        $(".world").css("visibility", "visible");
        gsap.set("#world", { drawSVG: "0%" });
        gsap.to("#world", {
            duration: 3,
            drawSVG: "100%",
            ease: "power1.inOut"
        });
        setTimeout(()=>{
            scroll();
            hover();
            if ( DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function" ) {
                DeviceMotionEvent.requestPermission();
            }
            window.addEventListener("devicemotion", function(e){
                val = Math.trunc(e.accelerationIncludingGravity.y);
                $("#menu-page").css("background-position", "0% "+ val +"0%");
            });
        },3000);
    },2000);
    setTimeout(()=>{
        $(".stick")
            .css("width", "44px")
            .css("height", "6px");
        setTimeout(()=>{
            $(".stick")
                .css("transition", "300ms")
                .css("transform-origin", "center center")
                .css("margin-left", "auto")
                .css("margin-right", "auto");
        },1500);
    },4000);
}

function boot(){
    gsap.set("#hello", { drawSVG: "0%" });
    gsap.to("#hello", {
        duration: 3,
        drawSVG: "100%",
        ease: "power1.inOut"
    });
}

function menu_toggle(){
    if ($('.menu').attr('data') === 'opened') {
        $('.s1').attr('class', 'stick s1');
        $('.s2').attr('class', 'stick s2');
        $('.s3').attr('class', 'stick s3');
        $('.menu').attr('data', 'clossed');
        const items = $("#menu-page h1").toArray();
        items.forEach((element, index) => {
            setTimeout(() => {
                $(element).css({
                    clip: "rect(40px,00px,40px,0px)"
                });
            }, index * 100);
        });
        $("#menu-page").css({
            top: "10vh",
            right: "10vw",
            borderRadius: "50px",
            boxShadow: "0px 0px 0px 5px white",
        });
        setTimeout(()=>{
            $("#menu-page").css({
                top: "-100vh",
                right: "-100vw",
                borderRadius: "50px",
                boxShadow: "0px 0px 0px 3px white",
            });
        },500);
    }
    else if ($('.menu').attr('data') === 'clossed') {
        $('.s1').attr('class', 'stick s1 s1-open');
        $('.s2').attr('class', 'stick s2 s2-open');
        $('.s3').attr('class', 'stick s3 s3-open');
        $('.menu').attr('data', 'opened');
        $("#menu-page").css({
            top: "10vh",
            right: "10vw",
            borderRadius: "50px",
            boxShadow: "0px 0px 0px 3px white",
        });
        setTimeout(()=>{
            const items = $("#menu-page h1").toArray();
            items.reverse().forEach((element, index) => {
                setTimeout(() => {
                    $(element).css({
                        clip: "rect(0px,300px,40px,0px)"
                    });
                }, index * 100);
            });
            $("#menu-page").css({
                top: "0vh",
                right: "0vw",
                borderRadius: "0px",
                boxShadow: "0px 0px 0px 0px white",
            });
        },500);
    }
}

function hover(){
    var bgm = document.getElementById("bgm");
    for (let i = 1; i <= 4; i++) {
        $(`.i${i}`).hover(
            function () {
                $(`.il${i}`).css({
                    width: "200px",
                    marginLeft: "0px"
                });
                bgm.play();
            },
            function () {
                $(`.il${i}`).css({
                    width: "0px",
                    marginLeft: "200px"
                });
                setTimeout(() => {
                    $(`.il${i}`).css({
                        marginLeft: "0px"
                    });
                }, 400);
            }
        );
    }
}

function mouse(e){
    let x = e.clientX;
    let y = e.clientY;
    $("#point").attr("style", `margin-top: ${y-10}px !important; margin-left: ${x-10}px !important;`);
}

// let lastScroll = 0;

// $(window).on("scroll", function() {
//     let currentScroll = $(this).scrollTop();
//     if (currentScroll > lastScroll) {
//         $(".menu").css({ top: -74+"px", right: -74+"px" });
//     } else {
//         $(".menu").css({ top: 10+"px", right: 10+"px" });
//     }
//     lastScroll = currentScroll;
// });

function scroll(){
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#section-a",
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true
        }
    });

    // Add animations to the timeline — reverse draw both
    tl.to("#hello", { drawSVG: "0%", ease: "none" }, 0)
    .to("#world", { drawSVG: "0%", ease: "none" }, 0);

    gsap.registerPlugin(ScrollTrigger);
    animateSection(".scale-section", (tl, target) => {
      tl.to(target, { opacity: 1, scale: 1 })
        .to(target, {}, "+=0.5") 
        .to(target, { opacity: 0, scale: 20, duration: 5 })
    });

    animateSection(".fade-section", (tl, target) => {
      tl.to(target, { opacity: 1 })
        .to(target, {}, "+=0.5") // hold
        .to(target, { opacity: 0 });
    });

    animateSection(".slide-section", (tl, target) => {
      tl.fromTo(target, { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { y: -100, opacity: 0 });
    });

    animateSection(".rotate-section", (tl, target) => {
      tl.fromTo(target, { rotation: -45, opacity: 0 }, { rotation: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { rotation: 45, opacity: 0 });
    });

    animateSection(".blur-section", (tl, target) => {
      tl.fromTo(target, { filter: "blur(20px)", opacity: 0 }, { filter: "blur(0px)", opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { filter: "blur(20px)", opacity: 0 });
    });

    animateSection(".skew-section", (tl, target) => {
      tl.fromTo(target, { skewX: 20, opacity: 0 }, { skewX: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { skewX: -20, opacity: 0 });
    });

    animateSection(".flip-section", (tl, target) => {
      tl.fromTo(target, { rotationY: -90, opacity: 0 }, { rotationY: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { rotationY: 90, opacity: 0 });
    });

}


function animateSection(selector, animations) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: selector,
      start: "top top",
      end: "+=200%",
      scrub: true,
      pin: true
    }
  });
  animations(tl, selector + " .content");
}


function getAgeFromDOB(dob) {
  const now = new Date();
  const birthDate = new Date(dob);
  const diffMs = now - birthDate;

  const ms = diffMs % 1000;
  const totalSec = Math.floor(diffMs / 1000);
  const sec = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const hr = totalMin % 60;
  const totalHr = Math.floor(totalMin / 60);
  const day = totalHr % 24;
  const totalDays = Math.floor(totalHr / 24);

  const years = Math.floor(totalDays / 365.25);
  const days = Math.floor(totalDays - years * 365.25);

  $("#age").html(`Age: ${years}yr's<br>`);
  $("#age-sec").html(
    `
      <div>${days}day's ${hr}hr's</div>
      <div style="width:45px;text-align: end;white-space: nowrap;">${sec}</div>
      <div> s & </div>
      <div style="width:55px;text-align: end;white-space: nowrap;">${ms.toString().padStart(3, '0')}</div>
      <div>ms</div>
  `
  );
  
  // `<text style='font-size: 1.5rem;'> ${days}day's ${hr}hr's ${sec}s <br>& ${ms.toString().padStart(3, '0')}ms</text>`;
}

setInterval(()=>{
    getAgeFromDOB("1997-05-10T14:30:00");
},50);

