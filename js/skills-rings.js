(function () {
  const items = document.querySelectorAll(".skills-counters .skill");
  if (!items.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function animateRing(ring, value, target) {
    if (reduceMotion) {
      ring.style.setProperty("--p", target);
      value.textContent = `${target}%`;
      return;
    }

    const start = performance.now();
    const duration = 1200;

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);

      ring.style.setProperty("--p", current);
      value.textContent = `${current}%`;

      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const ring = entry.target.querySelector(".ring");
        const value = entry.target.querySelector(".value");
        const target = +entry.target.dataset.percent || 0;

        animateRing(ring, value, target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  items.forEach((el) => observer.observe(el));
})();
