/* Countdown gate. The story code is NOT loaded until the unlock time has passed. */
(function () {
  var A = window.ART, C = window.CONFIG;
  var stage = document.getElementById("stage");
  var target = new Date(C.UNLOCK_AT).getTime();
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  var testNow = local ? new URLSearchParams(location.search).get("now") : null; // testing only, ignored on the live site
  var offset = 0; // server clock - device clock, so changing the phone's clock doesn't unlock it
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fit() {
    var s = Math.min(window.innerWidth / 390, window.innerHeight / 844, 1.25);
    stage.style.transform = "scale(" + s + ")";
  }
  window.addEventListener("resize", fit); fit();

  var t0 = Date.now();
  function now() {
    if (testNow) return new Date(testNow).getTime() + (Date.now() - t0);
    return Date.now() + offset;
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  function build() {
    document.body.style.background = "#0b0b0b";
    stage.style.setProperty("--ink", "#fff");
    var boxes = [["d", "DAYS", "#f772c4"], ["h", "HOURS", "#eef542"], ["m", "MINUTES", "#a6f6ec"], ["s", "SECONDS", "#d6f75c"]]
      .map(function (b, i) {
        return '<div class="box rise" id="g-box-' + b[0] + '" style="--d:' + (0.5 + i * 0.12) + "s;background:" + b[2] + ';color:#0b0b0b"><b id="g-' + b[0] + '">00</b><small>' + b[1] + "</small>" + (b[0] === "s" ? '<i class="sweep" id="g-sweep"></i>' : "") + "</div>";
      }).join("");
    stage.innerHTML =
      '<div class="scr gate" style="background:#0b0b0b">' +
      A.chromeBlock("top:0;left:0", 150, 190, "slideL", 0) +
      A.burst("top:-60px;left:150px", 170, { seed: 1 }) +
      '<div class="abs" id="g-big" aria-hidden="true" style="top:150px;left:0;right:0;text-align:center;font-size:420px;font-weight:900;line-height:1;color:#fff;opacity:0;pointer-events:none"></div>' +
      '<div class="abs" id="g-main" style="z-index:5;top:176px;left:0;right:0;text-align:center;color:#fff">' +
      '<div class="rise" style="--d:.2s">' + A.hl("COMING SOON", "#ff5b3f", "#0b0b0b", 15, "letter-spacing:1.4px") + "</div>" +
      '<div class="rise" style="--d:.3s;font-size:56px;font-weight:900;letter-spacing:-2.2px;line-height:.95;margin-top:18px">' + C.GATE_TITLE.replace(" ", "<br>") + "</div>" +
      '<div class="rise" style="--d:.4s;font-size:15px;font-weight:600;margin-top:12px;opacity:.85">' + C.GATE_SUB + "</div>" +
      '<div class="rise" style="--d:.5s;margin-top:16px">' + A.hl(C.GATE_TO, "#f772c4", "#0b0b0b", 17) + "</div>" +
      '<div class="rise" style="--d:.6s;margin-top:8px">' + A.hl(C.GATE_FROM, "#eef542", "#0b0b0b", 13) + "</div>" +
      '<div id="g-boxes" style="display:flex;gap:8px;justify-content:center;margin-top:22px">' + boxes + "</div>" +
      '<button class="btn rise" id="g-start" style="--d:1.2s;margin-top:24px">' + C.START_BUTTON + "</button>" +
      '<div id="g-msg" style="min-height:56px;margin-top:16px;padding:0 20px"></div>' +
      "</div>" +
      A.tube("left:-50px;bottom:30px", 220, 140, "M20 20 C 60 160, 150 170, 170 110 S 250 30, 290 180", 0.6) +
      A.heart("right:-34px;bottom:56px", 120) +
      A.footer(C.GATE_FROM.toUpperCase()) +
      '<button id="g-music" aria-label="Play music" style="position:absolute;z-index:30;top:14px;right:14px;width:40px;height:40px;border-radius:20px;border:0;background:#fff;display:none;align-items:center;justify-content:center;cursor:pointer"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="#0b0b0b"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#0b0b0b" stroke-width="2" stroke-linecap="round"/><path class="x" d="M3 3l18 18" stroke="#ff5b3f" stroke-width="2.5" stroke-linecap="round"/></svg></button>' +
      '<div class="abs" id="g-fx" style="inset:0;pointer-events:none;z-index:6"></div>' +
      '<div class="abs" id="g-open" style="inset:0;display:none"></div>' +
      "</div>";
  }

  var last = {};
  function render(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    Object.keys(v).forEach(function (k) {
      var el = document.getElementById("g-" + k); if (!el) return;
      var txt = pad(v[k]);
      if (last[k] !== txt) {
        el.textContent = txt; last[k] = txt;
        if (!reduce) {
          // digits roll in from above; the seconds box also pulses and flashes
          el.classList.remove("roll"); void el.offsetWidth; el.classList.add("roll");
          if (k === "s") {
            var box = document.getElementById("g-box-s");
            box.classList.remove("pulse"); void box.offsetWidth; box.classList.add("pulse");
            particles(box);
          }
        }
      }
    });
    // seconds sweep bar fills across each minute
    var sw = document.getElementById("g-sweep");
    if (sw) sw.style.transform = "scaleX(" + ((60 - v.s) / 60) + ")";
    // final 10 seconds: everything shakes and a giant number pops behind
    var boxes = document.getElementById("g-boxes"), big = document.getElementById("g-big");
    if (boxes && s <= 10 && s > 0) {
      boxes.classList.add("final");
      if (big && big.textContent !== String(s)) {
        big.textContent = s; big.classList.remove("bigpop"); void big.offsetWidth; big.classList.add("bigpop");
      }
    }
  }

  // little confetti dots that fly off the seconds box on every tick
  var DOTS = ["#ff5b3f", "#f772c4", "#eef542", "#a6f6ec", "#3df26a", "#ffffff"];
  function particles(box) {
    var layer = document.getElementById("g-fx"); if (!layer) return;
    var r = box.getBoundingClientRect(), sr = stage.getBoundingClientRect(), k = sr.width / 390;
    var cx = (r.left - sr.left + r.width / 2) / k, cy = (r.top - sr.top + r.height / 2) / k;
    for (var i = 0; i < 6; i++) {
      var dot = document.createElement("i"), a = Math.random() * 6.283, dist = 40 + Math.random() * 50;
      dot.className = "dot";
      dot.style.cssText = "left:" + cx + "px;top:" + cy + "px;background:" + DOTS[(Math.random() * DOTS.length) | 0] + ";--x:" + Math.cos(a) * dist + "px;--y:" + Math.sin(a) * dist + "px";
      layer.appendChild(dot);
      setTimeout(function (n) { return function () { n.remove(); }; }(dot), 800);
    }
  }

  // Pressing Start before the unlock shows a random joke (shuffled, no immediate repeats).
  var presses = 0, deck = [];
  function nextJoke() {
    if (!deck.length) {
      deck = C.TOO_EARLY.slice();
      for (var i = deck.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    }
    return deck.pop().replace("{n}", presses);
  }
  function onStart() {
    if (target - now() <= 0) return;
    presses++;
    var msg = document.getElementById("g-msg"), btn = document.getElementById("g-start");
    msg.innerHTML = '<div class="joke">' + A.hl(nextJoke(), "#ff5b3f", "#0b0b0b", 15, "line-height:1.35") + "</div>";
    if (!reduce) { btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake"); }
  }

  // Background music. Browsers block autoplay, so it starts on her first tap anywhere.
  var audio = null, wantMusic = true;
  function setupMusic() {
    if (!C.SONG) return;
    audio = new Audio(C.SONG); audio.loop = true; audio.volume = 0.7;
    var btn = document.getElementById("g-music");
    audio.addEventListener("error", function () { audio = null; btn.style.display = "none"; });
    btn.style.display = "flex";
    function paint() { btn.setAttribute("aria-label", wantMusic && !audio.paused ? "Mute music" : "Play music"); btn.firstChild.style.opacity = wantMusic && !audio.paused ? 1 : 0.45; btn.querySelector(".x").style.display = wantMusic && !audio.paused ? "none" : "block"; }
    function tryPlay() { if (audio && wantMusic && audio.paused) audio.play().then(paint).catch(function () {}); }
    stage.addEventListener("pointerdown", tryPlay);
    btn.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    btn.addEventListener("click", function () {
      if (!audio) return;
      if (audio.paused) { wantMusic = true; audio.play().then(paint).catch(function () {}); }
      else { wantMusic = false; audio.pause(); paint(); }
    });
    paint();
  }
  function fadeOutMusic() {
    if (!audio || audio.paused) return;
    var a = audio, t = setInterval(function () { a.volume = Math.max(0, a.volume - 0.07); if (a.volume <= 0.01) { a.pause(); clearInterval(t); } }, 100);
  }

  var timer;
  function loop() {
    var left = target - now();
    if (left <= 0) { clearInterval(timer); unlock(); return; }
    render(left);
  }

  function unlock() {
    render(0);
    var g = document.getElementById("g-open");
    document.getElementById("g-main").style.display = "none";
    g.style.display = "block";
    g.innerHTML = A.burst("top:200px;left:35px", 320, { cls: "", seed: 3, wrap: "animation:explode 1.1s cubic-bezier(.2,.8,.2,1) both" }) +
      '<div class="abs" style="top:330px;left:0;right:0;text-align:center"><div class="rise" style="--d:.6s;font-size:48px;font-weight:900;letter-spacing:-2px;line-height:.95;color:#fff;text-shadow:0 2px 0 #0b0b0b">It\'s time.</div>' +
      '<button class="btn rise" id="g-go" style="--d:.9s;margin-top:28px">Press play</button></div>';
    document.getElementById("g-go").addEventListener("click", start);
  }

  function load(src, ok, fail) {
    var s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = fail;
    document.body.appendChild(s);
  }
  function start() {
    fadeOutMusic();
    var btn = document.getElementById("g-go");
    // The story files are only fetched now, after unlock.
    load("js/data.js", function () {
      load("js/story.js", function () {
        window.STORY.mount(stage, { fit: fit });
      }, fail);
    }, fail);
    function fail() { btn.textContent = "Almost ready - try again in a minute"; }
  }

  build();
  document.getElementById("g-start").addEventListener("click", onStart);
  setupMusic();
  var go = function () { loop(); timer = setInterval(loop, 250); };
  if (location.protocol.indexOf("http") === 0 && !testNow) {
    // Prefer the server's clock; fall back to the device clock if unavailable.
    fetch(location.href, { method: "HEAD", cache: "no-store" }).then(function (r) {
      var d = r.headers.get("date"); if (d) offset = new Date(d).getTime() - Date.now();
    }).catch(function () {}).then(go);
  } else go();
})();
