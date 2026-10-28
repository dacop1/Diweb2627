/* ============================================================
   AÑADE TUS EJERCICIOS AQUÍ: cada bloque es una página nueva.
   url:  ruta al ejercicio · repo: enlace al código ("" si no hay)
   img:  captura opcional ("img/01.png"); si está vacía se dibuja una portada
   ============================================================ */
// Tu nombre: aparece en la etiqueta de la portada
const OWNER = "Tu nombre";
const EXERCISES = [
  { id:1, fecha:"2026-10-04", titulo:"Tema 01: Actividades",
    desc:"Actividades del Tema 01.",
    tags:[],
    aprendi:"",
    url:"../Tema-01/Actividades/index.html", repo:"", img:"" },
  { id:2, fecha:"2026-10-04", titulo:"Tema 02: Actividades",
    desc:"Actividades del Tema 02.",
    tags:[],
    aprendi:"",
    url:"../Tema-02/Actividades/index.html", repo:"", img:"" },
  { id:3, fecha:"2026-10-12", titulo:"Tema 03: Actividad 1",
    desc:"Primera actividad del Tema 03.",
    tags:[],
    aprendi:"",
    url:"../Tema-03/Actividades/Actividad1/index.html", repo:"", img:"" },
  { id:4, fecha:"2026-10-12", titulo:"Tema 03: Actividad 2",
    desc:"Segunda actividad del Tema 03.",
    tags:[],
    aprendi:"",
    url:"../Tema-03/Actividades/Actividad2/index.html", repo:"", img:"" },
  { id:5, fecha:"2026-10-28", titulo:"Tema 04",
    desc:"Ejercicios del Tema 04.",
    tags:[],
    aprendi:"",
    url:"../Tema-04/index.html", repo:"", img:"" }
];
/* ============================================================ */

const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
// Formato de fecha de cada ejercicio (ej.: "14 sept 2026"). Cambia "es" por otro idioma si quieres
const fmt = new Intl.DateTimeFormat("es", { day:"numeric", month:"short", year:"numeric" });
// Colores de las portadas generadas (para ejercicios sin captura). Pon los que quieras
const COLORS = ["#1f4d3f", "#b08d57", "#c8423b", "#4d7c69"];
// Debe coincidir con el breakpoint del CSS (760px): por debajo se muestra una sola página
const mq = matchMedia("(max-width:760px)");
const book = $("#book");
let cur = 0, leaves = [], L = 0, mobile = false;

/* Contenido de cada página, en este orden:
   1) el índice (se genera solo a partir de EXERCISES)
   2) una página por cada ejercicio (se genera sola; no hace falta tocarla)
   3) la última página, que puedes editar a tu gusto */
const pages = [
  { inner: `<h2>Índice</h2><ol class="toc">${EXERCISES.map((e, k) =>
      `<li><button type="button" data-go="${k + 1}"><span>${esc(e.titulo)}</span><i></i><b>${k + 2}</b></button></li>`).join("")}</ol>` },
  ...EXERCISES.map((e) => ({ inner: `
    <div class="head"><b>Ejercicio ${String(e.id).padStart(2, "0")}</b><time datetime="${esc(e.fecha)}">${fmt.format(new Date(e.fecha))}</time></div>
    <h2>${esc(e.titulo)}</h2>
    <div class="thumb p${e.id % 3}" style="--c:${COLORS[e.id % 4]}">${e.img ? `<img src="${esc(e.img)}" alt="Captura de ${esc(e.titulo)}" loading="lazy">` : ""}</div>
    <p>${esc(e.desc)}</p>
    <ul class="tags">${e.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    ${e.aprendi ? `<p class="note"><b>Qué aprendí:</b> ${esc(e.aprendi)}</p>` : ""}
    <div class="acts"><a class="btn solid" href="${esc(e.url)}">Ver ejercicio</a>${e.repo ? `<a class="btn" href="${esc(e.repo)}" target="_blank" rel="noopener">Código</a>` : ""}</div>` })),
  // ÚLTIMA PÁGINA: cambia el título y los <li> por tus próximos objetivos (o bórrala entera)
  { inner: `<h2>Próximos ejercicios</h2><ul class="todo"><li>Animaciones con scroll</li><li>Proyecto con un framework</li><li>Diseño de un sistema de componentes</li></ul>` }
];
if (pages.length % 2) pages.push({ inner: "" });
pages.forEach((p, i) => (p.folio = i + 1));

