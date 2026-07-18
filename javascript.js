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

  const setMenuState = (isOpen) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    body.classList.toggle("nav-open", isOpen);
  };

  navToggle?.addEventListener("click", () => {
    setMenuState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenuState(false);
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

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
