
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