// ===== Planet of Icons – Original Physics + Performance Fix =====
(function () {
  const planetEl = document.getElementById('planet');
  if (!planetEl) return;

  const ICON_COUNT = 60;
  const ICONS = [
    "logos:html-5",
    "logos:css-3",
    "logos:javascript",
    "logos:react",
    "logos:bootstrap",
    "logos:tailwindcss-icon",
    "logos:git-icon",
    "logos:github-icon",
    "logos:visual-studio-code",
    "logos:typescript-icon",
  ];

  const nodes = [];

  // Create icon elements
  for (let i = 0; i < ICON_COUNT; i++) {
    const span = document.createElement('div');
    span.className = 'node';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = `<iconify-icon icon="${ICONS[i % ICONS.length]}" width="50" height="50"></iconify-icon>`;
    planetEl.appendChild(span);

    nodes.push({
      el: span,
      x: 0, y: 0, z: 0,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.3,
      ax: 0, ay: 0, az: 0
    });
  }

  // Radius calculation
  function updateRadius() {
    const rect = planetEl.getBoundingClientRect();
    return Math.min(rect.width, rect.height) / 2;
  }

  function computeAnchors(R_BASE) {
    const N = nodes.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      nodes[i].ax = x * R_BASE;
      nodes[i].ay = y * R_BASE;
      nodes[i].az = z * R_BASE;

      nodes[i].x = nodes[i].ax + (Math.random() - 0.5) * 6;
      nodes[i].y = nodes[i].ay + (Math.random() - 0.5) * 6;
      nodes[i].z = nodes[i].az + (Math.random() - 0.5) * 6;
    }
  }

  // Rotation state
  let rotX = 0.25, rotY = 0.35;
  let angVx = 0, angVy = 0;
  let lastTime = performance.now();
  let dragging = false, lastPointer = null, zoom = 1.0;
  let rafId = null;
  let running = false;
  let initialized = false;

  function pointerDown(x, y) { dragging = true; lastPointer = { x, y }; }
  function pointerMove(x, y) {
    if (!dragging) return;
    const dx = x - lastPointer.x;
    const dy = y - lastPointer.y;
    angVy += dx * 0.002;
    angVx += dy * 0.002;
    lastPointer = { x, y };
  }
  function pointerUp() { dragging = false; lastPointer = null; }

  planetEl.addEventListener('mousedown', e => { e.preventDefault(); pointerDown(e.clientX, e.clientY); });
  window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', pointerUp);

  planetEl.addEventListener('touchstart', e => { const t = e.touches[0]; pointerDown(t.clientX, t.clientY); }, { passive: false });
  window.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) pointerMove(t.clientX, t.clientY); }, { passive: false });
  window.addEventListener('touchend', pointerUp);

  planetEl.addEventListener('wheel', e => {
    e.preventDefault();
    zoom *= (1 - e.deltaY * 0.0012);
    zoom = Math.min(Math.max(zoom, 0.6), 1.6);
  }, { passive: false });

  const SPRING = 0.06, DAMP = 0.9, JITTER = 0.10;
  const REPULSE_DIST = 28, REPULSE_STRENGTH = 0.08;

  function render(now) {
    if (!running) return;
    rafId = requestAnimationFrame(render);

    const dt = Math.min((now - lastTime) / 16.6667, 3);
    lastTime = now;

    angVx *= 0.9;
    angVy *= 0.9;
    rotX += angVx * dt;
    rotY += angVy * dt;
    angVy += 0.0005 * dt;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      n.vx += (n.ax - n.x) * SPRING * dt;
      n.vy += (n.ay - n.y) * SPRING * dt;
      n.vz += (n.az - n.z) * SPRING * dt;

      n.vx += (Math.random() - 0.5) * JITTER * dt;
      n.vy += (Math.random() - 0.5) * JITTER * dt;
      n.vz += (Math.random() - 0.5) * JITTER * dt;

      for (let j = Math.max(0, i - 6); j < Math.min(nodes.length, i + 6); j++) {
        if (i === j) continue;
        const m = nodes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dz = n.z - m.z;
        const dist2 = dx*dx + dy*dy + dz*dz;
        if (dist2 < (REPULSE_DIST*REPULSE_DIST)) {
          const dist = Math.sqrt(dist2) || 0.0001;
          const push = (REPULSE_DIST - dist)/REPULSE_DIST;
          n.vx += (dx/dist) * push * REPULSE_STRENGTH * dt;
          n.vy += (dy/dist) * push * REPULSE_STRENGTH * dt;
          n.vz += (dz/dist) * push * REPULSE_STRENGTH * dt;
        }
      }

      n.vx *= DAMP; n.vy *= DAMP; n.vz *= DAMP;
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
    }

    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

    // ★ FIX: Cache radius ONCE per frame instead of calling updateRadius() per node
    const currentR = updateRadius();
    const perspective = 1200 * zoom;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      let rx = n.x;
      let ry = n.y*cosX - n.z*sinX;
      let rz = n.y*sinX + n.z*cosX;

      let fx = rx*cosY + rz*sinY;
      let fy = ry;
      let fz = -rx*sinY + rz*cosY;

      const scale = perspective/(perspective - fz);
      const sx = fx*scale;
      const sy = fy*scale;

      const el = n.el;
      el.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${Math.max(0.55, scale*0.9)})`;
      el.style.zIndex = Math.floor(1000 + fz);
      el.style.opacity = Math.min(1, 0.35 + (fz + currentR)/(2*currentR));
    }
  }

  // ---- Start / Stop ----
  function startRender() {
    if (running) return;
    // Initialize on first real activation (when element has dimensions)
    if (!initialized) {
      const R = updateRadius();
      if (R < 10) return; // Still hidden, can't init yet
      initialized = true;
      computeAnchors(R);
      // Watch for resize
      const ro = new ResizeObserver(() => {
        const R_NEW = updateRadius();
        if (R_NEW < 10) return;
        for (let n of nodes) {
          const mag = Math.sqrt(n.ax*n.ax + n.ay*n.ay + n.az*n.az) || 1;
          n.ax = (n.ax/mag) * R_NEW;
          n.ay = (n.ay/mag) * R_NEW;
          n.az = (n.az/mag) * R_NEW;
        }
      });
      ro.observe(planetEl);
    }
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(render);
  }

  function stopRender() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // ★ Pause when browser tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopRender();
    } else {
      // Resume only if skill section is active
      const skillSec = document.getElementById('skill');
      if (skillSec && skillSec.classList.contains('active')) startRender();
    }
  });

  // ★ Pause/resume based on SPA section (id="skill")
  const skillSection = document.getElementById('skill');
  if (skillSection) {
    new MutationObserver(() => {
      if (skillSection.classList.contains('active')) {
        startRender();
      } else {
        stopRender();
      }
    }).observe(skillSection, { attributes: true, attributeFilter: ['class'] });
  }

  // If skill is already active on load, start immediately
  window.addEventListener("load", () => {
    if (skillSection && skillSection.classList.contains('active')) {
      startRender();
    }
  });

  // Gentle auto-wobble
  setInterval(() => {
    if (!running) return;
    angVy += (Math.random() - 0.5) * 0.02;
    angVx += (Math.random() - 0.5) * 0.01;
  }, 2200);
})();
