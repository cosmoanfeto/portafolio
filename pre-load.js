// Do not repeat the loader again
if (sessionStorage.getItem("isLoaded")) {
    // If it has been viewed before, hide the preloader
    // const preloader = document.querySelector('#preloader');
    // preloader.style.display = 'none';
    // Page is fully loaded, set the visibility of the elements to "visible"
    document.querySelectorAll('.preload-holder').forEach(function (element) {
        element.style.visibility = "hidden";
    });


} else {
    // Page is fully loaded, set the visibility of the elements to "visible"
    document.querySelectorAll('.preload-holder').forEach(function (element) {
        element.style.visibility = "visible";
    });

    sessionStorage.setItem("isLoaded", true)

}
// load images
var loadedCount = 0; //current number of images
var imagesToLoad = $('.bcg').length; //number of slides with .bcg
var loadingProgress = 0; //timeline progress - starts at 0
$('.bcg').imagesLoaded({
    background: true
}
).progress(function (instance, image) {
    loadProgress();
});
TweenLite.from('.count-down', 0.7, { autoAlpha: 0 });
function loadProgress(imgLoad, image) {
    //one more image has been loaded
    loadedCount++;
    loadingProgress = (loadedCount / imagesToLoad);
    // GSAP timeline for our progress bar
    TweenLite.to(progressTl, 0.7, { progress: loadingProgress, ease: Linear.easeNone });
}
//progress animation
var progressTl = new TimelineMax({ paused: true, onUpdate: progressUpdate, onComplete: loadComplete });
progressTl
    //tween the progress bar width
    .from($('.load-msg'), 1, { y: 20, stagger: 1, duration: 1, opacity: 0, alpha: 0, blur: 10 }, { y: 0, stagger: 1, duration: 1, opacity: 1, ease: "SlowMo", alpha: 1, blur: 0 });
//as the progress bar witdh updates and grows we put the precentage loaded in the screen
function progressUpdate() {
    //the percentage loaded based on the tween's progress
    loadingProgress = Math.round(progressTl.progress() * 100);
    //we put the percentage in the screen
    $(".count-down").text(loadingProgress + '%');
}
// preloader out
new TimelineMax()
    .to('.progress', 0.1, { y: 100, autoAlpha: 0, ease: Back.easeIn })
    .to('.count-down', 0.1, { y: 100, autoAlpha: 0, ease: Back.easeIn }, 0.1)
    .set('html', { className: 'is-loading' })
    .set('html', { className: 'is-loaded' })
    .to('#preloader', 0.2, { blur: 20, opacity:0, ease: Linear.easeInOut })
    .set('#preloader', { className: 'is-hidden' })
    .from('.intro', 0.1, { autoAlpha: 0, ease: Power1.easeOut }, '-=0.2')
    .from(".logo", { y: -30, duration: 1.4, opacity: 0, ease: "power4", }, '-=0.2')
    .from(".navbar", { y: -30, duration: 1.4, opacity: 0 }, "<0.3")
    .from(".wrappar-title, .bio_social, .bio_copyrights", { y: 30, duration: 1.4, opacity: 0, ease: "power4" }, "<0.3")
    .from(".o1, .o2, .o3, .o4", { autoAlpha: 0, duration: 2, skewX: -30, yPercent: 100, ease: "power4", stagger: 0.1, blur: 10 }, "<0.25");
//force the playhead to jump to the end in order to pre-render all the tweens, then back to the start and pause.
new TimelineMax().progress(1).pause(0);
function loadComplete() {
    new TimelineMax().play();
}
// Do not repeat the loader again
window.addEventListener(preloaderOutT1, function () {
    if (!sessionStorage.viewed) {
        const preloaderOutT1 = document.querySelector('#preloader');
        preloaderOutT1.className += 'is-hidden';
        sessionStorage.viewed = 1;
    } else {
        const preloaderOutT1 = document.querySelector('#preloader');
        preloaderOutT1.style.display = "none";
    }
})