'use strict';

/* ══════════════════════════════════════════════════
   P. LASHWIN 1ST BIRTHDAY — MASTER SCRIPT v5
   - Downward-to-Upward buoyant rising balloons
   - Antigravity Water Ripple & Fluid Cursor Physics
   - Crystal-clear sharp imagery & interactive actions
══════════════════════════════════════════════════ */

const BDAY = new Date('2026-12-02T00:00:00');

/* ════════════════════════════════════════════
   CANVAS: Upward Rising Balloons + Antigravity Water Ripples
════════════════════════════════════════════ */
(function initCanvasExperience() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* Helper functions */
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return [r,g,b];
  }
  function lighten(hex, amt) {
    const [r,g,b] = hexToRgb(hex);
    return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
  }
  function darken(hex, amt) {
    const [r,g,b] = hexToRgb(hex);
    return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
  }
  function randRange(a,b){ return a + Math.random()*(b-a); }

  const BALLOON_COLORS = [
    '#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa', // vibrant blues
    '#ffffff', '#e0eeff', '#bfdbfe',             // crystal white & pearl
    '#d4a017', '#f5d060', '#fbbf24',             // festive golds
    '#7c3aed', '#a78bfa',                         // prince purples
    '#06b6d4', '#38bdf8'                          // bright cyan
  ];

  /* ══════════════════════════════
     REALISTIC 3D BALLOON
  ══════════════════════════════ */
  function drawBalloon(ctx, x, y, rx, ry, color, alpha, angle) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(x, y);
    ctx.rotate(angle);

    /* Main balloon sphere with 3D gradient */
    const bodyGrad = ctx.createRadialGradient(-rx*0.28, -ry*0.3, rx*0.08, 0, 0, Math.max(rx,ry)*1.1);
    bodyGrad.addColorStop(0, lighten(color, 90));
    bodyGrad.addColorStop(0.35, lighten(color, 30));
    bodyGrad.addColorStop(0.75, color);
    bodyGrad.addColorStop(1, darken(color, 55));

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI*2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    /* 3D rim lighting */
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI*2);
    ctx.strokeStyle = darken(color, 30);
    ctx.lineWidth = rx * 0.06;
    ctx.globalAlpha = alpha * 0.3;
    ctx.stroke();
    ctx.globalAlpha = alpha;

    /* Specular primary shine */
    const shineGrad = ctx.createRadialGradient(-rx*0.28, -ry*0.3, 0, -rx*0.2, -ry*0.22, rx*0.48);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-rx*0.22, -ry*0.28, rx*0.38, ry*0.22, -0.35, 0, Math.PI*2);
    ctx.fillStyle = shineGrad;
    ctx.fill();
    ctx.restore();

    /* Secondary shine reflection */
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(rx*0.22, ry*0.18, rx*0.12, ry*0.08, 0.5, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.fill();
    ctx.restore();

    /* Bottom tie knot */
    const knotGrad = ctx.createRadialGradient(0, ry+4, 0, 0, ry+4, 7);
    knotGrad.addColorStop(0, lighten(color, 20));
    knotGrad.addColorStop(1, darken(color, 40));
    ctx.beginPath();
    ctx.arc(0, ry + 5, 5, 0, Math.PI*2);
    ctx.fillStyle = knotGrad;
    ctx.fill();

    /* Triangle fold */
    ctx.beginPath();
    ctx.moveTo(-4, ry+2);
    ctx.lineTo(4, ry+2);
    ctx.lineTo(0, ry+10);
    ctx.closePath();
    ctx.fillStyle = darken(color, 30);
    ctx.globalAlpha = alpha * 0.7;
    ctx.fill();
    ctx.globalAlpha = alpha;

    /* Swaying string */
    const stringLen = ry * 2.6 + 30;
    ctx.beginPath();
    ctx.moveTo(0, ry + 10);
    ctx.bezierCurveTo(
      rx * 0.5,  ry + stringLen * 0.35,
      -rx * 0.4, ry + stringLen * 0.65,
      rx * 0.2,  ry + stringLen
    );
    ctx.strokeStyle = darken(color, 15);
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = alpha * 0.65;
    ctx.stroke();

    ctx.restore();
  }

  /* ══════════════════════════════
     GLOWING STARS
  ══════════════════════════════ */
  function drawStar(ctx, x, y, r, alpha, color) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(x, y);

    const glow = ctx.createRadialGradient(0,0,0,0,0,r*2.5);
    glow.addColorStop(0, color.replace('rgb','rgba').replace(')',`, ${alpha*0.4})`));
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(0,0,r*2.5,0,Math.PI*2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    for (let i=0; i<10; i++) {
      const ang = (i*Math.PI/5) - Math.PI/2;
      const rad = i%2===0 ? r : r*0.42;
      i===0 ? ctx.moveTo(Math.cos(ang)*rad, Math.sin(ang)*rad)
            : ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /* ══════════════════════════════
     ANTIGRAVITY WATER RIPPLES
  ══════════════════════════════ */
  const ripples = [];
  function addWaterRipple(x, y) {
    ripples.push({
      x, y,
      radius: 4,
      maxRadius: randRange(60, 110),
      speed: randRange(2.2, 3.8),
      alpha: 0.85
    });
  }

  function drawRipples(ctx) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.speed;
      r.alpha  *= 0.94; // smooth fade

      if (r.alpha <= 0.02 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.save();
      // Primary water ripple ring
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(96, 165, 250, ${r.alpha})`;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Secondary soft inner ripple
      if (r.radius > 16) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 208, 96, ${r.alpha * 0.6})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ══════════════════════════════
     PARTICLE SYSTEMS
  ══════════════════════════════ */
  const balloons   = [];
  const stars      = [];
  const cakes      = [];
  const confettis  = [];
  const starColors = ['#ffffff','#60a5fa','#bfdbfe','#f5d060','#d4a017','#a78bfa'];
  const confColors = ['#2563eb','#60a5fa','#ffffff','#f5d060','#d4a017','#7c3aed','#38bdf8'];

  /* MOUSE POSITION & ANTIGRAVITY FIELD */
  const mouse = { x: -1000, y: -1000, active: false };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    // Trigger water ripple on mouse move (throttled)
    if (Math.random() > 0.65) {
      addWaterRipple(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
      if (Math.random() > 0.6) {
        addWaterRipple(mouse.x, mouse.y);
      }
    }
  }, {passive:true});

  window.addEventListener('click', e => {
    addWaterRipple(e.clientX, e.clientY);
    addWaterRipple(e.clientX, e.clientY);
    burstCelebration(e.clientX, e.clientY);
  });

  /* Spawn rising balloon (Downwards to Upward) */
  function spawnRisingBalloon(initialY) {
    const rx = randRange(24, 46);
    const ry = rx * randRange(1.22, 1.46);
    balloons.push({
      x: randRange(rx, W - rx),
      y: initialY !== undefined ? initialY : H + ry + randRange(10, 80),
      baseX: 0,
      rx, ry,
      color: BALLOON_COLORS[Math.floor(Math.random()*BALLOON_COLORS.length)],
      vy: -randRange(0.85, 1.8), // rising upwards
      vx: randRange(-0.25, 0.25),
      swayAmp: randRange(16, 36),
      swayFreq: randRange(0.009, 0.02),
      phase: Math.random()*Math.PI*2,
      angle: randRange(-0.15, 0.15),
      angleV: randRange(-0.002, 0.002),
      alpha: randRange(0.7, 0.95),
      pushX: 0,
      pushY: 0
    });
  }

  function spawnStar(initialY) {
    stars.push({
      x: randRange(0, W),
      y: initialY !== undefined ? initialY : H + 20 + randRange(0, 60),
      r: randRange(3, 9),
      vy: -randRange(0.4, 1.1),
      vx: randRange(-0.25, 0.25),
      phase: Math.random()*Math.PI*2,
      phaseSpeed: randRange(0.03, 0.07),
      color: starColors[Math.floor(Math.random()*starColors.length)],
      alpha: randRange(0.5, 0.95)
    });
  }

  function spawnCake() {
    cakes.push({
      x: randRange(0.08*W, 0.92*W),
      y: H + 60,
      size: randRange(32, 54),
      vy: -randRange(0.4, 0.8),
      vx: randRange(-0.2, 0.2),
      alpha: randRange(0.6, 0.9)
    });
  }

  function spawnConfetti(initialY) {
    confettis.push({
      x: randRange(0, W),
      y: initialY !== undefined ? initialY : H + 10,
      size: randRange(7, 14),
      vy: -randRange(0.6, 1.8),
      vx: randRange(-0.5, 0.5),
      rotation: Math.random()*Math.PI*2,
      rotV: randRange(-0.04, 0.04),
      color: confColors[Math.floor(Math.random()*confColors.length)],
      alpha: randRange(0.55, 0.9)
    });
  }

  /* Seed initial pool distributed from footer to top header */
  for (let i = 0; i < 22; i++) {
    spawnRisingBalloon(randRange(-50, H));
  }
  for (let i = 0; i < 35; i++) {
    spawnStar(randRange(0, H));
  }
  for (let i = 0; i < 4; i++) {
    spawnCake();
    cakes[cakes.length-1].y = randRange(0, H);
  }
  for (let i = 0; i < 40; i++) {
    spawnConfetti(randRange(0, H));
  }

  /* Spawn loops — continuous upward flow */
  setInterval(() => spawnRisingBalloon(), 1200);
  setInterval(spawnStar, 600);
  setInterval(spawnCake, 6500);
  setInterval(spawnConfetti, 350);

  /* Celebration pop */
  window.burstCelebration = (cx, cy) => {
    for (let i = 0; i < 4; i++) {
      const rx = randRange(22, 38);
      balloons.push({
        x: cx + randRange(-30, 30),
        y: cy + randRange(-30, 30),
        rx, ry: rx * 1.3,
        color: BALLOON_COLORS[Math.floor(Math.random()*BALLOON_COLORS.length)],
        vy: -randRange(1.8, 3.2), // fast shoot up
        vx: randRange(-1.5, 1.5),
        swayAmp: 20,
        swayFreq: 0.015,
        phase: Math.random()*Math.PI*2,
        angle: 0,
        angleV: randRange(-0.005, 0.005),
        alpha: 1,
        pushX: 0, pushY: 0
      });
    }
    for (let i = 0; i < 16; i++) {
      confettis.push({
        x: cx, y: cy,
        size: randRange(8, 16),
        vy: randRange(-3.5, 2.5),
        vx: randRange(-3, 3),
        rotation: Math.random()*Math.PI*2,
        rotV: randRange(-0.08, 0.08),
        color: confColors[Math.floor(Math.random()*confColors.length)],
        alpha: 1
      });
    }
  };

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    /* 1. Draw Water Ripples */
    drawRipples(ctx);

    /* 2. Draw & Update Balloons (Downwards to Upwards + Antigravity Mouse Push) */
    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];

      // Antigravity mouse repulsion field
      if (mouse.active) {
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radiusLimit = 180;
        if (dist < radiusLimit && dist > 0) {
          const force = (radiusLimit - dist) / radiusLimit;
          const angle = Math.atan2(dy, dx);
          b.pushX += Math.cos(angle) * force * 1.8;
          b.pushY += Math.sin(angle) * force * 1.8;
        }
      }

      // Elastic decay of push
      b.pushX *= 0.92;
      b.pushY *= 0.92;

      // Vertical rise from bottom to top
      b.y += b.vy + b.pushY;
      b.x += b.vx + b.pushX + Math.sin(frame * b.swayFreq + b.phase) * 0.6;
      b.angle += b.angleV;

      // Despawn once floated past the top header
      if (b.y < -b.ry * 2 - 80) {
        balloons.splice(i, 1);
        continue;
      }

      drawBalloon(ctx, b.x, b.y, b.rx, b.ry, b.color, b.alpha, b.angle);
    }

    /* 3. Draw & Update Stars */
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.y += s.vy;
      s.x += s.vx;
      s.phase += s.phaseSpeed;
      const twinAlpha = s.alpha * (0.55 + 0.45 * Math.abs(Math.sin(s.phase)));
      if (s.y < -30) { stars.splice(i, 1); continue; }
      drawStar(ctx, s.x, s.y, s.r, twinAlpha, s.color);
    }

    /* 4. Draw & Update Cakes */
    for (let i = cakes.length - 1; i >= 0; i--) {
      const c = cakes[i];
      c.y += c.vy;
      c.x += c.vx;
      if (c.y < -c.size * 2) { cakes.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.font = `${c.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(96,165,250,0.6)';
      ctx.shadowBlur = 18;
      ctx.fillText('🎂', c.x, c.y);
      ctx.restore();
    }

    /* 5. Draw & Update Confetti */
    for (let i = confettis.length - 1; i >= 0; i--) {
      const c = confettis[i];
      c.y += c.vy;
      c.x += c.vx + Math.sin(frame * 0.02 + i) * 0.3;
      c.rotation += c.rotV;
      if (c.y < -20) { confettis.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size/2, -c.size/4, c.size, c.size/2);
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ════════════════════════════════════════════
   SCROLL TRACKER & PARALLAX ACTIONS
════════════════════════════════════════════ */
(function initScrollTracker() {
  const bar = document.getElementById('scrollProgress');
  const rows = document.querySelectorAll('.moment-row');
  const navLinks = document.querySelectorAll('.nl');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (bar) bar.style.width = Math.min(100, Math.max(0, progress)) + '%';

    // Active Section Highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Dynamic 3D tilt & smooth translation on scroll
    const vh = window.innerHeight;
    rows.forEach(row => {
      const rect = row.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const offset = (rect.top - vh / 2) * 0.06;
        const photo = row.querySelector('.mrp-wrap');
        const text  = row.querySelector('.mr-text');
        if (photo) photo.style.transform = `translateY(${offset * -0.7}px)`;
        if (text)  text.style.transform  = `translateY(${offset * 0.5}px)`;
      }
    });
  }, {passive:true});
})();

/* ════════════════════════════════════════════
   NAV
════════════════════════════════════════════ */
(function initNav() {
  const nav  = document.getElementById('nav');
  const hbg  = document.getElementById('hamburger');
  const mob  = document.getElementById('mobNav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('sc', window.scrollY > 50);
  }, {passive:true});

  hbg.addEventListener('click', () => mob.classList.toggle('open'));
  window.closeMob = () => mob.classList.remove('open');
})();

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
(function() {
  const items = document.querySelectorAll('.hero-left .rev, .hero-right.rev');
  setTimeout(() => {
    items.forEach((el) => {
      const delay = parseInt(el.dataset.d || 0);
      setTimeout(() => el.classList.add('vis'), delay);
    });
  }, 200);
})();

