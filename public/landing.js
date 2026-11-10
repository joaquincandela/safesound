/* SafeSound VOID: lógica de la landing. Lo que más vas a editar está aquí arriba. */
var WHATSAPP = '51939843523';
var PRECIO = 65;
var PRECIO_ANTES = 80;
var PRECIO_PACK_2 = 120;

var ACABADOS = [
  ['bs', 'Black Silver', 'Negro y plateado', 'negro'],
  ['bg', 'Black Gold', 'Negro y dorado', 'negro'],
  ['yg', 'Yellow Gold', 'Amarillo y dorado', 'color'],
  ['ws', 'White Silver', 'Blanco y plateado', 'blanco'],
  ['wp', 'White Purple', 'Blanco y morado', 'blanco'],
  ['wr', 'White Rose Gold', 'Blanco y oro rosa', 'blanco'],
  ['wc', 'White Clear', 'Blanco y transparente', 'blanco'],
  ['bc', 'Black Clear', 'Negro y transparente', 'negro'],
  ['pb', 'Purple Black', 'Negro y morado', 'negro'],
  ['rb', 'Rose Gold Black', 'Negro y oro rosa', 'negro'],
  ['sy', 'Silver Yellow', 'Plateado y amarillo', 'color'],
  ['sp', 'Silver Purple', 'Plateado y morado', 'color'],
  ['dp', 'Doble Purple', 'Morado y morado', 'color'],
  ['cy', 'Clear Yellow', 'Transparente y amarillo', 'color']
].map(function (a) { return { id: a[0], name: a[1], tone: a[2], g: a[3] }; });

var FILTROS = [['todos', 'Todos'], ['negro', 'Base negra'], ['blanco', 'Base blanca'], ['color', 'Color']];

var PREGUNTAS = [
  ['¿Cuánto cuestan?', 'Un par cuesta S/ 65, antes S/ 80. Si llevas 2 pares pagas S/ 120.'],
  ['¿Son audífonos?', 'No. VOID son earplugs pasivos: no tienen batería ni bluetooth.'],
  ['¿Voy a escuchar la música?', 'Sí. Reducen el ruido sin aislarte, así que sigues escuchando la música y a quien tienes al lado.'],
  ['¿Qué viene en la caja?', 'Tus earplugs VOID, el estuche portátil y 2 pares de tallas de repuesto.'],
  ['¿Qué tallas vienen?', 'VOID viene en tres tallas para que encuentres la que te queda.'],
  ['¿De qué material son?', 'Silicona médica hipoalergénica.'],
  ['¿Cómo los limpio?', 'Lávalos con agua tibia y jabón neutro. Déjalos secar al aire antes de guardarlos en su estuche.'],
  ['¿Cómo compro y cómo llega mi pedido?', 'Elige tu acabado y toca Pedir por WhatsApp. Escríbenos tu distrito para confirmar disponibilidad y entrega.']
];

var VIDEOS = [
  ['reel-gym', 'p-gym', 'En el spinning', 'Chica mostrando el estuche VOID en el gimnasio'],
  ['reel-todo', 'p-todo', 'Del concierto a tu llavero', 'Chica contando cómo usa VOID en conciertos y en su día'],
  ['reel-fest', 'p-fest', 'En pleno festival', 'Chica usando VOID en un festival']
];

/* ---------- Utilidades ---------- */
var $ = function (s) { return document.querySelector(s); };
var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
var fade = function (p, a, b) { return clamp((p - a) / (b - a)); };
var porId = function (id) { return ACABADOS.filter(function (a) { return a.id === id; })[0]; };
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var page = $('.page');

/* ---------- Pedido ----------
   lineas: colores ya sumados. activo: si el acabado en pantalla cuenta en el pedido.
   elegido: la persona ya tocó algo; antes de eso la barra del celular no deja pedir. */
var sel = 'bs', filtro = 'todos', qty = 1, lineas = [], activo = true, elegido = false;

/* Cada 2 pares, aunque sean de colores distintos, cuestan PRECIO_PACK_2. */
function precio(n) { return Math.floor(n / 2) * PRECIO_PACK_2 + (n % 2) * PRECIO; }
function pedido() { return activo ? lineas.concat([{ id: sel, qty: qty }]) : lineas.slice(); }
function totalPares() { return pedido().reduce(function (t, l) { return t + l.qty; }, 0); }
function mensaje() {
  var txt = pedido().map(function (l) { return l.qty + ' VOID ' + porId(l.id).name; }).join(', ');
  return 'Hola, quiero ' + txt + '. Total S/ ' + precio(totalPares()) + '.';
}
function enlaceWa() { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensaje()); }
function datosPixel() {
  return { value: precio(totalPares()), currency: 'PEN', num_items: totalPares(), content_type: 'product',
    content_ids: pedido().map(function (l) { return l.id; }) };
}
function pixel(ev, datos) { if (window.fbq) fbq('track', ev, datos); }

