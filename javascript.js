(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setMenuState = (isOpen) => {
    if (!nav || !navToggle) return;

    nav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    body.classList.toggle("nav-open", isOpen);
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenuState(false);
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

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

  const revealElements = [...document.querySelectorAll(".reveal")];

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
