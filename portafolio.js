//PAGINAS DEL PORTAFOLIO

// Cuando la página esté completamente cargada, establece la visibilidad de los elementos a "visible"
document.querySelectorAll('.white-header, .sentence').forEach(function (element) {
  element.style.visibility = "visible"; // Hace visible el elemento
});

// Scroll del Blog
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
  const id = entry.target.getAttribute('id'); // Obtiene el id del elemento objetivo
  if (entry.intersectionRatio > 0) {
    document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active'); // Agrega la clase 'active' si el elemento está en la vista
  } else {
    document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active'); // Elimina la clase 'active' si el elemento no está en la vista
  }
});
});

// Observa cada sección con un id
document.querySelectorAll('section[id]').forEach((section) => {
observer.observe(section); // Inicia la observación de la sección
});

// Filtro de desenfoque al cargar la página
(function () {
const blurProperty = gsap.utils.checkPrefix("filter"), // Comprueba el prefijo del filtro de desenfoque
  blurExp = /blur\((.+)?px\)/, // Expresión regular para capturar el valor del desenfoque
  getBlurMatch = target => (gsap.getProperty(target, blurProperty) || "").match(blurExp) || []; // Obtiene el valor actual del desenfoque

gsap.registerPlugin({
  name: "blur",
  get(target) {
    return +(getBlurMatch(target)[1]) || 0; // Devuelve el valor del desenfoque
  },
  init(target, endValue) {
    let data = this,
      filter = gsap.getProperty(target, blurProperty), // Obtiene el valor actual del filtro
      endBlur = "blur(" + endValue + "px)", // Establece el valor final del desenfoque
      match = getBlurMatch(target)[0], // Obtiene el valor actual del desenfoque
      index;
    if (filter === "none") {
      filter = ""; // Si no hay filtro, establece el filtro a una cadena vacía
    }
    if (match) {
      index = filter.indexOf(match); // Obtiene el índice del valor del desenfoque en el filtro
      endValue = filter.substr(0, index) + endBlur + filter.substr(index + match.length); // Crea el valor final del filtro
    } else {
      endValue = filter + endBlur; // Si no hay desenfoque, añade el desenfoque al final del filtro
      filter += filter ? " blur(0px)" : "blur(0px)"; // Si hay un filtro, añade el desenfoque al final, si no, establece el filtro al desenfoque
    }
    data.target = target; // Establece el objetivo
    data.interp = gsap.utils.interpolate(filter, endValue); // Interpola entre el valor inicial y final del filtro
  },
  render(progress, data) {
    data.target.style[blurProperty] = data.interp(progress); // Aplica el valor interpolado del filtro al objetivo
  }
});
})();

gsap.registerPlugin(ScrollTrigger); // Registra el plugin ScrollTrigger

// Animación de carga
const portfolioload = gsap.timeline(); // Crea una línea de tiempo
portfolioload.from(".white-header", { y: -30, duration: 2, opacity: 0, ease: "power4", }) // Anima el encabezado blanco
.from(".sentence", { yPercent: 100, duration: 2, stagger: 1, opacity: 0, skewY: 4, ease: "power4.out" }, "<"); // Anima las frases

const lenis = new Lenis({
lerp: 0.07 // Establece la interpolación lineal
});

lenis.on('scroll', ScrollTrigger.update); // Actualiza ScrollTrigger en el scroll

gsap.ticker.add((time) => {
lenis.raf(time * 1000) // Añade el tiempo al ticker
})

gsap.ticker.lagSmoothing(0) // Establece el suavizado de retraso a 0

// Parallax de las imágenes
gsap.utils.toArray('.img-cont').forEach(container => {
const img = container.querySelector('img'); // Selecciona la imagen

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: container, // Establece el contenedor como el disparador
    scrub: true,
    pin: false,
  }
});

tl.fromTo(img, {
  yPercent: -50, // Posición inicial de la imagen
  ease: 'none'
}, {
  yPercent: 100, // Posición final de la imagen
  ease: 'none'
});
});




// Animación del pie de página
gsap.set(".foot", { y: 100 }); // Establece la posición inicial del pie de página
gsap.from('.foot', {
scrollTrigger: {
  trigger: '.foot', // Establece el pie de página como el disparador
  scrub: true,
  skewX: 5,
  star: "top bottom",

},
yPercent: 0, // Posición final del pie de página
stagger: 0.1,
ease: 'power4.out',
duration: 1
});

gsap.from('.footer_title', {
scrollTrigger: {
  trigger: '.foot', // Establece el pie de página como el disparador
  marker: true,
},
blur: 20, // Desenfoque inicial
yPercent: 100, // Posición inicial del título del pie de página
stagger: 0.1,
skewX: -6,
ease: 'power4.out',
duration: 1.5 // Duración de la animación
});