(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('vis'), delay);
      obs.unobserve(e.target);
    });
  }, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rev-blk').forEach(el => obs.observe(el));
})();

(function() {
  const rows = document.querySelectorAll('.moment-row');
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('mr-vis');
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  rows.forEach(r => obs.observe(r));
})();

/* ════════════════════════════════════════════
   COUNTDOWN TIMER
════════════════════════════════════════════ */
(function() {
  const elD = document.getElementById('cdD');
  const elH = document.getElementById('cdH');
  const elM = document.getElementById('cdM');
  const elS = document.getElementById('cdS');
  const els = {d:elD, h:elH, m:elM, s:elS};

  function flip(el, val) {
    if (!el || el.textContent === val) return;
    el.classList.remove('flip');
    void el.offsetWidth;
    el.textContent = val;
    el.classList.add('flip');
  }

  function tick() {
    const diff = BDAY - Date.now();
    if (diff <= 0) { Object.values(els).forEach(el => el && (el.textContent='00')); return; }
    flip(elD, String(Math.floor(diff/86400000)).padStart(2,'0'));
    flip(elH, String(Math.floor((diff%86400000)/3600000)).padStart(2,'0'));
    flip(elM, String(Math.floor((diff%3600000)/60000)).padStart(2,'0'));
    flip(elS, String(Math.floor((diff%60000)/1000)).padStart(2,'0'));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ════════════════════════════════════════════
   MOUSE 3D TILT ON HERO PHOTO
════════════════════════════════════════════ */
(function() {
  const bubble = document.querySelector('.photo-bubble');
  if (!bubble || window.matchMedia('(max-width:768px)').matches) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const rx = ((e.clientY-cy)/cy)*-9;
    const ry = ((e.clientX-cx)/cx)*9;
    bubble.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    bubble.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
})();

/* ════════════════════════════════════════════
   PARALLAX SCENE
════════════════════════════════════════════ */
(function() {
  const scene = document.querySelector('.hero-photo-scene');
  window.addEventListener('scroll', () => {
    if (!scene) return;
    const y = window.scrollY;
    if (y < window.innerHeight) scene.style.transform = `translateY(${y*0.1}px)`;
  }, {passive:true});
})();

/* ════════════════════════════════════════════
   SCROLL CUE
════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const cue = document.getElementById('scrollCue');
  if (cue && window.scrollY > 80) { cue.style.opacity='0'; cue.style.transition='opacity .5s'; }
}, {passive:true});

/* ════════════════════════════════════════════
   CURSOR WATER DROPLET & SPARKLE TRAIL
════════════════════════════════════════════ */
(function() {
  if (window.matchMedia('(max-width:768px)').matches) return;
  const FX = ['💧','✨','⭐','💙','🎈','🌟'];
  let last = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;
    const sp = document.createElement('span');
    sp.textContent = FX[Math.floor(Math.random()*FX.length)];
    sp.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      font-size:${11+Math.random()*12}px;pointer-events:none;z-index:9999;
      transform:translate(-50%,-50%);transition:all 0.9s ease;user-select:none;
    `;
    document.body.appendChild(sp);
    requestAnimationFrame(() => {
      sp.style.transform = `translate(-50%,-${35+Math.random()*65}px) scale(0)`;
      sp.style.opacity = '0';
    });
    setTimeout(() => sp.remove(), 920);
  });
})();

/* ════════════════════════════════════════════
   WISH FORM
════════════════════════════════════════════ */
(function() {
  const form = document.getElementById('wishForm');
  const ok   = document.getElementById('wishOk');
  const list = document.getElementById('wishesList');

  const defaults = [
    {n:'Grandma & Grandpa 💛', m:'Happy Birthday our dearest Lashwin! May God bless you with long life, good health and endless happiness! 🎉', t:'Just now'},
    {n:'Uncle & Aunty 🌟',      m:'Our little prince is turning 1! You are the most adorable, the most loved! Wishing you a magical birthday! 🎈❤️', t:'5 mins ago'},
    {n:'Family Friends 💙',     m:'Happy 1st Birthday sweet Lashwin! May every year be filled with love, laughter and endless blessings! 🎂', t:'12 mins ago'},
  ];

  function esc(t){const d=document.createElement('div');d.appendChild(document.createTextNode(t));return d.innerHTML;}

  function addWish(n, m, t) {
    if (!list) return;
    const ini = n.trim().split(/\s+/).map(w=>w[0]).join('').substring(0,2).toUpperCase();
    const el  = document.createElement('div');
    el.className = 'w-item';
    el.innerHTML = `<div class="w-top"><div class="w-av">${ini}</div><span class="w-name">${esc(n)}</span><span class="w-time">${t}</span></div><p class="w-msg">${esc(m)}</p>`;
    list.insertBefore(el, list.firstChild);
  }

  defaults.forEach(w => addWish(w.n, w.m, w.t));
  const saved = JSON.parse(localStorage.getItem('lw5') || '[]');
  saved.slice(-5).forEach(w => {
    const d = new Date(w.ts);
    addWish(w.n, w.m, d.toLocaleDateString('en-IN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('wfN').value.trim();
    const m = document.getElementById('wfM').value.trim();
    if (!n || !m) return;

    // 1. Add to live on-page wish list
    addWish(n, m, 'Just now');
    const all = JSON.parse(localStorage.getItem('lw5') || '[]');
    all.push({n, m, ts: new Date().toISOString()});
    localStorage.setItem('lw5', JSON.stringify(all));

    // 2. Build WhatsApp message for 9080615583
    const waNumber = '919080615583';
    const waText = `🎉 *Happy 1st Birthday P. Lashwin!* 🎂👑\n\n*From:* ${n}\n*Birthday Wish:* ${m}\n\nWishing our little prince a wonderful life filled with health, joy, and divine blessings! ❤️`;
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(waText)}`;

    const reopenBtn = document.getElementById('btnReopenWa');
    if (reopenBtn) reopenBtn.setAttribute('href', waUrl);

    // 3. Open WhatsApp directly
    window.open(waUrl, '_blank');

    form.style.display = 'none';
    ok.classList.add('show');
  });

  window.resetWish = () => {
    form.reset(); form.style.display = 'flex'; ok.classList.remove('show');
  };
})();

/* ════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ════════════════════════════════════════════
   SHARE
════════════════════════════════════════════ */
window.shareIt = async () => {
  const data = {title:"P. Lashwin's 1st Birthday Invitation!",text:"You're invited to P. Lashwin's 1st Birthday on 02 December 2026! 🎂👑",url:window.location.href};
  if (navigator.share) { try{await navigator.share(data);}catch{} }
  else {
    await navigator.clipboard.writeText(window.location.href).catch(()=>{});
    const btn = document.querySelector('.ft-actions .btn');
    if(btn){const o=btn.innerHTML;btn.innerHTML='✅ Link Copied!';setTimeout(()=>btn.innerHTML=o,2000);}
  }
};
