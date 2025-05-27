
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
    }
    else if ($('.menu').attr('data') === 'clossed') {
        $('.s1').attr('class', 'stick s1 s1-open');
        $('.s2').attr('class', 'stick s2 s2-open');
        $('.s3').attr('class', 'stick s3 s3-open');
        $('.menu').attr('data', 'opened');
    }
}

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
    // 1. Fade
    animateSection(".fade-section", (tl, target) => {
      tl.to(target, { opacity: 1 })
        .to(target, {}, "+=0.5") // hold
        .to(target, { opacity: 0 });
    });

    // animateSection(".fade-section", (tl, target) => {
    //   tl.to(target, { opacity: 0 });
    // });

    // 2. Scale
    animateSection(".scale-section", (tl, target) => {
      tl.to(target, { opacity: 1, scale: 1 })
        .to(target, {}, "+=0.5") 
        .to(target, { opacity: 0, scale: 20, duration: 5 })
    });

    // 3. Slide
    animateSection(".slide-section", (tl, target) => {
      tl.fromTo(target, { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { y: -100, opacity: 0 });
    });

    // 4. Rotate
    animateSection(".rotate-section", (tl, target) => {
      tl.fromTo(target, { rotation: -45, opacity: 0 }, { rotation: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { rotation: 45, opacity: 0 });
    });

    // 5. Blur
    animateSection(".blur-section", (tl, target) => {
      tl.fromTo(target, { filter: "blur(20px)", opacity: 0 }, { filter: "blur(0px)", opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { filter: "blur(20px)", opacity: 0 });
    });

    // 6. Skew
    animateSection(".skew-section", (tl, target) => {
      tl.fromTo(target, { skewX: 20, opacity: 0 }, { skewX: 0, opacity: 1 })
        .to(target, {}, "+=0.5")
        .to(target, { skewX: -20, opacity: 0 });
    });

    // 7. Flip
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

  return `Age: ${years}yr's<br><text style='font-size: 1.5rem;'> ${days}day's ${hr}hr's ${sec}s & ${ms.toString().padStart(2, '0')}ms</text>`;
}

// Example usage:
console.log(getAgeFromDOB("1997-12-25T14:30:00"));
setInterval(()=>{
    $("#age").html(getAgeFromDOB("1997-05-10T14:30:00"));
},50);

