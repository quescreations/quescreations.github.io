/* QOrigin Studios — ALIVE PASS (shared by index.html, rise.html, arcade.html)
   Molten gold drips + pool, gold pointer trail, rise cards that come alive,
   card tilt, section ignite, count-up stats, live 7:19 PM Chicago countdown,
   emblem sparkle burst + gold rush. No libraries, no external requests.
   Extreme visually, careful technically: capped particles, DPR caps,
   pauses when the tab is hidden, honors prefers-reduced-motion. */
(function () {
  'use strict';

  /* ---------- pure time math: next 7:19 PM in America/Chicago ---------- */
  var TZ = 'America/Chicago';
  function chicagoParts(ms) {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).formatToParts(new Date(ms));
    var o = {};
    for (var i = 0; i < parts.length; i++) o[parts[i].type] = parts[i].value;
    if (o.hour === '24') o.hour = '00';
    return o;
  }
  function nextDropMs(nowMs) {
    var p = chicagoParts(nowMs);
    var wallNow = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    var offset = wallNow - Math.floor(nowMs / 1000) * 1000;
    var targetWall = Date.UTC(+p.year, +p.month - 1, +p.day, 19, 19, 0);
    if (wallNow >= targetWall) targetWall += 86400000;
    return targetWall - offset;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { nextDropMs: nextDropMs, chicagoParts: chicagoParts };
  }
  if (typeof document === 'undefined') return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var smallScreen = Math.min(window.innerWidth, window.innerHeight) < 640;
  function aliveTick() {
    try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) {}
  }

  /* ---------- live countdown (text only — runs even for reduced motion) - */
  var cdEls = document.querySelectorAll('[data-countdown]');
  if (cdEls.length) {
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var tick = function () {
      var now = Date.now();
      var diff = Math.max(0, Math.floor((nextDropMs(now) - now) / 1000));
      var txt = pad(Math.floor(diff / 3600)) + ':' +
                pad(Math.floor(diff % 3600 / 60)) + ':' + pad(diff % 60);
      for (var i = 0; i < cdEls.length; i++) {
        var t = cdEls[i].querySelector('.cd-time');
        if (t) t.textContent = txt;
      }
    };
    tick();
    window.setInterval(tick, 250);
  }

  /* ---------- section ignite + count-up (fail-safe without IO) ---------- */
  var hasIO = typeof window.IntersectionObserver === 'function';
  if (!reduced && hasIO) {
    document.documentElement.classList.add('alive-js');
    var revealEls = document.querySelectorAll('main .section, main section.hero, main .doors');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('ignited'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { el.classList.add('alive-reveal'); rio.observe(el); });

    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-countup') || el.textContent, 10);
      if (!isFinite(target)) return;
      var start = null, dur = 1200;
      var step = function (ts) {
        if (!start) start = ts;
        var k = Math.min(1, (ts - start) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.stat strong, [data-countup]').forEach(function (el) {
      el.setAttribute('data-countup', el.getAttribute('data-countup') ||
        el.textContent.replace(/[^0-9]/g, ''));
      el.textContent = '0';
      cio.observe(el);
    });
  }

  /* ---------- rise cards come alive -------------------------------------- */
  var riseVideos = document.querySelectorAll('.rise-card video');
  riseVideos.forEach(function (v) {
    v.loop = true;
    var card = v.closest('.rise-card');
    if (!card) return;
    var markState = function () {
      card.classList.toggle('alive-playing', !v.paused && !v.ended);
    };
    v.addEventListener('play', markState);
    v.addEventListener('pause', markState);
    /* load the first frame only when the card nears the screen */
    if (hasIO && v.preload === 'none') {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { v.preload = 'metadata'; vio.disconnect(); }
        });
      }, { rootMargin: '600px' });
      vio.observe(card);
    }
    if (reduced) return;
    if (finePointer) {
      card.addEventListener('pointerenter', function () {
        if (v.paused) { var p = v.play(); if (p) p.catch(function () {}); }
      });
      card.addEventListener('pointerleave', function () { if (!v.paused) v.pause(); });
    }
    /* touch: a tap on the card body (never on a link, never on the video's
       own controls) toggles the rise; links stay exactly as they were */
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      if (e.target === v) return;
      if (v.paused) { aliveTick(); var p2 = v.play(); if (p2) p2.catch(function () {}); }
      else v.pause();
    });
  });

  /* ---------- rise shelf snap gallery: snapped card plays (mobile) ----- */
  if (!reduced && document.documentElement.classList.contains('rise-page') &&
      window.matchMedia('(max-width: 700px)').matches && hasIO) {
    var snapIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (!v) return;
        if (e.isIntersecting) { var p = v.play(); if (p) p.catch(function () {}); }
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.rise-page .rise-card').forEach(function (c) { snapIO.observe(c); });
  }

  /* ---------- card tilt (desktop pointers only, ~6 degrees max) ---------- */
  if (!reduced && finePointer) {
    document.querySelectorAll('.original-card, .character, .universe-card, .rise-card')
      .forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          var dx = (e.clientX - r.left) / r.width - 0.5;
          var dy = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = 'perspective(720px) rotateX(' + (-dy * 6).toFixed(2) +
            'deg) rotateY(' + (dx * 6).toFixed(2) + 'deg) translateY(-3px)';
          card.classList.add('alive-tilting');
        });
        card.addEventListener('pointerleave', function () {
          card.style.transform = '';
          card.classList.remove('alive-tilting');
        });
      });
  }

  /* ---------- molten gold canvas: drips, trail, sparkles, pool feed ------ */
  if (reduced) return; /* CSS fringe + static pool carry the reduced version */

  var goldHex = (window.getComputedStyle(document.documentElement)
    .getPropertyValue('--gold') || '').trim() || '#d6a92d';
  function hexRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function mix(rgb, other, k) {
    return [Math.round(rgb[0] + (other[0] - rgb[0]) * k),
            Math.round(rgb[1] + (other[1] - rgb[1]) * k),
            Math.round(rgb[2] + (other[2] - rgb[2]) * k)];
  }
  var GOLD = hexRgb(goldHex);
  var GOLD_CORE = mix(GOLD, [255, 255, 255], 0.55);
  var GOLD_DEEP = mix(GOLD, [0, 0, 0], 0.38);
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  var canvas = document.createElement('canvas');
  canvas.id = 'alive-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  var pool = document.createElement('div');
  pool.id = 'alive-pool';
  pool.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pool);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, DPR = 1;
  function sizeCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, smallScreen ? 1.25 : 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  var MAX_DRIPS = smallScreen ? 4 : 7;
  var MAX_PARTICLES = smallScreen ? 60 : 110;
  var drips = [], particles = [], ripples = [];
  var lastSpawn = 0, rushUntil = 0;

  function spawnDrip(now) {
    drips.push({
      x: 12 + Math.random() * (W - 24), y: -6,
      r: 2.5 + Math.random() * 3.5, len: 0,
      vy: 0, phase: 'form', born: now,
      wob: Math.random() * Math.PI * 2
    });
  }
  function burst(x, y, n, spread) {
    for (var i = 0; i < n; i++) {
      if (particles.length >= MAX_PARTICLES) break;
      var a = Math.random() * Math.PI * 2, sp = (0.3 + Math.random() * 0.7) * spread;
      particles.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.4,
        r: 1 + Math.random() * 2.2, born: performance.now(),
        life: 450 + Math.random() * 250
      });
    }
  }

  var lastTrail = 0;
  if (finePointer) {
    window.addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (now - lastTrail < 24 || particles.length >= MAX_PARTICLES) return;
      lastTrail = now;
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.2, vy: 0.25 + Math.random() * 0.3,
        r: 1 + Math.random() * 2, born: now, life: 420 + Math.random() * 180
      });
    }, { passive: true });
  }

  /* sparkle burst targets: the site lockup emblem (every page) plus the
     hero QYRO image and the mascot QYRO image on the homepage */
  var emblems = document.querySelectorAll('img[src*="qorigin-studios-lockup-wide"]');
  var burstTargets = document.querySelectorAll(
    'img[src*="qorigin-studios-lockup-wide"], .hero-img, .mascot-image img');
  burstTargets.forEach(function (el) {
    el.addEventListener('click', function (e) { burst(e.clientX, e.clientY, 22, 2.6); });
  });
  /* gold rush: 3 quick taps on the emblem */
  var emblemTaps = [];
  emblems.forEach(function (el) {
    el.classList.add('alive-emblem');
    el.addEventListener('click', function (e) {
      var now = performance.now();
      emblemTaps = emblemTaps.filter(function (t) { return now - t < 900; });
      emblemTaps.push(now);
      if (emblemTaps.length >= 3) {
        emblemTaps = [];
        rushUntil = now + 5000;
        burst(e.clientX, e.clientY, smallScreen ? 90 : 60, smallScreen ? 5.4 : 4.2);
        aliveTick();
      }
    });
  });

  /* ---------- scroll energy: stretch, kicked beads, pool slosh --------- */
  var scrollStretch = 0, poolSkew = 0, poolShift = 0, leanX = 0;
  var lastSY = window.scrollY, lastST = performance.now();
  window.addEventListener('scroll', function () {
    var now = performance.now();
    var y = window.scrollY, dt = Math.max(16, now - lastST);
    var v = (y - lastSY) / dt;
    lastSY = y; lastST = now;
    var a = Math.abs(v);
    if (a > 0.9) {
      scrollStretch = Math.min(20, a * 7);
      poolSkew = Math.max(-7, Math.min(7, -v * 2.4));
      poolShift = Math.max(-10, Math.min(10, v * 3.5));
      if (Math.random() < 0.5 && particles.length < MAX_PARTICLES) {
        particles.push({ x: Math.random() * W, y: Math.random() * H * 0.35,
          vx: (Math.random() - 0.5) * 0.4, vy: 0.8 + Math.random() * 0.8,
          r: 1 + Math.random() * 1.8, born: now, life: 520 });
      }
    }
  }, { passive: true });

  /* ---------- touch paints gold (never blocks scrolling) --------------- */
  if (window.matchMedia('(pointer: coarse)').matches) {
    var lastTouchPaint = 0;
    document.addEventListener('touchmove', function (e) {
      var now = performance.now();
      if (now - lastTouchPaint < 30) return;
      lastTouchPaint = now;
      var t = e.touches[0];
      if (!t) return;
      for (var i = 0; i < 2; i++) {
        if (particles.length >= MAX_PARTICLES) break;
        particles.push({ x: t.clientX + (Math.random() - 0.5) * 14,
          y: t.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 0.3, vy: 0.3 + Math.random() * 0.4,
          r: 1.2 + Math.random() * 2.4, born: now, life: 480 + Math.random() * 220 });
      }
      if (Math.random() < 0.3 && particles.length < MAX_PARTICLES) {
        particles.push({ x: t.clientX, y: t.clientY + 8, vx: 0, vy: 1.1,
          r: 1.8 + Math.random() * 1.6, born: now, life: 600 });
      }
    }, { passive: true });
  }

  /* ---------- tap ripples on open page (interactive elements excluded) - */
  document.addEventListener('click', function (e) {
    if (e.target.closest('a, button, video, input, img, .rise-card, .original-card, .character, .universe-card, .motion-card, .art-button, .alive-emblem')) return;
    ripples.push({ x: e.clientX, y: e.clientY, born: performance.now() });
    burst(e.clientX, e.clientY, 4, 1.1);
  });

  /* ---------- tilt gold: permission-honest device tilt ------------------ */
  var tiltPill = document.getElementById('alive-tilt-pill');
  if (tiltPill && !reduced && 'DeviceOrientationEvent' in window &&
      window.matchMedia('(pointer: coarse)').matches) {
    tiltPill.hidden = false;
    var tiltOn = false;
    var enableTilt = function () {
      if (tiltOn) return;
      tiltOn = true;
      tiltPill.classList.add('alive-on');
      tiltPill.textContent = 'It moves \u2014 tilt away';
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        leanX = Math.max(-1, Math.min(1, e.gamma / 35));
        var bx = Math.max(-1, Math.min(1, ((e.beta || 0) - 40) / 35));
        canvas.style.transform = 'translate(' + (leanX * 7).toFixed(1) + 'px,' +
          (bx * 5).toFixed(1) + 'px) scale(1.03)';
        var hero = document.querySelector('.hero-img');
        if (hero) hero.style.transform = 'translate(' + (-leanX * 6).toFixed(1) +
          'px,' + (-bx * 4).toFixed(1) + 'px) scale(1.04)';
      });
    };
    tiltPill.addEventListener('click', function () {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(function (res) {
          if (res === 'granted') enableTilt();
        }).catch(function () {});
      } else { enableTilt(); }
    });
  }

  var hidden = false;
  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
  });

  function drawDrip(d, now) {
    var stretch = d.phase === 'fall' ? Math.min(26, d.len) : d.len;
    if (d.phase === 'fall') stretch += scrollStretch;
    var grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 2.4);
    grad.addColorStop(0, rgba(GOLD_CORE, 0.95));
    grad.addColorStop(0.55, rgba(GOLD, 0.9));
    grad.addColorStop(1, rgba(GOLD_DEEP, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(d.x, d.y, d.r, d.r + stretch * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    if (stretch > 3) {
      ctx.strokeStyle = rgba(GOLD, 0.55);
      ctx.lineWidth = Math.max(1, d.r * 0.45);
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - stretch * 1.7);
      ctx.quadraticCurveTo(d.x + Math.sin(now / 300 + d.wob) * 1.6, d.y - stretch * 0.8, d.x, d.y);
      ctx.stroke();
    }
  }

  function frame(now) {
    window.requestAnimationFrame(frame);
    if (hidden) return;
    ctx.clearRect(0, 0, W, H);
    scrollStretch = Math.max(0, scrollStretch - 0.6);
    pool.style.transform = 'skewX(' + poolSkew.toFixed(2) + 'deg) translateX(' +
      poolShift.toFixed(1) + 'px)';
    poolSkew *= 0.92; poolShift *= 0.92;

    var rushing = now < rushUntil;
    var spawnEvery = rushing ? 260 : 1500 + Math.random() * 1400;
    var cap = rushing ? MAX_DRIPS + 8 : MAX_DRIPS;
    if (now - lastSpawn > spawnEvery && drips.length < cap) {
      spawnDrip(now); lastSpawn = now;
    }
    drips = drips.filter(function (d) { return d.phase !== 'done'; });
    drips.forEach(function (d) {
      var age = now - d.born;
      if (d.phase === 'form') {
        d.len = Math.min(10, age / 160);
        if (age > 1300) d.phase = 'stretch';
      } else if (d.phase === 'stretch') {
        d.len = Math.min(26, d.len + 0.35);
        if (d.len >= 26) d.phase = 'fall';
      } else if (d.phase === 'fall') {
        d.vy = Math.min(135, d.vy + 1.6);
        d.y += d.vy / 16.7;
        d.x += Math.sin(now / 380 + d.wob) * 0.25 + leanX * 0.6;
        if (d.y >= H - 16) {
          d.phase = 'done';
          for (var i = 0; i < 3; i++) {
            if (particles.length < MAX_PARTICLES) {
              particles.push({
                x: d.x + (Math.random() - 0.5) * 10, y: H - 10,
                vx: (Math.random() - 0.5) * 0.7, vy: -0.4 - Math.random() * 0.5,
                r: 0.8 + Math.random() * 1.4, born: now, life: 380
              });
            }
          }
        }
      }
      drawDrip(d, now);
    });

    particles = particles.filter(function (p) { return now - p.born < p.life; });
    particles.forEach(function (p) {
      var k = 1 - (now - p.born) / p.life;
      p.x += p.vx; p.y += p.vy; p.vy += 0.008;
      ctx.fillStyle = rgba(Math.random() < 0.3 ? GOLD_CORE : GOLD, 0.85 * k);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.3, p.r * k), 0, Math.PI * 2);
      ctx.fill();
    });

    ripples = ripples.filter(function (r) { return now - r.born < 700; });
    ripples.forEach(function (r) {
      var k = (now - r.born) / 700;
      ctx.strokeStyle = rgba(GOLD, 0.75 * (1 - k));
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 6 + k * 46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = rgba(GOLD_CORE, 0.5 * (1 - k));
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3 + k * 30, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
  window.requestAnimationFrame(frame);
})();
