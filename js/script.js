/* ===== EDIT BAGIAN INI ===== */
const CONFIG = {
  name: "Selvin Kurnia Damayanti",
  password: "30012021",              // hari jadi, format DDMMYYYY
  hint: "Petunjuk: tanggal kita jadian (DDMMYYYY)",
  from: "Reza",
  photos: [                          // taruh file di folder photos/
    ["photos/foto1.jpeg", "Awal cerita kita"],
    ["photos/foto2.jpeg", "Hari yang tak terlupa"],
    ["photos/foto3.jpeg", "Senyum favoritku"],
    ["photos/foto4.jpeg", "Petualangan berdua"],
    ["photos/foto5.jpeg", "Mrs Alay"],
    ["photos/foto6.jpeg", "Bersama Bocil"]
  ],
  letter: `Bae,

Selamat ulang tahun. Terima kasih sudah hadir dan membuat hari-hariku lebih terang.

Selamat bertambah usia ya, sehat selalu, diberikan berkat yang berlimpah, dan kiranya selalu dalam hadirat Tuhan.
Jangan lupa selalu bersyukur ya, karena di tahun ini Tuhan sudah wujudkan salah satu dari doamu.

God Bless You`,
  finale: [                          // baris-baris pesan di kejutan akhir
    "Terima kasih sudah hadir di hidupku",
    "Setiap harinya bersamamu adalah hadiah",
    "Semoga tahun ini penuh bahagia untukmu"
  ],
  wishes: [                          // pesan di bintang jatuh yang diketuk
    "Semoga kamu selalu sehat dan bahagia 🌟",
    "Semoga mimpi-mimpimu pelan-pelan jadi nyata ✨",
    "Semoga tahun ini penuh hal-hal baik untukmu 💫",
    "Semoga kita selalu bersama 💕"
  ],
  finalTitle: "Love You 💖",
  finalText: "Terima kasih sudah menjadi rumahku. Semoga semua doamu terkabul, ya."
};
/* =========================== */
const $ = s => document.querySelector(s);
$("#hint").textContent = CONFIG.hint;
$("#name").textContent = CONFIG.name;
$("#sign").textContent = CONFIG.from;

const cv = $("#sky"), cx = cv.getContext("2d");
let stars = [], shoot = null;
let lastW = 0;
function resize() {
  if (innerWidth === lastW) return; lastW = innerWidth;
  cv.width = innerWidth; cv.height = innerHeight;
  stars = Array.from({length: Math.min(140, Math.round(innerWidth * innerHeight / 9000))}, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: Math.random() * 1.6 + .3, p: Math.random() * 6.28, s: Math.random() * .02 + .005
  }));
}
addEventListener("resize", resize); resize();
(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  stars.forEach(s => {
    s.p += s.s;
    cx.globalAlpha = .4 + .6 * Math.abs(Math.sin(s.p));
    cx.fillStyle = "#fff8e0";
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.28); cx.fill();
    if (s.r > 1.2) { cx.globalAlpha *= .22; cx.beginPath(); cx.arc(s.x, s.y, s.r * 3, 0, 6.28); cx.fill(); }
  });
  if (!shoot && Math.random() < .004) shoot = {x: Math.random() * cv.width, y: 0};
  if (shoot) {
    cx.globalAlpha = 1; cx.strokeStyle = "#fff"; cx.lineWidth = 2;
    cx.beginPath(); cx.moveTo(shoot.x, shoot.y); cx.lineTo(shoot.x - 80, shoot.y - 40); cx.stroke();
    shoot.x += 9; shoot.y += 4.5;
    if (shoot.y > cv.height || shoot.x > cv.width + 100) shoot = null;
  }
  requestAnimationFrame(draw);
})();

const bgm = $("#bgm"), mb = $("#music");
function toggleMusic(force) {
  const play = force ?? bgm.paused;
  if (play) bgm.play().then(() => mb.classList.add("on")).catch(() => {});
  else { bgm.pause(); mb.classList.remove("on"); }
}
mb.onclick = () => toggleMusic();

