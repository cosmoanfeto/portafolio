document.addEventListener("DOMContentLoaded", function () {
    // Esperar a que el contenido del DOM se cargue completamente

    // Obtener el elemento de enlace de la biografía
    const bioLink = document.getElementById("bio-link");

    // Agregar un event listener al enlace de la biografía
    bioLink.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Bio link clicked!");
        // Agrega tu código personalizado aquí para el clic en el enlace de la biografía
    });

    // De manera similar, puedes agregar un event listener para el enlace del portafolio
    const portfolioLink = document.getElementById("portfolio-link");

    portfolioLink.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Portfolio link clicked!");
        // Agrega tu código personalizado aquí para el clic en el enlace del portafolio
    });

    // Animación de la sección de inicio

    // Navegación por anclajes
    let panelsSection = document.querySelector("#panels"),
        panelsContainer = document.querySelector("#panels-container"),
        tween;

    // Agregar event listeners a los elementos con clase 'anchor'
    document.querySelectorAll(".anchor").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            let targetElem = document.querySelector(e.target.getAttribute("href")),
                y = targetElem;

            if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
                let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
                    totalMovement = (panels.length - 1) * targetElem.offsetWidth;
                y = Math.round(tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll);
            }

            gsap.to(window, {
                scrollTo: {
                    y: y,
                    autoKill: false
                },
                duration: 1
            });
        });
    });

    // Paneles con animación utilizando GSAP
    const panels = gsap.utils.toArray("#panels-container .panel");
    tween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: "#panels-container",
            pin: true,
            start: "top top",
            scrub: 1,
            snap: {
                snapTo: 1 / (panels.length - 1),
                inertia: false,
                duration: { min: 0.1, max: 0.1 }
            },
            end: () => "+=" + (panelsContainer.offsetWidth - innerWidth)
        }
    });

    // Efecto de cursor
    gsap.set(".cursor-scroll", { xPercent: -50, yPercent: -50 });

    var ball = document.querySelector(".cursor-scroll");
    var pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var mouse = { x: pos.x, y: pos.y };
    var speed = 0.1;

    var xSet = gsap.quickSetter(ball, "x", "px");
    var ySet = gsap.quickSetter(ball, "y", "px");

    gsap.set(ball, { scale: 0 })

    function mousemoveFunction(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    }

    function tickerUpdate() {
        var dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        xSet(pos.x);
        ySet(pos.y);
    }

    var section = document.querySelector(".intro");

    section.onmouseenter = function () {
        section.addEventListener("mousemove", mousemoveFunction);
        gsap.ticker.add(tickerUpdate)
        gsap.to(ball, { scale: 1 })
    }

    section.onmouseleave = function () {
        section.removeEventListener("mousemove", mousemoveFunction);
        gsap.ticker.remove(tickerUpdate)
        gsap.to(ball, { scale: 0 })
    }

    var threeContainer = document.getElementById("three-container");
    // Crear una escena
    const scene = new THREE.Scene();
    // Crear una cámara
    const camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;
    // Crear un renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
    threeContainer.appendChild(renderer.domElement);
    // Crear una geometría de esfera
    const sphereGeometry = new THREE.SphereGeometry(1, 5, 5);
    const edges = new THREE.EdgesGeometry(sphereGeometry); // Crear las aristas de la esfera
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // Color blanco para las aristas
    const sphereEdges = new THREE.LineSegments(edges, lineMaterial); // Crear las líneas de las aristas
    // Añadir las aristas de la esfera a la escena
    scene.add(sphereEdges);
    // Animación de las aristas de la esfera
    function animate() {
        requestAnimationFrame(animate);
        // Rotar las aristas de la esfera
        sphereEdges.rotation.x += 0.01;
        sphereEdges.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    // Iniciar la animación
    animate();
    const container = document.querySelector(".container");

    // animacion del texto inicial
    setTimeout(() => {
        container.classList.add("animate-in");
    }, 200); // Ajusta el valor del retraso según sea necesario
});
// Clients Slider

var clients = gsap.timeline({
    pause: true,
    defaults: {
        ease: "linear",
        repeat: -1,
        duration: 20,
        yoyo: true
    }
})

clients.from(
    ".slide-track",
    { xPercent: -50 }, 0
)
    .fromTo(
        ".slide-track-2",
        { xPercent: 0 }, { xPercent: -50 }, 0
    )

ScrollTrigger.create({
    trigger: "section",
    start: "top top",
    end: "bottom",
    onEnter: () => {
        clients.play();
    },
    onLeave: () => {
        clients.play();
    },
    onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        clients.timeScale(velocity / 100);
        gsap.to(clients, { timeScale: 1, ease: 'power1.inOut', duration: 2, overwrite: true });
    }
});


// Portfolio Listing JS

const clamp = (min, number, max) => Math.min(max, Math.max(number, min));
let prevX = 0;

document.querySelectorAll(".showcase").forEach((showcase) => {
    const img = showcase.querySelector(".showcase-photo");
    let timeout;

    showcase.addEventListener("mousemove", (e) => {
        clearTimeout(timeout);

        const x = e.clientX - showcase.getBoundingClientRect().left - img.clientWidth / 2;
        const y = e.clientY - showcase.getBoundingClientRect().top - img.clientHeight / 2;
        const rotate = e.clientX - prevX;
        prevX = e.clientX;

        // console.log({y, x, rotate});

        requestAnimationFrame(() => {
            img.style.translate = `${x}px ${y}px`;
            img.style.rotate = clamp(-8, rotate * 2, 8) + "deg";
        });

        timeout = setTimeout(() => { img.style.rotate = "0deg" }, 250);
    });

    showcase.addEventListener("mouseenter", () => {
        setTimeout(() => {
            img.style.transition = "1200ms cubic-bezier(0.23, 1, 0.320, 1)";
            img.style.opacity = 1;
        }, 1);
    });

    showcase.addEventListener("mouseleave", () => {
        img.style.transition = "none";
        img.style.opacity = 0;
    });
});