// PORTADA: el título está en el <h1> y tu nombre sale de OWNER. Edita el texto del <h1> a tu gusto
const coverHTML = (back) => back
  ? `<div class="face cover empty-cover back"><div class="hinge"></div></div>`
  : `<div class="face cover"><div class="hinge"></div><div class="label"><h1>Cuaderno de ejercicios de diseño web</h1><p>${esc(OWNER)}</p></div></div>`;
const pageHTML = (p, back) =>
  `<div class="face page ${back ? "verso back" : "recto"}">${p.inner}<span class="folio">${p.folio}</span><div class="shade"></div></div>`;

function build() {
  mobile = mq.matches;
  const faces = [{ cover: 1 }, ...pages, { backCover: 1 }];
  const html = (f, back) => f.cover ? coverHTML(false) : f.backCover ? coverHTML(true).replace(back ? "" : " back", "") : pageHTML(f, back);
  const units = [];
  faces.forEach((f, i) => (mobile || i % 2 === 0) ? units.push([f]) : units[units.length - 1].push(f));
  L = units.length;
  book.innerHTML = units.map((u, k) =>
    `<div class="leaf" style="z-index:${L - k}">${html(u[0], false)}${u[1] ? html(u[1], true) : ""}</div>`).join("");
  leaves = [...book.children];
  cur = 0;
  update(0);
}

function update(prev) {
  const max = mobile ? L - 1 : L;
  const changed = leaves.map((_, k) => k).filter((k) => (k < prev) !== (k < cur));
  if (cur < prev) changed.reverse();
  // Mitad de la duración del giro (--flip, en CSS), en milisegundos
  const half = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--flip")) * 500;
  leaves.forEach((el, k) => {
    // 90 = retraso en ms entre hojas cuando saltas varias a la vez desde el índice (0 = giran todas juntas)
    const r = changed.indexOf(k), d = r < 0 ? 0 : r * 90;
    el.style.transitionDelay = `${d}ms,${d + half}ms`;
    el.classList.toggle("flipped", k < cur);
    el.style.zIndex = k < cur ? k : L - k;
    el.children[0].inert = k !== cur;
    if (el.children[1]) el.children[1].inert = k !== cur - 1;
  });
  book.classList.toggle("closed", !mobile && cur === 0);
  book.classList.toggle("end", !mobile && cur === L);
  $("#prev").disabled = cur === 0;
  $("#next").disabled = cur >= max;
  $("#pos").textContent = cur === 0 ? "Portada" : cur >= max ? "Contraportada"
    : mobile ? `Página ${cur}` : `Páginas ${2 * cur - 1} y ${2 * cur}`;
}

function go(to) {
  const max = mobile ? L - 1 : L, prev = cur;
  cur = Math.max(0, Math.min(max, to));
  if (cur !== prev) update(prev);
}

$("#next").addEventListener("click", () => go(cur + 1));
$("#prev").addEventListener("click", () => go(cur - 1));
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(cur + 1);
  if (e.key === "ArrowLeft") go(cur - 1);
});
$("#stage").addEventListener("click", (e) => {
  const b = e.target.closest("[data-go]");
  if (b) { const f = +b.dataset.go + 1; return go(mobile ? f : Math.ceil(f / 2)); }
  if (e.target.closest("a,button,input")) return;
  const r = book.getBoundingClientRect();
  go(cur + (e.clientX > r.left + r.width / 2 ? 1 : -1));
});
let x0 = null;
$("#stage").addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
$("#stage").addEventListener("touchend", (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0; x0 = null;
  if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
});
mq.addEventListener("change", build);
build();