const sw = {background: "#1b1450", color: "#fff", confirmButtonColor: "#b9a6ff"};
function unlock() {
  const clean = v => v.replace(/\D/g, "");
  if (clean($("#pw").value) === clean(CONFIG.password)) {
    $("#gate").classList.add("hide");
    document.body.classList.remove("locked");
    toggleMusic(true);
    setTimeout(() => { $("#gate").remove(); AOS.init({duration: 900, once: true}); }, 800);
    confetti({particleCount: 80, spread: 80, origin: {y: .6}, colors: ["#ffd98a", "#ff9ecb", "#b9a6ff"]});
  } else {
    const b = document.querySelector(".gate-box");
    b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake");
    Swal.fire({...sw, icon: "error", title: "Hmm, belum tepat", text: "Coba ingat hari jadi kita ya 💭"});
  }
}
$("#enter").onclick = unlock;
$("#pw").addEventListener("keydown", e => e.key === "Enter" && unlock());

$("#gallery").innerHTML = CONFIG.photos.map(([src, cap], i) =>
  `<div class="col-6 col-md-4" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}"><div class="ph" data-i="${i}"><img src="${src}" alt="${cap}" loading="lazy" decoding="async" onerror="this.style.opacity=0"><span>${cap}</span></div></div>`).join("");
$("#gallery").onclick = e => {
  const p = e.target.closest(".ph"); if (!p) return;
  const [src, cap] = CONFIG.photos[p.dataset.i];
  Swal.fire({...sw, imageUrl: src, imageAlt: cap, title: cap, showConfirmButton: false, showCloseButton: true, width: 520});
};

$("#blow").onclick = () => {
  if ($("#cake").classList.contains("out")) return;
  $("#cake").classList.add("out");
  $("#blow").textContent = "Semoga terkabul 🌟";
  confetti({particleCount: 150, spread: 100, origin: {y: .6}, colors: ["#ffd98a", "#ff9ecb", "#b9a6ff", "#fff"]});
  Swal.fire({...sw, title: "Yeay lilin sudah padam", text: "Semoga semua yang kamu doakan terkabul 🌙", timer: 3500, showConfirmButton: false});
};

let typed = false;
$("#envelope").onclick = () => {
  $("#letter").classList.add("open");
  if (typed) return; typed = true;
  let i = 0; const el = $("#letterText");
  (function t() { el.textContent = CONFIG.letter.slice(0, ++i); if (i < CONFIG.letter.length) setTimeout(t, 35); })();
};

$("#surprise").onclick = () => {
  const end = Date.now() + 4000;
  (function f() {
    confetti({particleCount: 5, angle: 60, spread: 60, origin: {x: 0}});
    confetti({particleCount: 5, angle: 120, spread: 60, origin: {x: 1}});
    if (Date.now() < end) requestAnimationFrame(f);
  })();
  Swal.fire({...sw, title: CONFIG.finalTitle, text: CONFIG.finalText, imageUrl: CONFIG.photos[0][0], imageWidth: 240, imageAlt: "Kita", confirmButtonText: "Love You Too 💕"});
};

/* ===== Desain v2 ===== */
// Judul muncul huruf per huruf
(() => {
  const t = $("#title"); let n = 0;
  t.innerHTML = t.textContent.split(" ").map(w => `<span class="w">${[...w].map(c => `<span class="ch" style="animation-delay:${(n++ * .06 + .3).toFixed(2)}s">${c}</span>`).join("")}</span>`).join(" ");
})();
// Gelembung cahaya yang naik pelan
$("#orbs").innerHTML = Array.from({length: 14}, () => {
  const s = Math.random() * 40 + 14;
  return `<i class="orb" style="left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${Math.random() * 20 + 18}s;animation-delay:-${Math.random() * 30}s;opacity:${Math.random() * .5 + .3}"></i>`;
}).join("");
// Garis progres scroll
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#bar").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100 || 0) + "%";
}, {passive: true});
// Kilau saat disentuh / digeser
let lastSpark = 0;
addEventListener("pointermove", e => {
  if (Date.now() - lastSpark < 120 || R.classList.contains("lite")) return; lastSpark = Date.now();
  const s = document.createElement("i");
  s.className = "spark"; s.textContent = "✦";
  s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
  document.body.appendChild(s); setTimeout(() => s.remove(), 900);
}, {passive: true});