function pintarPedido() {
  var a = porId(sel), total = precio(totalPares()), pares = totalPares();
  $('#selName').textContent = activo ? 'VOID ' + a.name : 'Elige otro color';
  $('#selTone').textContent = activo ? a.tone : 'Toca un acabado para sumarlo';
  $('#selTotal').textContent = total;
  $('#selWas').textContent = pares > 1 ? pares * PRECIO : PRECIO_ANTES;
  $('#qty').textContent = activo ? qty : '–';
  $('#qInc').disabled = $('#qDec').disabled = $('#addColor').disabled = !activo;
  var img = $('#selImg');
  img.src = '/assets/full-' + sel + '.jpg';
  img.alt = 'VOID ' + a.name;
  $$('.wa').forEach(function (l) { l.href = enlaceWa(); });

  var txt = $('#buyTxt'), btn = $('#buyBtn'), th = $('#buyTh');
  if (elegido) {
    var uno = pedido().length === 1;
    txt.textContent = (uno ? pedido()[0].qty + ' ' + porId(pedido()[0].id).name : pares + ' pares') + ' · S/ ' + total;
    btn.textContent = 'Pedir'; btn.href = enlaceWa(); btn.target = '_blank'; btn.rel = 'noopener';
    th.src = '/assets/th-' + (activo ? sel : lineas[lineas.length - 1].id) + '.jpg'; th.hidden = false;
  } else {
    txt.textContent = 'Elige tu color';
    btn.textContent = 'Ver colores'; btn.href = '#catalogo'; btn.removeAttribute('target'); th.hidden = true;
  }

  var ul = $('#lines');
  ul.innerHTML = '';
  lineas.forEach(function (l, i) {
    var li = document.createElement('li');
    li.textContent = l.qty + ' × ' + porId(l.id).name;
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = 'Quitar';
    b.onclick = function () {
      lineas.splice(i, 1);
      if (!lineas.length && !activo) { activo = true; elegido = false; }
      pintarCatalogo(); pintarPedido();
    };
    li.appendChild(b); ul.appendChild(li);
  });
}

function pintarCatalogo() {
  var chips = $('#chips'); chips.innerHTML = '';
  FILTROS.forEach(function (f) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip' + (f[0] === filtro ? ' on' : ''); b.textContent = f[1];
    b.setAttribute('aria-pressed', f[0] === filtro);
    b.onclick = function () { filtro = f[0]; pintarCatalogo(); };
    chips.appendChild(b);
  });
  var grid = $('#grid'); grid.innerHTML = '';
  ACABADOS.filter(function (a) { return filtro === 'todos' || a.g === filtro; }).forEach(function (a) {
    var on = activo && a.id === sel;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'fin' + (on ? ' on' : ''); b.setAttribute('aria-pressed', on);
    b.innerHTML = '<span class="thumb"><img src="/assets/th-' + a.id + '.jpg" alt="" loading="lazy"></span><span class="fn" style="padding:0 8px">' + a.name + '</span>';
    b.onclick = function () { sel = a.id; qty = 1; activo = true; elegido = true; pintarCatalogo(); pintarPedido(); };
    grid.appendChild(b);
  });
}

$('#qInc').onclick = function () { qty = Math.min(qty + 1, 20); elegido = true; pintarPedido(); };
$('#qDec').onclick = function () { qty = Math.max(qty - 1, 1); elegido = true; pintarPedido(); };
$('#addColor').onclick = function () {
  var ya = lineas.filter(function (l) { return l.id === sel; })[0];
  if (ya) ya.qty += qty; else lineas.push({ id: sel, qty: qty });
  pixel('AddToCart', { value: qty * PRECIO, currency: 'PEN', content_type: 'product', content_ids: [sel] });
  activo = false; elegido = true; qty = 1;
  pintarCatalogo(); pintarPedido();
};
$$('.wa').concat([$('#buyBtn')]).forEach(function (l) {
  l.addEventListener('click', function () {
    if (l.id === 'buyBtn' && !elegido) return;
    pixel('InitiateCheckout', datosPixel());
    pixel('Lead', datosPixel());
  });
});
/* ViewContent ya lo envía CatalogViewTracker desde el layout. */

