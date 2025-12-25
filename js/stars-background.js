(function () {
  const container = document.querySelector(".stars-container");
  if (!container) return;

  const NUM_STARS = 170;
  const RADIUS = 170;
  const ATTRACT = 0.05;
  const RETURN_ATTRACT = 0.08;
  const DAMP = 0.86;
  const NOISE_AMPL = 0.35;
  const NOISE_SPEED = 0.015;

  const stars = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let t = 0;

  function rand(n = 1) {
    return Math.random() * n;
  }

  function noise(seed, time) {
    return Math.sin(time + seed) + Math.sin(time * 0.7 + seed * 1.7);
  }

  function createStar(x, y) {
    const el = document.createElement("div");
    el.className = "star";
    el.style.transform = `translate(${x}px, ${y}px)`;
    container.appendChild(el);
    return el;
  }

  for (let i = 0; i < NUM_STARS; i++) {
    const x = rand(window.innerWidth);
    const y = rand(window.innerHeight);

    stars.push({
      el: createStar(x, y),
      x,
      y,
      ox: x,
      oy: y,
      vx: 0,
      vy: 0,
      sx: rand(1000),
      sy: rand(1000),
    });
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    t += NOISE_SPEED;

    for (const s of stars) {
      const dx = mouseX - s.x;
      const dy = mouseY - s.y;
      const dist = Math.hypot(dx, dy);

      if (dist < RADIUS) {
        const force = (1 - dist / RADIUS) * ATTRACT;
        s.vx += (dx / (dist || 1)) * force * RADIUS;
        s.vy += (dy / (dist || 1)) * force * RADIUS;
      } else {
        const rdx = s.ox - s.x;
        const rdy = s.oy - s.y;
        const rdist = Math.hypot(rdx, rdy);
        if (rdist > 1) {
          s.vx += (rdx / rdist) * RETURN_ATTRACT * rdist;
          s.vy += (rdy / rdist) * RETURN_ATTRACT * rdist;
        }
      }

      s.vx += noise(s.sx, t) * NOISE_AMPL;
      s.vy += noise(s.sy, t) * NOISE_AMPL;

      s.vx *= DAMP;
      s.vy *= DAMP;

      s.x += s.vx * 0.016;
      s.y += s.vy * 0.016;

      s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