/* ===== Desain v3 ===== */
Object.assign(sw, {
  background: "linear-gradient(160deg,rgba(44,30,120,.93),rgba(90,40,120,.9))", color: "#f3eefc", buttonsStyling: false,
  customClass: {popup: "glass-pop", title: "pop-title", htmlContainer: "pop-text", confirmButton: "btn btn-glow pop-btn", closeButton: "pop-close", image: "pop-img"},
  showClass: {popup: "pop-in"}, hideClass: {popup: "pop-out"}
});
let heart, star;
try { heart = confetti.shapeFromText({text: "💖", scalar: 2}); star = confetti.shapeFromText({text: "✨", scalar: 2}); } catch (e) {}
const shp = heart ? {shapes: [heart, star], scalar: 2} : {};

// Kue: percikan cahaya di sekitar kue
$("#cake").insertAdjacentHTML("beforeend", Array.from({length: 9}, (_, i) =>
  `<i class="sp" style="left:${Math.random() * 110 - 5}%;top:${Math.random() * 90 - 10}%;font-size:${10 + Math.random() * 12}px;animation-delay:${i * .35}s">✦</i>`).join(""));

// Tiup lilin: sorot cahaya -> padam -> gelap & berdoa -> ledakan kembang api
$("#blow").onclick = () => {
  const cake = $("#cake"); if (cake.classList.contains("out")) return;
  const dim = $("#dim"), r = cake.getBoundingClientRect();
  dim.style.setProperty("--cx", r.left + r.width / 2 + "px");
  dim.style.setProperty("--cy", r.top + r.height * .4 + "px");
  $("#blow").style.visibility = "hidden";
  dim.classList.add("on");
  setTimeout(() => cake.classList.add("out"), 1500);
  setTimeout(() => dim.classList.add("wish"), 2200);
  setTimeout(() => {
    dim.classList.remove("on", "wish");
    for (let i = 0; i < 6; i++) setTimeout(() => confetti({particleCount: 70, spread: 360, startVelocity: 32, gravity: .7, ticks: 140,
      origin: {x: Math.random() * .8 + .1, y: Math.random() * .4 + .1}, colors: ["#ffd98a", "#ff9ecb", "#b9a6ff", "#fff"]}), i * 260);
    confetti({particleCount: 40, spread: 110, origin: {x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight}, ...shp});
    $("#blow").style.visibility = "visible"; $("#blow").textContent = "Semoga terkabul 🌟";
    setTimeout(() => Swal.fire({...sw, title: "Permohonanmu sudah terbang ke bintang", text: "Semoga semua yang kamu doakan terkabul 🌙", timer: 4500, timerProgressBar: true, showConfirmButton: false}), 1200);
  }, 4800);
};

// Amplop: segel terlepas, tutup terbuka, kertas naik, lalu surat mengalir
$("#envelope").onclick = () => {
  const e = $("#envelope"); if (e.classList.contains("open")) return;
  e.classList.add("open");
  const r = e.getBoundingClientRect();
  confetti({particleCount: 30, spread: 100, origin: {x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight}, ...shp});
  setTimeout(() => {
    $("#letter").classList.add("open");
    $("#letter").scrollIntoView({behavior: "smooth", block: "center"});
    if (typed) return; typed = true;
    let i = 0; const el = $("#letterText");
    (function t() { el.textContent = CONFIG.letter.slice(0, ++i); if (i < CONFIG.letter.length) setTimeout(t, 35); })();
  }, 1700);
};

