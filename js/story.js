/* The story. Loaded only after the countdown unlocks. Content comes from DATA (js/data.js). */
(function () {
  var A = window.ART, D = window.DATA, C = window.CONFIG;
  var INK = "#0b0b0b", WHITE = "#ffffff";
  var NAMES = C.NAMES.join(" × ");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmt(n) { return Number(n).toLocaleString("en-US"); }
  // A counting number: starts at 0 and counts up to `n` over `ms`.
  function num(n, ms, style) {
    return '<span data-count="' + n + '" data-ms="' + ms + '" style="font-variant-numeric:tabular-nums;' + (style || "") + '">0</span>';
  }
  function T(style, html, cls, d) { // absolutely positioned text block
    return '<div class="abs ' + (cls || "rise") + '" style="' + style + (d !== undefined ? ";--d:" + d + "s" : "") + '">' + html + "</div>";
  }
  var BOLD = "font-weight:900;letter-spacing:-2px;line-height:.95;";

  /* Each screen: bg, ink, dur (ms), html() */
  var SCREENS = [
    // 1 Intro
    { bg: "#ff5b3f", ink: INK, html: function () {
      return A.chromeBlock("top:0;left:0", 150, 190) +
        A.burst("top:-60px;left:150px", 170) +
        T("top:300px;left:0;right:0;text-align:center",
          '<div style="font-size:76px;' + BOLD + '">' + D.years.replace("—", "<br>—") + "</div>" +
          '<div style="font-size:44px;font-weight:800;letter-spacing:-1.5px;margin-top:14px">' + D.title + "</div>" +
          '<div style="font-size:15px;font-weight:600;margin-top:10px">' + D.tagline + "</div>", "rise", 0.3) +
        A.tube("left:-40px;bottom:40px", 300, 190, "M20 20 C 60 160, 150 170, 170 110 S 250 30, 290 180", 0.5) +
        A.heart("right:-30px;bottom:110px", 190);
    } },
    // 2 First message
    { bg: "#f772c4", ink: INK, html: function () {
      var f = D.firstMessage;
      return T("top:70px;left:24px", A.hl(f.date, INK, "#f772c4", 16), "rise", 0) +
        T("top:112px;left:24px;right:24px;font-size:30px;font-weight:800;line-height:1.1;letter-spacing:-.8px", f.headline, "rise", 0.15) +
        T("top:250px;left:0;right:0;text-align:center;font-family:Cairo,sans-serif;font-size:130px;font-weight:900;line-height:1", f.big, "pop", 0.4) +
        T("top:470px;right:36px;background:" + INK + ";color:#f772c4;font-family:Cairo,Figtree,sans-serif;font-size:64px;font-weight:900;padding:0 22px;--r:-4deg;--r0:-20deg", f.reply, "pop", 1.2) +
        T("top:620px;left:24px;right:24px;font-size:16px;font-weight:600;line-height:1.4", f.caption, "rise", 1.6) +
        A.burst("top:190px;left:-70px", 140, { seed: 2 });
    } },
    // 3 First conversation: number in 4 bands
    { bg: "#eef542", ink: INK, html: function () {
      var f = D.firstConversation, cols = ["#ff5b3f", "#f772c4", "#a6f6ec", INK], txt = [INK, INK, INK, "#eef542"], out = "";
      cols.forEach(function (c, i) {
        out += '<div class="abs ' + (i % 2 ? "slideR" : "slideL") + '" style="top:' + (160 + i * 112) + "px;left:0;right:0;height:112px;background:" + c + ";--d:" + i * 0.18 + 's;overflow:hidden"><div style="' + BOLD + "font-size:" + (f.number > 999 ? 108 : 150) + "px;line-height:112px;text-align:center;color:" + txt[i] + '">' + (i === 3 ? num(f.number, 1800) : fmt(f.number)) + "</div></div>";
      });
      return T("top:70px;left:24px", A.hl(f.date, INK, "#eef542", 16), "rise", 0) +
        out +
        T("top:640px;left:24px;right:24px;font-size:22px;font-weight:800;line-height:1.15;letter-spacing:-.5px", f.label, "rise", 1);
    } },
    // 4 Season 1 title card
    { bg: INK, ink: WHITE, html: function () {
      var s = D.season1, stripes = "";
      for (var i = 0; i < 6; i++) {
        stripes += '<div class="abs slideL" style="top:' + (80 + i * 56) + "px;left:0;right:0;height:26px;background:" + (i % 2 ? "#f772c4" : "#e8261f") + ";--d:" + i * 0.1 + 's"></div>';
      }
      return stripes +
        T("top:470px;left:0;right:0;text-align:center", A.hl(s.label, "#e8261f", WHITE, 20, "letter-spacing:3px"), "pop", 0.8) +
        T("top:530px;left:24px;right:24px;text-align:center;color:" + WHITE + ";font-size:62px;" + BOLD, s.title, "rise", 1);
    } },
    // 5 Total messages
    { bg: "#ff5b3f", ink: INK, html: function () {
      var t = D.totalMessages;
      return A.burst("top:60px;right:-90px", 300, { seed: 4 }) +
        A.chromeBlock("bottom:130px;left:0", 190, 120, "slideL", 0.2) +
        T("top:230px;left:24px;font-size:96px;" + BOLD, num(t.number, 2200), "rise", 0.3) +
        T("top:350px;left:24px", A.hl(t.label, INK, "#ff5b3f", 22), "slideL", 0.8) +
        T("top:410px;left:24px", A.hl(t.sub, WHITE, INK, 16), "slideL", 1.1);
    } },
    // 6 Who texted more
    { bg: "#cf1a7e", ink: WHITE, html: function () {
      var w = D.whoTexted, max = Math.max(w.a.value, w.b.value, 1);
      function bar(top, p, color, who, delay) {
        var width = Math.max(40, Math.round(330 * (p.value / max)));
        return T("top:" + top + "px;left:0;width:" + width + "px;height:96px;background:" + color + ";border-radius:0 48px 48px 0;display:flex;align-items:center;justify-content:flex-end;padding-right:26px;font-size:48px;font-weight:900;letter-spacing:-1.5px;color:" + INK, num(p.value, 1600), "grow", delay) +
          T("top:" + (top + 106) + "px;left:24px;font-size:15px;font-weight:800;letter-spacing:1.2px;color:" + WHITE, who.toUpperCase(), "rise", delay + 0.4);
      }
      return T("top:90px;left:24px;right:24px;color:" + WHITE + ";font-size:34px;font-weight:800;line-height:1.05;letter-spacing:-1px", w.headline, "rise", 0) +
        bar(260, w.a, "#a6f6ec", w.a.name, 0.4) + bar(460, w.b, "#eef542", w.b.name, 0.9) +
        T("top:660px;left:24px;right:24px;color:" + WHITE + ";font-size:15px;font-weight:600", w.note, "rise", 1.6);
    } },
    // 7 The call
    { bg: "#4212e8", ink: WHITE, html: function () {
      var c = D.call, rings = "";
      [300, 220, 140].forEach(function (s, i) {
        rings += '<div class="abs" style="top:' + (330 - s / 2 + 70) + "px;left:" + (195 - s / 2) + "px;width:" + s + "px;height:" + s + "px;border-radius:50%;border:6px solid #eef542;animation:ring .9s " + (0.2 + i * 0.2) + 's cubic-bezier(.2,.8,.2,1) both"></div>';
      });
      return rings +
        T("top:90px;left:24px", A.hl(c.label, "#eef542", INK, 18), "rise", 0) +
        T("top:260px;left:0;right:0;text-align:center;color:#eef542;font-size:150px;" + BOLD + "text-shadow:0 4px 0 " + INK, num(c.number, 2000), "pop", 0.5) +
        T("top:430px;left:0;right:0;text-align:center;color:" + WHITE + ";font-size:26px;font-weight:800", c.unit, "rise", 1) +
        T("top:640px;left:24px;right:24px;color:" + WHITE + ";font-size:16px;font-weight:600;line-height:1.4", c.sub, "rise", 1.4);
    } },
    // 8 Silence: colour fades to black, number counts slowly
    { bg: INK, ink: WHITE, dur: 11000, from: "#4212e8", html: function () {
      var s = D.silence;
      return '<div class="abs" style="inset:0;--from:#4212e8;animation:toBlack 3.5s ease-in both"></div>' +
        T("top:330px;left:0;right:0;text-align:center;color:" + WHITE + ";font-size:96px;" + BOLD, num(s.number, 5500), "fade", 2.5) +
        T("top:440px;left:0;right:0;text-align:center;color:" + WHITE + ";font-size:18px;font-weight:600;opacity:.8", s.label, "fade", 5);
    } },
    // 9 What it looks like
    { bg: "#8a8a8a", ink: INK, html: function () {
      var s = D.silenceLooksLike, out = "";
      for (var i = 0; i < 6; i++) out += '<div class="abs slideL" style="top:' + (150 + i * 28) + "px;left:0;right:0;height:22px;background:" + (i % 2 ? "#bdbdbd" : "#6b6b6b") + ";--d:" + i * 0.12 + 's"></div>';
      return T("top:80px;left:24px;font-size:30px;font-weight:800;letter-spacing:-.8px", s.headline, "rise", 0) + out +
        T("top:380px;left:24px;font-size:84px;" + BOLD, num(s.a.number, 2000), "rise", 0.9) +
        T("top:470px;left:24px", A.hl(s.a.label, INK, "#bdbdbd", 18), "slideL", 1.3) +
        T("top:560px;left:24px;font-size:84px;" + BOLD, num(s.b.number, 2400), "rise", 1.6) +
        T("top:650px;left:24px", A.hl(s.b.label, INK, "#bdbdbd", 18), "slideL", 2);
    } },
    // 10 Season 2: hits hard
    { bg: "#3df26a", ink: INK, html: function () {
      var s = D.season2;
      return A.burst("top:150px;left:-15px", 420, { cls: "", spikes: 18, seed: 5, wrap: "animation:explode 1.2s cubic-bezier(.1,.9,.2,1) both" }) +
        T("top:70px;left:24px", A.hl(s.date, INK, "#3df26a", 16), "rise", 0.3) +
        T("top:330px;left:0;right:0;text-align:center", A.hl(s.label, INK, "#3df26a", 22, "letter-spacing:3px"), "pop", 0.7) +
        T("top:380px;left:24px;right:24px;text-align:center;color:" + WHITE + ";font-size:64px;text-shadow:0 3px 0 " + INK + ";" + BOLD, s.title, "pop", 0.9) +
        (s.sub ? T("top:600px;left:36px;right:36px;text-align:center;font-size:18px;font-weight:800;line-height:1.25", s.sub, "rise", 1.8) : "");
    } },
    // 11 Plot twists
    { bg: "#ff8a1f", ink: INK, html: function () {
      var p = D.plotTwists;
      function card(top, rot, text, d) {
        return T("top:" + top + "px;left:28px;right:28px;background:" + INK + ";color:#ff8a1f;padding:26px 22px;font-size:30px;font-weight:900;letter-spacing:-1px;line-height:1.05;--r:" + rot + "deg;--r0:" + (rot * 4) + "deg", text, "pop", d);
      }
      return T("top:80px;left:24px;font-size:34px;font-weight:800;letter-spacing:-1px", p.headline, "rise", 0) +
        card(220, -3, p.items[0] || "", 0.5) + card(430, 3, p.items[1] || "", 1.1);
    } },
    // 12 Inside jokes
    { bg: "#eef542", ink: INK, html: function () {
      var j = D.insideJokes, cols = ["#ff5b3f", "#f772c4", "#a6f6ec", "#cf1a7e", "#6a0dbd"], rows = "";
      j.items.slice(0, 5).forEach(function (t, i) {
        rows += T("top:" + (170 + i * 106) + "px;left:24px;right:24px;display:flex;align-items:center;gap:16px",
          '<div style="flex:none;width:64px;height:64px;background:' + cols[i] + ";color:" + (i === 3 || i === 4 ? WHITE : INK) + ';font-size:34px;font-weight:900;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</div><div style="font-size:24px;font-weight:800;letter-spacing:-.5px;line-height:1.1">' + t + "</div>", "slideL", 0.2 + i * 0.18);
      });
      return T("top:80px;left:24px;font-size:34px;font-weight:800;letter-spacing:-1px", j.headline, "rise", 0) + rows;
    } },
    // 13 Favorite memory
    { bg: "#6a0dbd", ink: WHITE, html: function () {
      var m = D.favoriteMemory, rays = "";
      for (var i = 0; i < 16; i++) rays += '<polygon points="195,330 ' + (195 + 400 * Math.cos((i / 16) * 6.283)).toFixed(0) + "," + (330 + 400 * Math.sin((i / 16) * 6.283)).toFixed(0) + " " + (195 + 400 * Math.cos(((i + 0.5) / 16) * 6.283)).toFixed(0) + "," + (330 + 400 * Math.sin(((i + 0.5) / 16) * 6.283)).toFixed(0) + '" fill="' + (i % 2 ? "#eef542" : "#ff5b3f") + '"/>';
      var photo = m.photo ? '<img src="' + m.photo + '" alt="" style="width:100%;height:100%;object-fit:cover">' : '<div style="width:100%;height:100%;background:#a6f6ec;display:flex;align-items:center;justify-content:center;font-size:110px;line-height:1">🌍</div>';
      return '<svg class="abs spinning" style="top:0;left:0;width:390px;height:660px;clip-path:circle(150px at 195px 330px);animation-duration:40s" viewBox="0 0 390 660" aria-hidden="true">' + rays + "</svg>" +
        T("top:70px;left:24px;font-size:30px;font-weight:800;letter-spacing:-.8px;color:" + WHITE, m.headline, "rise", 0) +
        T("top:215px;left:105px;width:180px;height:230px;border:6px solid " + INK + ";background:" + INK + ";overflow:hidden", photo, "pop", 0.4) +
        T("top:580px;left:24px;right:24px;text-align:center;color:" + WHITE, '<div style="font-size:26px;font-weight:900;letter-spacing:-.8px">' + m.title + '</div><div style="font-size:15px;font-weight:600;margin-top:8px;opacity:.9">' + m.quote + "</div>", "rise", 1);
    } },
    // 14 Summary
    { bg: "#f772c4", ink: INK, html: function () {
      var s = D.summary;
      function col(items, left, d) {
        return items.map(function (r, i) {
          return T("top:" + (190 + i * 140) + "px;left:" + left + "px;width:160px", '<div style="font-size:12px;font-weight:800;letter-spacing:1.2px">' + String(r[0]).toUpperCase() + '</div><div style="font-size:' + (/^[\d,]+$/.test(r[1]) ? 52 : 34) + 'px;' + BOLD + 'margin-top:4px">' + r[1] + "</div>", "rise", d + i * 0.15);
        }).join("");
      }
      return T("top:80px;left:24px;font-size:34px;font-weight:800;letter-spacing:-1px", s.headline, "rise", 0) +
        '<div class="abs grow" style="top:160px;left:24px;right:24px;height:4px;background:' + INK + '"></div>' +
        col(s.left, 24, 0.3) + col(s.right, 206, 0.45);
    } },
    // 15 To be continued
    { bg: "#ff5b3f", ink: INK, html: function () {
      var e = D.ending;
      return A.chromeBlock("top:0;right:0", 160, 200, "slideR") +
        A.burst("top:-50px;left:40px", 160) +
        T("top:290px;left:0;right:0;text-align:center",
          '<div style="font-size:58px;font-weight:900;letter-spacing:-2.5px;line-height:.95">' + e.headline + "</div>" +
          '<div style="margin-top:22px">' + A.hl(e.chip, INK, "#ff5b3f", 28, "font-weight:900") + "</div>" +
          (e.line ? '<div style="margin:20px 34px 0;font-size:17px;font-weight:700;line-height:1.3">' + e.line + "</div>" : "") +
          '<button type="button" class="btn" id="replay" style="margin-top:28px">' + e.replay + "</button>", "rise", 0.3) +
        A.tube("left:-40px;bottom:50px", 280, 190, "M20 180 C 40 40, 150 30, 170 110 S 250 190, 280 20", 0.5) +
        A.heart("right:-20px;bottom:120px", 160);
    } },
  ];

  var TOTAL = SCREENS.length, DEFAULT_MS = 6000;

  function mount(stage, host) {
    var idx = 0, elapsed = 0, paused = false, raf = 0, lastT = 0, held = false, holdTimer = 0;

    stage.innerHTML = '<div id="slot"></div>' + A.progress(TOTAL) +
      '<button id="mute" aria-label="Mute music" style="position:absolute;z-index:30;bottom:74px;left:16px;width:36px;height:36px;border-radius:18px;border:0;background:rgba(255,255,255,.92);box-shadow:0 1px 6px rgba(0,0,0,.25);display:none;align-items:center;justify-content:center;cursor:pointer"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="#0b0b0b"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#0b0b0b" stroke-width="2" stroke-linecap="round"/><path class="x" d="M3 3l18 18" stroke="#ff5b3f" stroke-width="2.5" stroke-linecap="round" style="display:none"/></svg></button>';
    var slot = stage.querySelector("#slot"), segs = stage.querySelectorAll(".seg");

    // ---- Music: each screen can start its own song at its own timestamp (DATA.music) ----
    var M = D.music || {}, au = new Audio(), cur = null, musicOn = true, fadeT = 0, VOL = 0.85;
    var muteBtn = stage.querySelector("#mute");
    // The mute button is off by default: a stray tap on it silenced every later screen. Set DATA.showMuteButton = true to bring it back.
    if (Object.keys(M).length && D.showMuteButton) muteBtn.style.display = "flex";
    au.addEventListener("ended", function () { if (cur && cur.src) { au.currentTime = cur.start || 0; au.play().catch(function () {}); } });
    function ramp(to, ms, done) {
      clearInterval(fadeT);
      var from = au.volume, t0 = performance.now();
      fadeT = setInterval(function () {
        var p = Math.min(1, (performance.now() - t0) / ms);
        au.volume = Math.max(0, Math.min(1, from + (to - from) * p));
        if (p >= 1) { clearInterval(fadeT); if (done) done(); }
      }, 30);
    }
    var req = 0; // only the most recent screen's music request may act; older ones are dropped
    function playFor(i) {
      var m = M[i + 1];
      if (!m) return; // no entry: keep whatever is playing
      if (cur && cur.src === m.src && (cur.start || 0) === (m.start || 0)) return;
      var id = ++req;
      if (m.src === null) { cur = m; ramp(0, 900, function () { if (id === req) au.pause(); }); return; } // silence
      var go = function () {
        if (id !== req) return;
        cur = m; au.src = m.src;
        au.addEventListener("loadedmetadata", function seek() {
          au.removeEventListener("loadedmetadata", seek);
          if (id !== req) return;
          try { au.currentTime = m.start || 0; } catch (e) {}
          if (musicOn) { au.volume = 0; au.play().then(function () { if (id === req) ramp(m.vol || VOL, 600); }).catch(function () {}); }
        });
        au.load();
      };
      cur = m; // claim the slot now so repeated calls for the same screen don't stack
      if (!au.paused) ramp(0, 400, go); else go();
    }
    muteBtn.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    muteBtn.addEventListener("pointerup", function (e) { e.stopPropagation(); });
    muteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      musicOn = !musicOn;
      muteBtn.querySelector(".x").style.display = musicOn ? "none" : "block";
      muteBtn.setAttribute("aria-label", musicOn ? "Mute music" : "Play music");
      muteBtn.title = musicOn ? "Mute music" : "Music is off - tap to turn on";
      var tip = stage.querySelector("#mutetip");
      if (!tip) { tip = document.createElement("div"); tip.id = "mutetip"; tip.style.cssText = "position:absolute;z-index:30;bottom:80px;left:60px;background:#0b0b0b;color:#fff;font:700 12px Figtree,sans-serif;padding:6px 10px;border-radius:12px;pointer-events:none;transition:opacity .3s"; stage.appendChild(tip); }
      tip.textContent = musicOn ? "Music on" : "Music off"; tip.style.opacity = 1;
      clearTimeout(tip._t); tip._t = setTimeout(function () { tip.style.opacity = 0; }, 1400);
      if (!musicOn) ramp(0, 250, function () { au.pause(); });
      else if (cur && cur.src) { au.volume = 0; au.play().then(function () { ramp(cur.vol || VOL, 400); }).catch(function () {}); }
    });

    function countUp(root) {
      root.querySelectorAll("[data-count]").forEach(function (el) {
        var to = +el.dataset.count, ms = +el.dataset.ms;
        if (reduce || !to) { el.textContent = fmt(to); return; }
        var t0 = performance.now();
        (function step(t) {
          var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(to * e));
          if (p < 1 && el.isConnected) requestAnimationFrame(step);
        })(t0);
      });
    }

    function show(i) {
      idx = Math.max(0, Math.min(TOTAL - 1, i)); elapsed = 0;
      var s = SCREENS[idx];
      stage.style.setProperty("--ink", s.ink);
      document.body.style.background = window.innerWidth < 500 ? (idx === 7 ? INK : s.bg) : "#1a1a1a";
      slot.innerHTML = '<div class="scr" style="background:' + s.bg + ";color:" + s.ink + '">' + s.html() + A.footer(NAMES) + "</div>";
      var replay = slot.querySelector("#replay");
      if (replay) replay.addEventListener("click", function (e) { e.stopPropagation(); show(0); });
      countUp(slot);
      playFor(idx);
      segs.forEach(function (g, k) {
        g.classList.toggle("done", k < idx); g.classList.toggle("cur", k === idx);
        g.firstChild.style.transform = k < idx ? "scaleX(1)" : "scaleX(0)";
      });
    }
    function next() { if (idx < TOTAL - 1) show(idx + 1); else { elapsed = 0; } }
    function prev() { show(idx > 0 ? idx - 1 : 0); }

    function tick(t) {
      var dt = t - lastT; lastT = t;
      if (!paused && !document.hidden) {
        elapsed += dt;
        var dur = SCREENS[idx].dur || DEFAULT_MS;
        segs[idx].firstChild.style.transform = "scaleX(" + Math.min(1, elapsed / dur) + ")";
        if (elapsed >= dur && idx < TOTAL - 1) next();
      }
      raf = requestAnimationFrame(tick);
    }

    // press-and-hold pauses; quick tap navigates; swipe navigates
    var sx = 0, sy = 0, st = 0, moved = false;
    stage.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      sx = e.clientX; sy = e.clientY; st = Date.now(); moved = false; held = false;
      holdTimer = setTimeout(function () { held = true; paused = true; }, 220);
    });
    stage.addEventListener("pointermove", function (e) { if (Math.abs(e.clientX - sx) > 12 || Math.abs(e.clientY - sy) > 12) moved = true; });
    function release(e, cancel) {
      clearTimeout(holdTimer); paused = false;
      if (cancel || (e.target.closest && e.target.closest("button"))) return;
      var dx = e.clientX - sx;
      if (moved && Math.abs(dx) > 40) { dx < 0 ? next() : prev(); return; }
      if (held || moved) return;
      var r = stage.getBoundingClientRect();
      (e.clientX - r.left) < r.width / 2 ? prev() : next();
    }
    stage.addEventListener("pointerup", function (e) { release(e, false); });
    stage.addEventListener("pointercancel", function (e) { release(e, true); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
    });

    show(0);
    lastT = performance.now();
    raf = requestAnimationFrame(tick);
  }

  window.STORY = { mount: mount, SCREENS: SCREENS };
})();
