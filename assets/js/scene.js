/* 節気帖 -- living scene for each 候 (v1.1 美工, see 節気帖工作区/DESIGN.md).
   One Edo-style genre painting per kou (assets/scenes/<n>.webp) plus a packed
   helper map (<n>-aux.png: R = depth, G = water mask, B = flow angle).
   WebGL draws depth parallax, drifting mist and river flow; a 2D canvas on top
   draws the kou's own particles (petals, leaves, fireflies, rain, snow).
   Everything stops under prefers-reduced-motion, when the page is hidden or
   when the scene is scrolled out of view. Without WebGL a static <img> stays. */
(function () {
  "use strict";

  // Paintings that contain water (checked by mask coverage > 2%).
  var WATER = [1, 3, 4, 14, 15, 16, 17, 19, 26, 28, 29, 30, 31, 32, 36, 39, 44, 49, 51, 54, 63, 67, 70, 71];

  function particleKind(n) {
    if (window.SEKKI_EDITION === "cn") {
      // 中国版：雷乃发声・始电・大雨时行 下雨，腐草为萤 萤火
      if (n === 11 || n === 12 || n === 36) return "rain";
      if (n === 34) return "firefly";
    } else {
      if (n === 12 || n === 27 || n === 36 || n === 53) return "rain";
      if (n === 26) return "firefly";
    }
    if (n <= 7) return "plum";
    if (n <= 11) return "petal";
    if (n <= 18) return "fresh";
    if (n <= 35) return "green";
    if (n <= 45) return "yellow";
    if (n <= 54) return "leaf";
    if (n <= 60) return "brown";
    return "snow";
  }
  var COUNT = { snow: 70, rain: 60, petal: 26, plum: 20, fresh: 14, green: 14, yellow: 16, leaf: 16, brown: 14, firefly: 28 };

  var VS = "attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0,1);}";
  var FS = [
    "precision highp float;varying vec2 v;uniform sampler2D img,aux;uniform vec2 res,isz,par;uniform float t,water,fy,fade;uniform vec3 paper;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}",
    "void main(){",
    " float sc=max(res.x/isz.x,res.y/isz.y)*1.04;vec2 sz=isz*sc;vec2 off=(res-sz)*vec2(.5,fy);",
    " vec2 uv=(v*res-off)/sz;",
    " vec4 ax=texture2D(aux,uv);float d=ax.r;",
    " vec2 uv2=uv+par*(d-.3)*.022;",
    " vec4 c=texture2D(img,uv2);",
    " float w=ax.g*water;",
    " if(w>.01){float lum=dot(c.rgb,vec3(.299,.587,.114));float wd=w*smoothstep(.42,.62,lum);",
    "  float an=ax.b*6.2831853-1.5707963;vec2 fd=vec2(cos(an),sin(an));vec2 pr=vec2(-fd.y,fd.x);",
    "  vec2 q=uv*vec2(isz.x/isz.y,1.);float al=dot(q,fd),ac=dot(q,pr);",
    "  float n1=fbm(vec2(al*40.-t*.9,ac*110.)),n2=fbm(vec2(al*32.-t*.7+5.,ac*90.+3.));",
    "  c=texture2D(img,uv2+(fd*(n1-.5)+pr*(n2-.5)*.5)*.011*wd);",
    "  float st=smoothstep(.56,.8,fbm(vec2(al*24.-t*1.1,ac*150.)));float dk=smoothstep(.62,.85,fbm(vec2(al*28.-t*.85+9.,ac*130.+4.)));",
    "  c.rgb=mix(c.rgb,vec3(.98,.98,.96),st*.6*wd);c.rgb=mix(c.rgb,c.rgb*.86,dk*.45*wd);}",
    " float m=fbm(vec2(uv.x*2.6-t*.018,uv.y*9.+t*.004));",
    " c.rgb=mix(c.rgb,paper,smoothstep(.5,.78,m)*(1.-smoothstep(.15,.55,d))*.42);",
    " c.rgb=mix(c.rgb,paper,smoothstep(.78,1.,v.y)*fade);",
    " gl_FragColor=vec4(c.rgb,1.);}"
  ].join("\n");

  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  function rng(s) {
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hexRgb(hex, fallback) {
    var m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
    if (!m) return fallback;
    var v = parseInt(m[1], 16);
    return [(v >> 16) / 255, (v >> 8 & 255) / 255, (v & 255) / 255];
  }
  function loadImg(src) {
    return new Promise(function (ok, ng) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = ng; i.src = src; });
  }

  function Scene(el, opts) {
    this.el = el; this.n = 0; this.fy = (opts && opts.focusY) || 0.55;
    this.fade = opts && opts.fade === false ? 0 : 1; // bottom melt into paper
    el.classList.add("kou-scene");
    this.img = document.createElement("img"); this.img.alt = ""; this.img.className = "kou-scene-img"; this.img.decoding = "async";
    this.cv = document.createElement("canvas"); this.pc = document.createElement("canvas");
    this.cv.className = "kou-scene-gl"; this.pc.className = "kou-scene-pt";
    this.cv.setAttribute("aria-hidden", "true"); this.pc.setAttribute("aria-hidden", "true");
    el.appendChild(this.img); el.appendChild(this.cv); el.appendChild(this.pc);
    this.ctx = this.pc.getContext("2d");
    this.parts = []; this.kind = ""; this.visible = true; this.ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    this.gl = null;
    try { this.gl = this.cv.getContext("webgl", { alpha: false, antialias: false }); } catch (e) { this.gl = null; }
    if (this.gl && !this.initGL()) this.gl = null;
    if (!this.gl) { this.cv.style.display = "none"; }
    var self = this;
    if (window.ResizeObserver) new ResizeObserver(function () { self.size(); }).observe(el);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; }).observe(el);
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      self.ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      self.ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    el.addEventListener("pointerleave", function () { self.ptr.tx = 0; self.ptr.ty = 0; });
    this.size();
    this.last = performance.now();
    requestAnimationFrame(function loop(now) { self.frame(now); requestAnimationFrame(loop); });
  }

  Scene.prototype.initGL = function () {
    var gl = this.gl;
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return false;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ["img", "aux", "res", "isz", "par", "t", "water", "fy", "fade", "paper"].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
    this.U = U;
    gl.uniform1i(U.img, 0); gl.uniform1i(U.aux, 1); gl.uniform1f(U.fy, this.fy); gl.uniform1f(U.fade, this.fade);
    var bg = getComputedStyle(document.documentElement).getPropertyValue("--bg");
    var paper = hexRgb(bg, [247 / 255, 244 / 255, 236 / 255]);
    gl.uniform3f(U.paper, paper[0], paper[1], paper[2]);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    this.tex = [0, 1].map(function (i) {
      var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([247, 244, 236]));
      return t;
    });
    return true;
  };

  Scene.prototype.size = function () {
    var r = this.el.getBoundingClientRect();
    this.W = r.width; this.H = r.height; this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(this.W * this.dpr)), h = Math.max(1, Math.round(this.H * this.dpr));
    this.cv.width = w; this.cv.height = h; this.pc.width = w; this.pc.height = h;
    if (this.gl) { this.gl.viewport(0, 0, w, h); this.gl.uniform2f(this.U.res, w, h); }
    this.seed();
  };

  Scene.prototype.seed = function () {
    var r = this.r = rng(this.n || 1), N = COUNT[this.kind] || 0, W = this.W, H = this.H;
    this.parts = [];
    for (var i = 0; i < N; i++) this.parts.push({ x: r() * W, y: r() * H, z: 0.4 + r() * 0.8, a: r() * 6.28, s: r(), ph: r() * 6.28 });
    this.smoke = [];
  };

  Scene.prototype.show = function (n) {
    if (n === this.n) return;
    this.n = n;
    var base = (window.SEKKI_EDITION === "cn" ? "./assets/scenes-cn/" : "./assets/scenes/") + n, self = this;
    this.img.src = base + ".webp";
    this.kind = particleKind(n); this.seed();
    if (!this.gl) return;
    var gl = this.gl;
    Promise.all([loadImg(base + ".webp"), loadImg(base + "-aux.png")]).then(function (a) {
      if (self.n !== n) return;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, self.tex[0]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, a[0]);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, self.tex[1]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, a[1]);
      gl.uniform2f(self.U.isz, a[0].width, a[0].height);
      // the aux map's water channel is already zero where a painting has no water
      gl.uniform1f(self.U.water, window.SEKKI_EDITION === "cn" || WATER.indexOf(n) >= 0 ? 1 : 0);
      self.ready = true;
      self.el.classList.add("is-live");
    }).catch(function () { /* keep the static <img> */ });
  };

  Scene.prototype.frame = function (now) {
    var dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (document.hidden || !this.visible) return;
    var still = reduce.matches, t = now / 1000, p = this.ptr;
    p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
    if (this.gl && this.ready) {
      var gl = this.gl, U = this.U;
      gl.uniform2f(U.par, still ? 0 : Math.sin(t * 0.11) * 0.45 + p.x, still ? 0 : Math.cos(t * 0.083) * 0.25 + p.y * 0.6);
      gl.uniform1f(U.t, still ? 0 : t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    this.drawParticles(t, dt, still);
  };

  Scene.prototype.drawParticles = function (t, dt, still) {
    var ctx = this.ctx, W = this.W, H = this.H, kind = this.kind, r = this.r;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    if (still) return;
    for (var i = 0; i < this.parts.length; i++) {
      var q = this.parts[i];
      if (kind === "snow") {
        q.y += dt * (10 + 18 * q.z); q.x += Math.sin(t * 0.8 + q.ph) * 0.15 * q.z;
        ctx.fillStyle = "rgba(255,255,255," + (0.55 + 0.35 * q.s) + ")"; ctx.beginPath(); ctx.arc(q.x, q.y, 0.6 + 1.1 * q.z, 0, 7); ctx.fill();
      } else if (kind === "rain") {
        q.y += dt * (260 + 180 * q.z); q.x -= dt * 60;
        ctx.strokeStyle = "rgba(90,96,104," + (0.18 + 0.2 * q.s) + ")"; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x + 3, q.y - 10 * q.z - 4); ctx.stroke();
      } else if (kind === "firefly") {
        q.x += Math.sin(t * 0.7 + q.ph) * 0.25; q.y += Math.cos(t * 0.5 + q.ph) * 0.18;
        var a = Math.pow(Math.max(0, Math.sin(t * 1.6 + q.ph * 3)), 3), yy = H * 0.45 + q.y * 0.55;
        var g = ctx.createRadialGradient(q.x, yy, 0, q.x, yy, 5);
        g.addColorStop(0, "rgba(232,246,150," + 0.9 * a + ")"); g.addColorStop(1, "rgba(232,246,150,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, yy, 5, 0, 7); ctx.fill();
        if (q.y > H) q.y = 0;
        continue;
      } else if (kind === "green" || kind === "fresh") {
        q.x += dt * (14 + 16 * q.z); q.y += dt * (2 + 3 * q.z) + Math.sin(t * 1.3 + q.ph) * 0.25 * q.z; q.a += dt * (0.8 + 1.2 * q.s);
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.a); ctx.scale(1, Math.abs(Math.cos(q.a * 0.9)) * 0.7 + 0.3);
        ctx.fillStyle = kind === "fresh" ? (q.s < 0.5 ? "rgba(150,188,96,.85)" : "rgba(186,208,120,.85)") : (q.s < 0.5 ? "rgba(96,138,82,.85)" : "rgba(138,170,96,.85)");
        var L = 3.4 * q.z + 2.2; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.quadraticCurveTo(0, -L * 0.42, L, 0); ctx.quadraticCurveTo(0, L * 0.42, -L, 0); ctx.fill(); ctx.restore();
      } else {
        q.y += dt * (7 + 10 * q.z); q.x += (Math.sin(t * 0.6 + q.ph) * 0.35 + 0.12) * q.z; q.a += dt * (1 + q.s);
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.a); ctx.scale(1, Math.abs(Math.cos(q.a * 0.7)) * 0.8 + 0.2);
        if (kind === "petal" || kind === "plum") {
          ctx.fillStyle = kind === "plum" ? (q.s < 0.5 ? "rgba(250,240,240,.95)" : "rgba(240,206,214,.92)") : (q.s < 0.5 ? "rgba(232,188,196,.92)" : "rgba(246,222,226,.95)");
          ctx.beginPath(); ctx.ellipse(0, 0, 2.4 * q.z + 1, 1.4 * q.z + 0.6, 0, 0, 7); ctx.fill();
        } else {
          ctx.fillStyle = { yellow: q.s < 0.5 ? "rgba(214,170,60,.85)" : "rgba(196,148,48,.85)", leaf: q.s < 0.5 ? "rgba(178,58,40,.85)" : "rgba(206,120,48,.85)", brown: q.s < 0.5 ? "rgba(140,104,70,.8)" : "rgba(168,128,84,.8)" }[kind];
          var k = 2.2 * q.z + 1.4; ctx.beginPath();
          for (var j = 0; j < 5; j++) { var an = j / 5 * 6.283 - 1.57; ctx.lineTo(Math.cos(an) * k, Math.sin(an) * k); ctx.lineTo(Math.cos(an + 0.63) * k * 0.45, Math.sin(an + 0.63) * k * 0.45); }
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      }
      if (q.y > H * 0.97) { q.y = -8; q.x = r() * W; }
      if (q.x > W + 8) q.x = -8;
      if (q.x < -8) q.x = W + 8;
    }
  };

  var scenes = new WeakMap();
  window.SekkiScene = {
    // Mount (or update) a scene inside `el` for kou number n (1-72).
    show: function (el, n, opts) {
      if (!el) return;
      var s = scenes.get(el);
      if (!s) { s = new Scene(el, opts); scenes.set(el, s); }
      s.show(n);
    },
    numberOf: function (kouId) { return parseInt(String(kouId).split("-")[1], 10); }
  };
})();
