/* Shared decorative motifs: bursts, chrome tubes, pixel heart, chrome block, footer, progress. */
(function () {
  var uid = 0;
  function burst(style, size, opts) {
    opts = opts || {};
    var id = "bg" + (++uid), n = opts.spikes || 14, c = size / 2, pts = [];
    for (var i = 0; i < n * 2; i++) {
      var a = (Math.PI * i) / n, r = (i % 2 ? 0.52 : 0.98) * c * (0.88 + 0.12 * Math.sin(i * 2.3 + (opts.seed || 0)));
      pts.push((c + r * Math.cos(a)).toFixed(1) + "," + (c + r * Math.sin(a)).toFixed(1));
    }
    return '<div class="abs ' + (opts.cls === undefined ? "spinin" : opts.cls) + '" style="' + style + ';width:' + size + 'px;height:' + size + 'px;' + (opts.wrap || "") + '"><svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '" aria-hidden="true"><defs><radialGradient id="' + id + '" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#8df08a"/><stop offset="30%" stop-color="#ff8a5c"/><stop offset="62%" stop-color="#a02cff"/><stop offset="100%" stop-color="#7a1fe0"/></radialGradient></defs><polygon points="' + pts.join(" ") + '" fill="url(#' + id + ')"/></svg></div>';
  }
  function tube(style, w, h, d, delay) {
    var p = function (col, sw) { return '<path d="' + d + '" pathLength="1" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"/>'; };
    return '<svg class="abs draw" style="' + style + ';width:' + w + 'px;height:' + h + 'px;--d:' + (delay || 0.2) + 's" viewBox="0 0 310 200" aria-hidden="true">' + p("#0b0b0b", 30) + p("#6f8cff", 22) + p("#7df0a0", 14) + p("#eef4ff", 6) + "</svg>";
  }
  var HEART = [[2,0],[3,0],[4,0],[8,0],[9,0],[10,0],[1,1],[5,1],[7,1],[11,1],[0,2],[6,2],[12,2],[0,3],[12,3],[0,4],[12,4],[1,5],[11,5],[2,6],[10,6],[3,7],[9,7],[4,8],[8,8],[5,9],[7,9],[6,10]];
  function heart(style, w, color) {
    var r = HEART.map(function (p) { return '<rect x="' + p[0] * 12 + '" y="' + p[1] * 12 + '" width="12" height="12" fill="' + (color || "#52f05a") + '"/>'; }).join("");
    return '<svg class="abs beat" style="' + style + ';width:' + w + 'px;height:' + (w * 132 / 156) + 'px" viewBox="0 0 156 132" shape-rendering="crispEdges" aria-hidden="true">' + r + "</svg>";
  }
  function chromeBlock(style, w, h, cls, delay) {
    return '<div class="abs chrome ' + (cls || "slideL") + '" style="' + style + ';width:' + w + 'px;height:' + h + 'px;--d:' + (delay || 0) + 's"></div>';
  }
  function hl(text, bg, color, size, extra) {
    return '<span class="hl" style="background:' + bg + ";color:" + color + ";font-size:" + size + "px;" + (extra || "") + '">' + text + "</span>";
  }
  function footer(names) {
    return '<div class="foot"><div class="lg"><svg width="30" height="22" viewBox="0 0 30 22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="19" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="3"/></svg><b>Our Wrapped</b></div><span>' + names + "</span></div>";
  }
  function progress(total) {
    var s = ""; for (var i = 0; i < total; i++) s += '<div class="seg"><i></i></div>';
    return '<div class="prog">' + s + "</div>";
  }
  window.ART = { burst: burst, tube: tube, heart: heart, chromeBlock: chromeBlock, hl: hl, footer: footer, progress: progress };
})();
