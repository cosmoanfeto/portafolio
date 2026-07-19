(() => {
  "use strict";

  const body = document.body;
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const progressBar = document.querySelector(".scroll-progress span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let menuOpen = false;
  let lockedScrollY = 0;

  const lockPageScroll = () => {
    lockedScrollY = window.scrollY || window.pageYOffset;
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.right = "0";
    body.style.left = "0";
    body.style.width = "100%";
  };

  const unlockPageScroll = () => {
    const restoreY = lockedScrollY;
    body.style.position = "";
    body.style.top = "";
    body.style.right = "";
    body.style.left = "";
    body.style.width = "";
    window.scrollTo({ top: restoreY, left: 0, behavior: "auto" });
  };

  const setMenuState = (isOpen, restoreFocus = true) => {
    if (!nav || !navToggle || isOpen === menuOpen) return;

    menuOpen = isOpen;
    nav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    body.classList.toggle("nav-open", isOpen);

    if (isOpen) {
      lockPageScroll();
      window.requestAnimationFrame(() => navLinks[0]?.focus({ preventScroll: true }));
    } else {
      unlockPageScroll();
      if (restoreFocus) navToggle.focus({ preventScroll: true });
    }
  };

  navToggle?.addEventListener("click", () => {
    setMenuState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false, false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && menuOpen) setMenuState(false, false);
  });

  window.addEventListener("pageshow", () => {
    if (menuOpen) setMenuState(false, false);
  });

  let ticking = false;
  const updateOnScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(scrollY / documentHeight, 0), 1);

    header?.classList.toggle("is-scrolled", scrollY > 18);
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (!reducedMotion) root.style.setProperty("--hero-parallax", `${Math.min(scrollY * 0.10, 90)}px`);
    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateOnScroll);
  };

  updateOnScroll();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const matches = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", matches);
            if (matches) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 85, 255)}ms`);
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    root.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9%", threshold: 0.08 }
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;
        card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* Audio: la música inicia únicamente después de pulsar el botón,
     porque los navegadores bloquean el autoplay con sonido. */
  const musicToggle = document.getElementById("music-toggle");
  const musicStatus = document.getElementById("music-status");
  const backgroundMusic = document.getElementById("background-music");
  const clickSound = document.getElementById("click-sound");

  const readPreference = () => {
    try {
      return window.localStorage.getItem("portfolioMusic") === "on";
    } catch {
      return false;
    }
  };

  const savePreference = (enabled) => {
    try {
      window.localStorage.setItem("portfolioMusic", enabled ? "on" : "off");
    } catch {
      // El sitio sigue funcionando aunque el navegador bloquee localStorage.
    }
  };

  const setMusicUI = (isPlaying, statusText = isPlaying ? "Sonando" : "Activar") => {
    if (!musicToggle || !musicStatus) return;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Desactivar música de fondo" : "Activar música de fondo");
    musicStatus.textContent = statusText;
  };

  if (backgroundMusic) {
    backgroundMusic.volume = 0.28;
    backgroundMusic.load();
  }
  if (clickSound) {
    clickSound.volume = 0.32;
    clickSound.load();
  }

  let musicEnabled = readPreference();
  let pausedByVisibility = false;
  setMusicUI(false, musicEnabled ? "Reanudar" : "Activar");

  const playMusic = async () => {
    if (!backgroundMusic || !musicToggle) return;
    try {
      await backgroundMusic.play();
      musicEnabled = true;
      savePreference(true);
      setMusicUI(true);
    } catch {
      setMusicUI(false, "No disponible");
    }
  };

  const pauseMusic = () => {
    if (!backgroundMusic) return;
    backgroundMusic.pause();
    musicEnabled = false;
    savePreference(false);
    setMusicUI(false);
  };

  musicToggle?.addEventListener("click", () => {
    if (!backgroundMusic) return;
    if (backgroundMusic.paused) playMusic();
    else pauseMusic();
  });

  backgroundMusic?.addEventListener("error", () => {
    if (!musicToggle) return;
    musicToggle.disabled = true;
    setMusicUI(false, "Audio pendiente");
  });

  const playClickSound = () => {
    if (!clickSound) return;
    try {
      clickSound.currentTime = 0;
      const playAttempt = clickSound.play();
      if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(() => {});
    } catch {
      // No interrumpe la navegación si el formato no es compatible.
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      const interactive = event.target.closest("a, button, [role='button'], input[type='button'], input[type='submit']");
      if (!interactive || interactive.matches(":disabled") || interactive.getAttribute("aria-disabled") === "true") return;
      playClickSound();
    },
    { capture: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (!backgroundMusic) return;

    if (document.hidden && !backgroundMusic.paused) {
      pausedByVisibility = true;
      backgroundMusic.pause();
      setMusicUI(false, "En pausa");
      return;
    }

    if (!document.hidden && pausedByVisibility && musicEnabled) {
      pausedByVisibility = false;
      playMusic();
    }
  });

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