// End Portfolio JS

// Home Page Animation
// Website Animation

// Preloader Filter
(function () {
    const blurProperty = gsap.utils.checkPrefix("filter"),
        blurExp = /blur\((.+)?px\)/,
        getBlurMatch = target => (gsap.getProperty(target, blurProperty) || "").match(blurExp) || [];

    gsap.registerPlugin({
        name: "blur",
        get(target) {
            return +(getBlurMatch(target)[1]) || 0;
        },
        init(target, endValue) {
            let data = this,
                filter = gsap.getProperty(target, blurProperty),
                endBlur = "blur(" + endValue + "px)",
                match = getBlurMatch(target)[0],
                index;
            if (filter === "none") {
                filter = "";
            }
            if (match) {
                index = filter.indexOf(match);
                endValue = filter.substr(0, index) + endBlur + filter.substr(index + match.length);
            } else {
                endValue = filter + endBlur;
                filter += filter ? " blur(0px)" : "blur(0px)";
            }
            data.target = target;
            data.interp = gsap.utils.interpolate(filter, endValue);
        },
        render(progress, data) {
            data.target.style[blurProperty] = data.interp(progress);
        }
    });
})();
// Footer animation
gsap.from('.foot', {
    scrollTrigger: {
        trigger: '.foot',
        scrub: true,
        skewX: 5,
        star: "top bottom",

    },
    yPercent: -50,
    stagger: 0.1,
    ease: 'power4.out',
    duration: 1
});

// Intro timeline
const preloadI = gsap.timeline();
preloadI.from(".prewrap", { y: 20, stagger: 1, duration: 1, opacity: 0, alpha: 0, blur: 10 }, { y: 0, stagger: 1, duration: 1, opacity: 1, ease: "SlowMo", alpha: 1, blur: 0, yoyo: true });
gsap.fromTo(".holder", { y: 50, duration: 3 }, { y: 0, duration: 5, ease: "SloMo" });

// Top animation
gsap.to('.uptotop', {
    scrollTrigger: {
        trigger: 'section',
        start: "top top",
        scrub: true,
    },
    ease: "linear.out",
    stagger: .5,
    y: -100,
    duration: 2,
});

gsap.fromTo('.uptotop1', 
    {
        y: '100%', // Comienza desde abajo
        opacity: -10, // Comienza con opacidad 0
    },
    {
        ease: "linear.out",
        stagger: 1,
        y: 0, // Termina en la posición original
        opacity: 1, // Termina con opacidad 1
        duration: 5,
    }
);

// H1 Animation on scroll  
gsap.to('h1', {
    scrollTrigger: {
        trigger: ".intro",
        start: "top top",
        scrub: true,
    },
    ease: "linear.out",
    y: -100,
    duration: 5,
});


// Parallax de mi imagen

// Animaciones de títulos

// Definir funciones para seleccionar elementos del DOM
select = (e) => document.querySelector(e);
selectAll = (e) => document.querySelectorAll(e);

// Seleccionar todos los elementos con la clase 'container'
const slides = selectAll('.container');

// Inicializar SplitType en el elemento con la clase 'my-text'
const myText = new SplitType('.my-text');

// Animación de las etiquetas H3
var lines = gsap.utils.toArray('.line');
lines.forEach((line, i) => {
    gsap.from(line, {
        autoAlpha: 0,
        scrollTrigger: {
            trigger: line,
            start: "top 50%", // Comienza la animación cuando la parte superior de la línea está en el 50% de la ventana
            ease: "linear",
        },
        yPercent: 100, // Desplazamiento vertical del 100%
        stagger: 0.1, // Retraso entre animaciones de líneas
        rotationX: 75,
        skewX: -30,
        autoAlpha: 0,
        ease: 'power4',
        duration: 1.5,
        blur: 20
    });
})

// Animación de texto de párrafo
var paragraphs = gsap.utils.toArray('.quote');
paragraphs.forEach((text, i) => {
    gsap.from(text, {
        autoAlpha: 0,
        scrollTrigger: {
            trigger: text,
            start: 'top 90%', // Comienza la animación cuando la parte superior del texto está en el 90% de la ventana
        },
        duration: 2, // Duración de la animación
        ease: "power4.out",
        skewY: 4,
        yPercent: 20, // Desplazamiento vertical del 20%
        stagger: 0.3, // Retraso entre animaciones de párrafos
    });
})

// Animaciones de prueba (comentadas)
//gsap.from(".small-sentence", {yPercent: 100, duration:2, stagger: 1, opacity:0, skewY: 4, ease: "power4.out"});
// Fin de la prueba

// Animación de aparición de elementos
var fadein = gsap.utils.toArray('.fadein');
fadein.forEach((fadein, i) => {
    gsap.from(fadein, {
        autoAlpha: 0,
        scrollTrigger: {
            trigger: fadein,
        },
        duration: 1.5,
        ease: "power4",
        skewX: -10,
        yPercent: 30, // Desplazamiento vertical del 30%
        stagger: 0.2, // Retraso entre animaciones de aparición de elementos
    });
})

// Animación de desvanecimiento de secciones
var sections = gsap.utils.toArray('.section');
sections.forEach((section) => {
    gsap.to(section, {
        autoAlpha: 0,
        scrollTrigger: {
            trigger: section,
            start: '50%', // Comienza la animación cuando la parte superior de la sección está en el 50% de la ventana
            scrub: true,
            end: 'bottom', // Termina la animación cuando la parte inferior de la sección llega a la parte inferior de la ventana
            ease: "linear"
        }
    });
});