/* ===== Slideshow foto bergaya film ===== */
(() => {
  const box = $("#cinema"), sl = $("#slides"), cap = $("#cap"), dots = $("#dots"), P = CONFIG.photos;
  const origins = ["20% 30%", "80% 40%", "50% 80%", "30% 70%"];
  sl.innerHTML = P.map(([src, c], i) => `<img src="${src}" alt="${c}" loading="lazy" decoding="async" style="--o:${origins[i % 4]}" onerror="this.style.opacity=0">`).join("");
  dots.innerHTML = P.map(() => "<i></i>").join("");
  const im = [...sl.children], dt = [...dots.children];
  let cur = -1, timer = 0, playing = false;
  function show(n) {
    if (cur >= 0) {
      const o = im[cur]; o.classList.remove("on"); o.classList.add("out"); dt[cur].classList.remove("on");
      setTimeout(() => o.classList.remove("out"), 1500);
    }
    cur = (n + P.length) % P.length;
    im[cur].classList.remove("out"); im[cur].classList.add("on"); dt[cur].classList.add("on");
    cap.classList.add("sw");
    setTimeout(() => { cap.textContent = P[cur][1]; cap.classList.remove("sw"); }, 400);
  }
  const loop = () => { clearInterval(timer); timer = setInterval(() => { if (playing && !document.hidden && !box.classList.contains("off")) show(cur + 1); }, 5200); };
  show(0);
  $("#play").onclick = () => {
    box.classList.add("playing"); playing = true; loop();
    const r = box.getBoundingClientRect();
    confetti({particleCount: 60, spread: 120, origin: {x: .5, y: (r.top + r.height / 2) / innerHeight}, colors: ["#ffd98a", "#ff9ecb", "#b9a6ff"], ...shp});
  };
  box.querySelector(".screen").addEventListener("click", e => {
    if (!box.classList.contains("playing") || e.target.id === "play") return;
    const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (x < .3) { show(cur - 1); loop(); }
    else if (x > .7) { show(cur + 1); loop(); }
    else { playing = !playing; box.classList.toggle("paused", !playing); }
  });
})();

/* ===== Desain v5 ===== */
// Layar pembuka: bintang berkumpul jadi satu cahaya
(() => {
  const it = $("#intro");
  $("#conv").innerHTML = Array.from({length: 46}, () => {
    const a = Math.random() * 6.28, r = Math.max(innerWidth, innerHeight) * (.4 + Math.random() * .5);
    return `<i style="--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r}px;animation-delay:${(Math.random() * 1.2).toFixed(2)}s"></i>`;
  }).join("");
  $("#introText").innerHTML = `Sebuah kejutan kecil<br>untuk ${CONFIG.name}`;
  const done = () => { it.classList.add("hide"); setTimeout(() => it.remove(), 1300); };
  it.onclick = done; setTimeout(done, 6200);
})();