/* ---------- Preguntas ---------- */
var abierta = 0;
function pintarFaq() {
  var c = $('#faq'); c.innerHTML = '';
  PREGUNTAS.forEach(function (p, i) {
    var d = document.createElement('div'); d.className = 'qline';
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'q'; b.setAttribute('aria-expanded', i === abierta);
    b.innerHTML = '<span></span><svg class="qi' + (i === abierta ? ' on' : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>';
    b.firstChild.textContent = p[0];
    b.onclick = function () { abierta = i === abierta ? -1 : i; pintarFaq(); };
    d.appendChild(b);
    if (i === abierta) { var a = document.createElement('p'); a.className = 'body'; a.style.paddingBottom = '24px'; a.textContent = p[1]; d.appendChild(a); }
    c.appendChild(d);
  });
}

/* ---------- Videos ---------- */
var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"></path><path d="M17 10l4 4M21 10l-4 4"></path></svg>';
var ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"></path><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"></path></svg>';

VIDEOS.forEach(function (v) {
  var a = document.createElement('article'); a.className = 'reel';
  a.innerHTML = '<video src="/assets/' + v[0] + '.mp4" poster="/assets/' + v[1] + '.jpg" muted loop playsinline preload="metadata" aria-label="' + v[3] + '"></video><div class="rl"><span>' + v[2] + '</span><button class="snd" type="button" aria-label="Activar sonido" aria-pressed="false">' + ICON_OFF + '</button></div>';
  $('#reels').appendChild(a);
});
$$('.snd').forEach(function (btn, i) {
  btn.onclick = function () {
    var vs = $$('.reel video'), iba = !vs[i].muted;
    vs.forEach(function (v) { v.muted = true; });
    $$('.snd').forEach(function (b) { b.classList.remove('on'); b.innerHTML = ICON_OFF; b.setAttribute('aria-label', 'Activar sonido'); b.setAttribute('aria-pressed', 'false'); });
    if (!iba) {
      vs[i].muted = false; vs[i].play().catch(function () {});
      btn.classList.add('on'); btn.innerHTML = ICON_ON; btn.setAttribute('aria-label', 'Silenciar video'); btn.setAttribute('aria-pressed', 'true');
    }
  };
});
$$('video').forEach(function (v) { v.muted = true; });
if (!reduced) {
  var vio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) e.target.play().catch(function () {}); else e.target.pause();
    });
  }, { threshold: .25 });
  $$('video').forEach(function (v) { vio.observe(v); });
}

/* ---------- Onda de sonido ---------- */
for (var i = 0; i < 60; i++) {
  var bar = document.createElement('i');
  bar.style.height = Math.round(22 + 78 * Math.abs(Math.sin(i * .9) * Math.cos(i * .37))) + '%';
  bar.style.animationDelay = (-(i * 37 % 110) / 100) + 's';
  $('#wave').appendChild(bar);
}

/* ---------- Animación al bajar ---------- */
var words = $$('.word');
/* Solo se recalcula si cambia el ancho: en celular la barra del navegador no debe mover la página. */
var anchoVh = 0;
function fijarAlto() {
  if (window.innerWidth === anchoVh) return;
  anchoVh = window.innerWidth;
  page.style.setProperty('--vh', Math.max(window.innerHeight, 600) + 'px');
}
fijarAlto();
window.addEventListener('resize', fijarAlto);

if (!reduced) {
  page.classList.add('anim');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.rise').forEach(function (el) { io.observe(el); });
}

var hero = $('.hero');
hero.addEventListener('mousemove', function (e) {
  page.style.setProperty('--mx', ((e.clientX / window.innerWidth - .5) * 2).toFixed(3));
  page.style.setProperty('--my', ((e.clientY / window.innerHeight - .5) * 2).toFixed(3));
});

var story = $('.story'), pin = $('.pin'), reels = $('#reels'), frase = $('#frase'), fin = $('#final');
var pendiente = false;
function actualizar() {
  pendiente = false;
  var vh = window.innerHeight, st = page.style;
  var r = hero.getBoundingClientRect();
  st.setProperty('--h', clamp(-r.top / r.height).toFixed(4));
  r = story.getBoundingClientRect();
  var p = clamp(-r.top / (r.height - pin.offsetHeight));
  st.setProperty('--p', p.toFixed(4));
  st.setProperty('--a1', (1 - fade(p, .26, .34)).toFixed(3));
  st.setProperty('--a2', (fade(p, .32, .4) * (1 - fade(p, .62, .7))).toFixed(3));
  st.setProperty('--a3', fade(p, .68, .76).toFixed(3));
  r = reels.getBoundingClientRect();
  st.setProperty('--rv', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
  r = fin.getBoundingClientRect();
  st.setProperty('--f', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
  r = frase.getBoundingClientRect();
  var lit = reduced ? 6 : Math.floor(clamp((vh * .8 - r.top) / (vh * .55)) * 6.99);
  words.forEach(function (w, n) { w.style.opacity = n < lit ? 1 : .3; });
}
function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); } }
window.addEventListener('scroll', pedir, { passive: true });
window.addEventListener('resize', pedir);

/* ---------- Escucha la diferencia ----------
   Una sola pista se procesa en vivo: al activar VOID baja el volumen y se apagan los agudos.
   Es una simulación, no una medición. */
function initDemo(cargarAudio) {
  var btn = document.querySelector('#demoPlay');
  if (!btn || btn.getAttribute('data-listo')) return;
  btn.setAttribute('data-listo', '1');
  var offB = document.querySelector('#demoOff'), onB = document.querySelector('#demoOn');
  var aviso = document.querySelector('#demoMsg');
  var barras = Array.prototype.slice.call(document.querySelectorAll('#eq i'));
  var ctx, ganancia, filtro, analizador, datos, usaVoid = false, sonando = false, listo = false, cargando = false;
  function pintar() {
    btn.classList.toggle('on', sonando);
    btn.setAttribute('aria-label', sonando ? 'Pausar audio' : 'Reproducir audio');
    offB.className = usaVoid ? '' : 'on'; onB.className = usaVoid ? 'on' : '';
    offB.setAttribute('aria-pressed', !usaVoid); onB.setAttribute('aria-pressed', usaVoid);
  }
  function animar() {
    if (!sonando) { barras.forEach(function (b) { b.style.transform = 'scaleY(.08)'; }); return; }
    analizador.getByteFrequencyData(datos);
    var suma = 0;
    barras.forEach(function (b, i) {
      var v = datos[Math.min(datos.length - 1, 1 + Math.floor(i * .9))] / 255;
      suma += v;
      b.style.transform = 'scaleY(' + Math.max(.06, v).toFixed(3) + ')';
    });
    window.nivelDemoVoid = suma / barras.length;
    requestAnimationFrame(animar);
  }
  function aplicar() {
    if (!ctx) return;
    ganancia.gain.setTargetAtTime(usaVoid ? .3 : 1, ctx.currentTime, .05);
    filtro.frequency.setTargetAtTime(usaVoid ? 6500 : 20000, ctx.currentTime, .05);
  }
  function fallo() {
    sonando = false; pintar();
    aviso.textContent = 'No pudimos reproducir el audio. Revisa que tu dispositivo tenga el sonido activado.';
  }
  function crearAudio() {
    var C = window.AudioContext || window.webkitAudioContext;
    ctx = new C();
    ganancia = ctx.createGain(); filtro = ctx.createBiquadFilter(); analizador = ctx.createAnalyser();
    filtro.type = 'lowpass'; filtro.frequency.value = 20000; analizador.fftSize = 256;
    datos = new Uint8Array(analizador.frequencyBinCount);
    ganancia.connect(filtro); filtro.connect(analizador); analizador.connect(ctx.destination);
    /* En iPhone esto evita que el interruptor de silencio apague el audio de la web. */
    var mudo = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
    mudo.loop = true;
    var m = mudo.play(); if (m && m.catch) m.catch(function () {});
  }
  function tocar() {
    try {
      if (!ctx) crearAudio();
      var r = ctx.resume(); if (r && r.catch) r.catch(fallo);
    } catch (e) { fallo(); return; }
    aviso.textContent = 'Simulación con audio de muestra, no es una medición. Empieza con volumen medio.';
    sonando = true; pintar(); aplicar();
    if (listo || cargando) { animar(); return; }
    cargando = true;
    cargarAudio().then(function (bytes) {
      ctx.decodeAudioData(bytes, function (pista) {
        var fuente = ctx.createBufferSource();
        fuente.buffer = pista; fuente.loop = true; fuente.connect(ganancia); fuente.start(0);
        listo = true; cargando = false;
        if (!sonando) ctx.suspend();
      }, fallo);
    }).catch(fallo);
    animar();
  }
  function parar() {
    if (ctx) ctx.suspend();
    sonando = false; pintar(); animar();
  }
  function elegir(v) { usaVoid = v; pintar(); aplicar(); if (!sonando) tocar(); }
  btn.onclick = function () { if (sonando) parar(); else tocar(); };
  offB.onclick = function () { elegir(false); };
  onB.onclick = function () { elegir(true); };
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.snd') && sonando) parar(); });
  new IntersectionObserver(function (es) { if (!es[0].isIntersecting && sonando) parar(); }, { threshold: .1 }).observe(document.querySelector('#escucha'));
  pintar(); animar();
}

pintarCatalogo();
pintarPedido();
pintarFaq();
actualizar();
initDemo(function () { return fetch('/assets/demo-concierto.mp3').then(function (r) { if (!r.ok) throw new Error('audio'); return r.arrayBuffer(); }); });