// Kejutan akhir: hujan meteor, kembang api, pesan satu per satu
$("#surprise").onclick = () => {
  const f = $("#finale");
  $("#meteors").innerHTML = Array.from({length: 14}, () =>
    `<i class="meteor" style="left:${Math.random() * 130 - 10}%;animation-duration:${(1.4 + Math.random() * 2).toFixed(2)}s;animation-delay:${(Math.random() * 4).toFixed(2)}s;opacity:${(.5 + Math.random() * .5).toFixed(2)}"></i>`).join("");
  $("#finLines").innerHTML = CONFIG.finale.map((t, i) => `<p class="fin-line" style="animation-delay:${1.2 + i * 1.8}s">${t}</p>`).join("");
  const t0 = 1.2 + CONFIG.finale.length * 1.8;
  $("#finName").textContent = CONFIG.finalTitle; $("#finName").style.animationDelay = `0s,${t0}s`;
  $("#finSub").textContent = CONFIG.finalText; $("#finSub").style.animationDelay = t0 + 1 + "s";
  $("#finClose").style.animationDelay = t0 + 2 + "s";
  f.classList.add("show");
  const end = Date.now() + (t0 + 3) * 1000;
  (function boom() {
    if (!f.classList.contains("show") || Date.now() > end) return;
    confetti({particleCount: 60, spread: 360, startVelocity: 30, gravity: .7, ticks: 150, origin: {x: Math.random() * .8 + .1, y: Math.random() * .4 + .1}, colors: ["#ffd98a", "#ff9ecb", "#b9a6ff", "#fff"], zIndex: 100});
    setTimeout(boom, 500 + Math.random() * 500);
  })();
  confetti({particleCount: 50, spread: 120, origin: {y: .7}, zIndex: 100, ...shp});
};
$("#finClose").onclick = () => $("#finale").classList.remove("show");

/* ===== Desain v6 ===== */
const R = document.documentElement;
// 1+5. Langit berubah saat scroll + parallax
const skD = $(".sk-d"), skW = $(".sk-w"), nebula = $("#nebula"), hero = $(".hero"), tiltEls = [nebula, $("#orbs")];
let raf = 0, lt = 0;
function onScroll() {
  raf = 0;
  const max = R.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
  skD.style.opacity = (Math.max(0, 1 - p * 2) * .8).toFixed(2);
  skW.style.opacity = (Math.max(0, p * 2 - 1) * .8).toFixed(2);
  nebula.style.setProperty("--sy", scrollY);
  if (scrollY < innerHeight * 1.5) hero.style.setProperty("--sy", scrollY);
}
addEventListener("scroll", () => { raf = raf || requestAnimationFrame(onScroll); }, {passive: true});
onScroll();
const tilt = (x, y) => {
  const n = performance.now(); if (n - lt < 40) return; lt = n;
  tiltEls.forEach(e => { e.style.setProperty("--tx", x.toFixed(1)); e.style.setProperty("--ty", y.toFixed(1)); });
};
addEventListener("pointermove", e => e.pointerType === "mouse" && tilt((e.clientX / innerWidth - .5) * 24, (e.clientY / innerHeight - .5) * 24), {passive: true});
addEventListener("deviceorientation", e => e.gamma != null && tilt(Math.max(-1, Math.min(1, e.gamma / 40)) * 12, Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 40)) * 12), {passive: true});
addEventListener("pointerdown", () => {
  if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().catch(() => {});
}, {once: true});

// 4. Lentera terbang
const lant = (box, n) => { box.insertAdjacentHTML("beforeend", Array.from({length: n}, () =>
  `<i class="lantern" style="left:${Math.random() * 94}%;--w:${18 + Math.random() * 20}px;--d:${16 + Math.random() * 16}s;--dl:-${(Math.random() * 28).toFixed(1)}s;animation-delay:var(--dl),-${(Math.random() * 3).toFixed(1)}s"></i>`).join("")); };
lant($("#lanterns"), 7);

// 3. Efek suara kecil (disintesis, tanpa file)
let AC;
const ac = () => AC || (AC = new (window.AudioContext || window.webkitAudioContext)());
const tone = (f, t = 0, d = .8, type = "sine", v = .1) => {
  const c = ac(), o = c.createOscillator(), g = c.createGain(), n = c.currentTime + t;
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, n);
  g.gain.linearRampToValueAtTime(v, n + .02); g.gain.exponentialRampToValueAtTime(.0001, n + d);
  o.connect(g).connect(c.destination); o.start(n); o.stop(n + d + .05);
};
const noise = (d, v, f, t = 0) => {
  const c = ac(), b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), x = b.getChannelData(0);
  for (let i = 0; i < x.length; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / x.length);
  const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
  s.buffer = b; fl.type = "bandpass"; fl.frequency.value = f; g.gain.value = v;
  s.connect(fl).connect(g).connect(c.destination); s.start(c.currentTime + t);
};
const sfx = {
  ting: () => [1318, 1760, 2349].forEach((f, i) => tone(f, i * .14, 1.4, "sine", .09)),
  paper: () => noise(.5, .5, 2500),
  wish: () => [784, 988, 1319, 1760].forEach((f, i) => tone(f, i * .09, 1, "triangle", .08)),
  boom: () => { noise(.9, .7, 500); tone(70, 0, .7, "sine", .25); },
  clap: () => { for (let i = 0; i < 26; i++) noise(.06, .35, 1800 + Math.random() * 1500, i * .09 + Math.random() * .05); }
};
addEventListener("pointerdown", () => ac().resume && ac().resume(), {once: true});
$("#blow").addEventListener("click", () => setTimeout(sfx.ting, 1500));
$("#envelope").addEventListener("click", sfx.paper);
$("#surprise").addEventListener("click", () => { sfx.boom(); setTimeout(sfx.clap, 1800); });

// Lentera tambahan di kejutan akhir
$("#surprise").addEventListener("click", () => {
  let b = $("#finLant");
  if (!b) { b = document.createElement("div"); b.id = "finLant"; $("#finale").prepend(b); lant(b, 9); }
});

// 2. Bintang jatuh yang bisa diketuk
function shooter() {
  const busy = document.body.classList.contains("locked") || document.querySelector(".swal2-container") || $("#finale").classList.contains("show") || $("#dim").classList.contains("on");
  if (!busy && !document.querySelector(".shooter")) {
    const s = document.createElement("i"), dx = -(innerWidth + 160), dy = innerHeight * (.3 + Math.random() * .25);
    s.className = "shooter";
    s.style.cssText = `--t:${5 + Math.random() * 25}%;--dx:${dx}px;--dy:${dy}px;--ang:${(Math.atan2(-dy, -dx) * 180 / Math.PI).toFixed(1)}deg`;
    s.onclick = e => {
      s.remove(); sfx.wish();
      confetti({particleCount: 40, spread: 90, origin: {x: e.clientX / innerWidth, y: e.clientY / innerHeight}, colors: ["#ffd98a", "#ff9ecb", "#fff"], ...shp});
      Swal.fire({...sw, title: "Bintang jatuh! 🌠", text: CONFIG.wishes[Math.floor(Math.random() * CONFIG.wishes.length)], timer: 4200, timerProgressBar: true, showConfirmButton: false});
    };
    s.addEventListener("animationend", () => s.remove());
    document.body.appendChild(s);
  }
  setTimeout(shooter, 14000 + Math.random() * 10000);
}
setTimeout(shooter, 12000);

/* ===== Optimasi performa ===== */
if ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3) R.classList.add("lite");
// Jeda animasi berat saat bagian itu tidak terlihat
const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("off", !e.isIntersecting)));
[$(".cinema"), $("#cake")].forEach(el => io.observe(el));

/* ===== Navigasi antar bagian ===== */
(() => {
  const secs = [...document.querySelectorAll("#app>section")];
  const nav = document.createElement("nav"); nav.id = "secnav";
  nav.innerHTML = secs.map((_, i) => `<button aria-label="Bagian ${i + 1}"></button>`).join("");
  document.body.appendChild(nav);
  const bs = [...nav.children];
  bs.forEach((b, i) => b.onclick = () => secs[i].scrollIntoView({behavior: "smooth"}));
  bs[0].classList.add("on");
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) bs.forEach((b, i) => b.classList.toggle("on", secs[i] === e.target));
  }), {rootMargin: "-45% 0px -45% 0px"});
  secs.forEach(s => io2.observe(s));
  // surat yang terbuka lebih tinggi dari layar: longgarkan snap agar bisa dibaca
  $("#envelope").addEventListener("click", () => R.classList.add("free"));
})();
