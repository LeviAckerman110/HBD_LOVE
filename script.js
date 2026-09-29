(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const C = CONFIG, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || innerWidth < 600;
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
let lang = ls.get('lang') || (/^ar/i.test(navigator.language) ? 'ar' : 'en');
const waNum = String(CONFIG.whatsapp).replace(/\D/g, '');
const T = k => C.t[lang][k];
const L = o => (o && typeof o === 'object') ? o[lang] : o;

// theme
const th = C.theme, root = document.documentElement.style;
[['pink', 'pink'], ['pink-light', 'pinkLight'], ['white', 'white'], ['night', 'night'], ['purple', 'purple'], ['gold', 'gold'], ['red', 'red']].forEach(([v, k]) => root.setProperty('--' + v, th[k]));

// ---------- i18n ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(e => {
    const v = T(e.dataset.i18n);
    if (!e.classList.contains('tw')) { e.textContent = v; return; }
    if (e.classList.contains('typing')) { e.dataset.done = '1'; e.classList.remove('typing'); }   // تبديل اللغة أثناء الكتابة
    e.dataset.full = v; e._tok = (e._tok || 0) + 1;
    if (e.dataset.done) e.textContent = v; else twRender(e, 0);
  });
  $$('[data-i18n-aria]').forEach(e => e.setAttribute('aria-label', T(e.dataset.i18nAria)));
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  $('#music').setAttribute('aria-label', T('music'));
  if (hbNum) hbNum.textContent = `${dig(hbBpm)} ${T('hbLabel')}`;
  if (hbCapped) hbMsg.textContent = T('hbCap');
  if (Object.keys(chosen).length >= C.choices.length) { const m = $('#chooseMsg'); m.textContent = T('chooseFinal'); m.classList.add('in'); }
  if (chosenFinal) $('#nextChapterMsg').textContent = T('nextChapter');
  $('#sig').textContent = C.signature;
  $('#surMsg').textContent = T('surMsg');
  $('#wa').textContent = T('wa');
  $('#wa').href = `https://wa.me/${waNum}?text=${encodeURIComponent(L(C.whatsappText))}`;
  showNo(); renderTimeline(); renderGallery(); renderReasons(); renderFunny(); renderChoices(); renderLetters(); meterLang(); tickCount(); tickSince(); renderDate(); renderChapter();
  observe(); if (introDone) twObs();
}
$$('.lang button').forEach(b => b.onclick = () => { lang = b.dataset.l; ls.set('lang', lang); applyLang(); });

// ---------- typewriter (يكتب الجملة، تثبت، ونكمل لما تنزل للي بعدها) ----------
let introDone = false, tq = Promise.resolve();
function twRender(el, n) {
  const ch = [...el.dataset.full], a = document.createElement('span'), b = document.createElement('span');
  a.className = 't-on'; b.className = 't-off';
  a.textContent = ch.slice(0, n).join(''); b.textContent = ch.slice(n).join('');
  el.textContent = ''; el.append(a, b);
}
function typeEl(el) {
  return new Promise(res => {
    const tok = el._tok, ch = [...el.dataset.full], sp = Math.min(45, Math.max(18, 2200 / ch.length));
    if (reduce || el.dataset.done) { el.dataset.done = '1'; el.textContent = el.dataset.full; return res(); }
    let i = 0; el.classList.add('typing');
    (function step() {
      if (el._tok !== tok || el.dataset.done) return res();
      i++; twRender(el, i);
      if (i < ch.length) setTimeout(step, sp);
      else { el.classList.remove('typing'); el.dataset.done = '1'; el.textContent = el.dataset.full; res(); }
    })();
  });
}
const tio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { tio.unobserve(e.target); tq = tq.then(() => typeEl(e.target)); }
}), { threshold: .6 });
function twObs() { $$('.tw').forEach(e => { if (!e.dataset.done) tio.observe(e); }); }

// ---------- hearts ----------
const hearts = $('#hearts');
function spawnHeart() {
  if (reduce || document.hidden) return;
  const h = document.createElement('b');
  h.textContent = ['❤', '♡', '💗'][Math.random() * 3 | 0];
  h.style.cssText = `left:${Math.random() * 100}%;font-size:${12 + Math.random() * 22}px;color:var(--pink);animation-duration:${7 + Math.random() * 6}s`;
  hearts.appendChild(h); setTimeout(() => h.remove(), 13000);
}
setInterval(spawnHeart, lowEnd ? 900 : 500);

// ---------- landing card interactivity ----------
const lcard = $('#landing .card');
if (!reduce) {
  if (matchMedia('(hover:hover)').matches) {
    lcard.addEventListener('mousemove', e => {
      const r = lcard.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      lcard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    lcard.addEventListener('mouseleave', () => lcard.style.transform = '');
  } else {
    lcard.addEventListener('touchmove', e => {
      const t = e.touches[0], r = lcard.getBoundingClientRect(), x = (t.clientX - r.left) / r.width - .5, y = (t.clientY - r.top) / r.height - .5;
      lcard.classList.add('tilting'); lcard.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    }, { passive: true });
    lcard.addEventListener('touchend', () => { lcard.classList.remove('tilting'); lcard.style.transform = ''; });
  }
}

// ---------- NO button ----------
const no = $('#no'), yes = $('#yes'), noMsg = $('#noMsg');
const msgs = () => C.noMessages[lang];
let tries = 0, unlocked = false, lastMsg = -1, lastTry = 0, hint = false;
function showNo() { noMsg.textContent = hint ? T('lockHint') : (lastMsg >= 0 ? msgs()[Math.min(lastMsg, msgs().length - 1)] : ''); }
function dodge(e) {
  e.preventDefault();
  if (Date.now() - lastTry < 700) return;      // كل محاولة لازم تتقرأ
  lastTry = Date.now(); tries++; hint = false;
  lastMsg = Math.min(tries - 1, msgs().length - 1); showNo();
  if (no.parentNode !== document.body) document.body.appendChild(no);
  no.classList.add('run');
  const w = no.offsetWidth, h = no.offsetHeight, pad = 14;
  no.style.left = pad + Math.random() * (innerWidth - w - pad * 2) + 'px';
  no.style.top = 70 + Math.random() * (innerHeight - h - 140) + 'px';
  if (tries >= msgs().length && !unlocked) {   // بعد ما يشوف كل الجمل، YES يتفتح
    unlocked = true;
    yes.classList.remove('locked'); yes.classList.add('unlocked'); yes.setAttribute('aria-disabled', 'false');
  }
}
no.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') dodge(e); });
no.addEventListener('click', dodge);
no.addEventListener('touchstart', dodge, { passive: false });

// ---------- YES transition ----------
yes.onclick = () => {
  if (!unlocked) { hint = true; showNo(); yes.classList.remove('shake'); void yes.offsetWidth; yes.classList.add('shake'); return; }
  no.style.display = 'none';
  const b = $('#burst'); b.classList.add('go');
  const p = $('#intro');
  setTimeout(() => { $('#landing').style.display = 'none'; hearts.style.display = 'none'; $('#main').hidden = false; window.scrollTo(0, 0);
    p.textContent = T('forName').replace('{name}', L(C.name)); p.classList.add('show'); }, 1500);
  const hideIntro = () => { if (introDone) return; introDone = true; p.classList.remove('show'); b.style.display = 'none'; observe(); setTimeout(twObs, 700); };
  p.onclick = hideIntro;
  setTimeout(hideIntro, 9000);
};

// ---------- stars ----------
const stars = $('#stars');
for (let i = 0; i < (lowEnd ? 45 : 90); i++) {
  const s = document.createElement('i');
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s;transform:scale(${.6 + Math.random() * 1.4})`;
  stars.appendChild(s);
}
// parallax (desktop) + scroll progress
if (!lowEnd && !reduce) addEventListener('mousemove', e => {
  stars.style.setProperty('--mx', (e.clientX / innerWidth - .5) * 14 + 'px');
  stars.style.setProperty('--my', (e.clientY / innerHeight - .5) * 14 + 'px');
});
let tick = false;
addEventListener('scroll', () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    document.body.style.setProperty('--p', p.toFixed(3));
    tick = false;
  });
}, { passive: true });

// ---------- reveal ----------
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target.id === 'gallery') ; }
}), { threshold: .2 });
function observe() { $$('.rv,.ev').forEach(e => { if (!e.classList.contains('in')) io.observe(e); }); }


// image with graceful placeholder
function img(src, alt) {
  if (!src) return '';
  return `<img src="${src}" alt="${alt || ''}" loading="lazy" onerror="this.parentNode.classList.add('ph');this.replaceWith(document.createTextNode('❤'))">`;
}
const fmt = d => { try { return (/^\d{4}-\d\d-\d\d$/.test(d) ? new Date(d + 'T12:00:00') : new Date(d)).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return d; } };

function renderTimeline() {
  $('#timeline').innerHTML = C.timeline.map(e => `<article class="ev"><div class="glass"><time>${fmt(e.date)}</time><h3 class="serif">${L(e.title)}</h3><p>${L(e.text)}</p>${e.image ? `<div class="ph0">${img(e.image, L(e.title))}</div>` : ''}</div></article>`).join('');
}

// ---------- gallery ----------
function renderGallery() {
  const g = $('#gallery');
  g.innerHTML = C.memories.map((m, i) => `<div class="pol rv" role="button" tabindex="0" style="--r:${(i % 2 ? 1 : -1) * (1 + (i * 1.3) % 3)}deg" data-i="${i}"><div class="ph">${img(m.image, L(m.title)) || '❤'}</div><small>${fmt(m.date)}</small><h3 class="serif">${L(m.title)}</h3><p>${L(m.text)}</p></div>`).join('');
  $$('.pol', g).forEach(c => {
    c.onclick = () => openLB(+c.dataset.i);
    c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } };
    if (+c.dataset.i === 0) c.ondblclick = e => { e.preventDefault(); toast(T('foundEgg')); popHearts(innerWidth / 2, innerHeight / 2); };
    if (!lowEnd && !reduce) {
      c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `rotate(0) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.04)`; });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    }
  });
}
function openLB(i) {
  const m = C.memories[i], im = $('#lbImg');
  im.style.display = ''; im.src = m.image; im.alt = L(m.title); im.onerror = () => im.style.display = 'none';
  $('#lbT').textContent = L(m.title); $('#lbD').textContent = fmt(m.date) + ' — ' + L(m.text);
  $('#lightbox').hidden = false; $('#lbClose').focus();
}
$('#lbClose').onclick = () => $('#lightbox').hidden = true;
$('#lightbox').onclick = e => { if (e.target.id === 'lightbox') e.target.hidden = true; };
addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').hidden = true; });

// ---------- reasons ----------
function popHearts(x, y) {
  if (reduce) return;
  for (let i = 0; i < 8; i++) {
    const h = document.createElement('span'); h.className = 'pop'; h.textContent = '❤';
    h.style.cssText = `left:${x}px;top:${y}px;color:var(--pink);--x:${(Math.random() - .5) * 140}px;--y:${-40 - Math.random() * 90}px`;
    document.body.appendChild(h); setTimeout(() => h.remove(), 1000);
  }
}
function renderFlip(sel, data, front) {
  const box = $(sel);
  box.innerHTML = data.map(r => `<div class="rc" role="button" tabindex="0"><div><b class="f">${front}</b><b class="bk">${L(r)}</b></div></div>`).join('');
  $$('.rc', box).forEach(c => { c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } }; c.onclick = () => { c.classList.toggle('flip'); const r = c.getBoundingClientRect(); popHearts(r.left + r.width / 2, r.top + r.height / 2); }; });
}
function renderReasons() { renderFlip('#reasons', C.reasons, '❤'); }
function renderFunny() { renderFlip('#funny', C.funny, '😄'); }

// ---------- countdown + confetti ----------
const cv = $('#confetti'), cx = cv.getContext('2d');
let cRun = false;
function confetti() {
  if (reduce || cRun) return; cRun = true;
  cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
  const ps = Array.from({ length: lowEnd ? 50 : 110 }, () => ({ x: Math.random() * cv.width, y: -Math.random() * cv.height, v: 2 + Math.random() * 3, c: ['#f2a3bd', '#e6c27a', '#fff', '#e0526f'][Math.random() * 4 | 0], s: 4 + Math.random() * 5 }));
  let f = 0;
  (function draw() {
    cx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.y += p.v; cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s * .6); });
    if (++f < 400) requestAnimationFrame(draw); else { cx.clearRect(0, 0, cv.width, cv.height); cRun = false; }
  })();
}
let celebrated = false;
function tickCount() {
  const el = $('#count'); let t = new Date(C.birthday);
  if (isNaN(t)) { el.hidden = true; return; }
  while (t - Date.now() < -864e5) t.setFullYear(t.getFullYear() + 1);
  const d = t - Date.now();
  if (d <= 0) { el.innerHTML = `<h3 class="serif gold">${T('bdayNow')}</h3>`; if (!celebrated) { celebrated = true; confetti(); } return; }
  const v = [d / 864e5, d / 36e5 % 24, d / 6e4 % 60, d / 1e3 % 60].map(Math.floor), k = ['days', 'hours', 'mins', 'secs'];
  el.innerHTML = v.map((n, i) => `<div><b>${n}</b><small>${T(k[i])}</small></div>`).join('');
}
setInterval(tickCount, 1000);
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !reduce) confetti(); }), { threshold: .5 }).observe($('.bday'));

// ---------- calendar → time → confirmation ----------
let view = new Date(); view.setDate(1);
let picked = '', step = 'cal', tm = { h: 0, m: '00', ap: 'PM' };   // step: cal | time | done
const pad2 = n => String(n).padStart(2, '0');
const nowD = new Date(), todayISO = `${nowD.getFullYear()}-${pad2(nowD.getMonth() + 1)}-${pad2(nowD.getDate())}`;
const dig = s => lang === 'ar' ? String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(s);
const timeStr = () => `${dig(tm.h)}:${dig(tm.m)} ${lang === 'ar' ? (tm.ap === 'AM' ? 'ص' : 'م') : tm.ap}`;
const goDate = () => (step === 'time' ? $('#timeBox') : $('#dateResult')).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
function renderDate() {
  $('#calBox').hidden = $('#calHint').hidden = step !== 'cal';
  $('#timeBox').hidden = step !== 'time';
  if (step === 'cal') renderCal();
  if (step === 'time') renderTime();
  showDate();
}
function renderCal() {
  const loc = lang === 'ar' ? 'ar-EG' : 'en-US', ar = lang === 'ar';
  $('#calHead').innerHTML = `<button id="pv" aria-label="prev">${ar ? '›' : '‹'}</button><b>${view.toLocaleDateString(loc, { month: 'long', year: 'numeric' })}</b><button id="nx" aria-label="next">${ar ? '‹' : '›'}</button>`;
  $('#pv').onclick = () => { view.setMonth(view.getMonth() - 1); renderCal(); };
  $('#nx').onclick = () => { view.setMonth(view.getMonth() + 1); renderCal(); };
  const first = view.getDay(), n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  let h = [0, 1, 2, 3, 4, 5, 6].map(i => `<span>${new Date(2023, 0, 1 + i).toLocaleDateString(loc, { weekday: 'narrow' })}</span>`).join('') + '<i></i>'.repeat(first);
  for (let d = 1; d <= n; d++) {
    const iso = `${view.getFullYear()}-${pad2(view.getMonth() + 1)}-${pad2(d)}`;
    h += `<button data-d="${iso}" ${iso < todayISO ? 'disabled' : ''}>${d.toLocaleString(loc)}</button>`;
  }
  $('#calGrid').innerHTML = h;
  $$('#calGrid button[data-d]').forEach(b => b.onclick = () => {
    const r = b.getBoundingClientRect(); picked = b.dataset.d; tm = { h: 0, m: '00', ap: 'PM' }; step = 'time';
    popHearts(r.left + r.width / 2, r.top); renderDate(); goDate();
  });
}
function renderTime() {
  const ar = lang === 'ar';
  $('#pickedDay').textContent = '📅 ' + fmt(picked);
  $('#hrs').innerHTML = [...Array(12)].map((_, i) => `<button data-h="${i + 1}" class="${tm.h === i + 1 ? 'on' : ''}">${dig(i + 1)}</button>`).join('');
  $('#mins').innerHTML = ['00', '15', '30', '45'].map(m => `<button data-m="${m}" class="${tm.m === m ? 'on' : ''}">${dig(':' + m)}</button>`).join('');
  $('#ampm').innerHTML = ['AM', 'PM'].map(a => `<button data-a="${a}" class="${tm.ap === a ? 'on' : ''}">${ar ? (a === 'AM' ? 'صباحًا' : 'مساءً') : a}</button>`).join('');
  $('#timeOk').disabled = !tm.h;
}
const pick = (id, key, fn) => $(id).onclick = e => { const b = e.target.closest('button'); if (b) { fn(b.dataset[key]); renderTime(); } };
pick('#hrs', 'h', v => tm.h = +v); pick('#mins', 'm', v => tm.m = v); pick('#ampm', 'a', v => tm.ap = v);
$('#timeOk').onclick = () => {
  if (!tm.h) return; step = 'done'; renderDate(); goDate();
  const r = $('#dateResult').getBoundingClientRect(); popHearts(innerWidth / 2, Math.min(innerHeight * .4, r.top + 40));
};
$('#backDay').onclick = () => { step = 'cal'; renderDate(); };
function showDate() {
  const r = $('#dateResult'); if (step !== 'done') { r.innerHTML = ''; return; }
  const place = L(C.dateNight.location), when = `${fmt(picked)} · ${T('at')} ${timeStr()}`;
  const msg = T('dateMsg').replace('{date}', fmt(picked)).replace('{time}', timeStr()).replace('{place}', place);
  r.innerHTML = `<h3 class="script">${T('dateDone')}</h3><p>${when}<br>📍 ${place}</p><p class="dh">${T('dateHint')}</p><a class="yes" target="_blank" rel="noopener" href="https://wa.me/${waNum}?text=${encodeURIComponent(msg)}">${T('sendDate')}</a><button id="redo" class="linkBtn">${T('change')}</button>`;
  $('#redo').onclick = () => { step = 'cal'; picked = ''; renderDate(); goDate(); };
}

// ---------- letters ----------
const lopen = new Set();
function updateLC() { $('#lettersCount').textContent = T('lettersCount').replace('{n}', dig(lopen.size)).replace('{total}', dig(C.letters.length)); }
function renderLetters() {
  $('#letters').innerHTML = C.letters.map((l, i) => `<div class="env${lopen.has(i) ? ' open' : ''}" role="button" tabindex="0" aria-expanded="${lopen.has(i)}" data-i="${i}"><span class="seal">\u2764</span><h3 class="serif">${L(l.label)}</h3><div class="paper"><div><p>${L(l.text)}</p></div></div></div>`).join('');
  $$('.env').forEach(e => {
    e.onclick = () => {
      const i = +e.dataset.i, open = e.classList.toggle('open'); e.setAttribute('aria-expanded', open);
      if (open) { lopen.add(i); const r = e.getBoundingClientRect(); popHearts(r.left + r.width / 2, r.top + 30); }
      updateLC();
    };
    e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); e.click(); } };
  });
  updateLC();
}

// ---------- love meter ----------
const needle = $('#needle'), gProg = $('#gProg'), gTop = $('#gTop'), gMsg = $('#gMsg'), gWrap = $('#gWrap'), mBox = $('#meterBox');
let mv = 50, broke = 0, running = false, isBroken = false;
const sleep = ms => new Promise(r => setTimeout(r, ms * (reduce ? .3 : 1)));
const easeIO = t => t * t * (3 - 2 * t), easeOut = t => 1 - (1 - t) * (1 - t);
function setV(x) {
  mv = x; needle.setAttribute('transform', `rotate(${-90 + x * 1.8} 120 120)`);
  gProg.style.strokeDashoffset = 282.74 * (1 - x / 100); gTop.textContent = dig(Math.round(x));
}
function tween(from, to, ms, ease = easeIO, jit = 0) {
  return new Promise(res => {
    const t0 = performance.now(), d = ms * (reduce ? .3 : 1);
    (function f() {
      const p = Math.min(1, (performance.now() - t0) / d);
      setV(Math.max(0, Math.min(100, from + (to - from) * ease(p) + (p < 1 ? (Math.random() - .5) * jit : 0))));
      p < 1 ? requestAnimationFrame(f) : res();
    })();
  });
}
async function say(text, ms, cls = '') {
  gMsg.className = 'gMsg ' + cls; gMsg.textContent = text; void gMsg.offsetWidth; gMsg.classList.add('show');
  await sleep(ms); gMsg.classList.add('out'); await sleep(350);
  gMsg.textContent = ''; gMsg.className = 'gMsg';
}
function fx(cls) { const e = document.createElement('i'); e.className = cls; if (cls === 'steam') e.style.left = 25 + Math.random() * 50 + '%'; gWrap.append(e); setTimeout(() => e.remove(), 1400); }
function burstHearts() { const r = gWrap.getBoundingClientRect(); popHearts(r.left + r.width / 2, r.top + r.height * .75); popHearts(r.left + r.width / 2, r.top + r.height * .6); }
function renderMeterResult() {
  const nm = L(C.name);
  $('#gX').textContent = T('mx').replace('{name}', nm); $('#gInf').textContent = T('minf');
  $('#gNote').textContent = T('mnote').replace('{name}', nm); $('#gCnt').textContent = T('mcnt').replace('{n}', dig(broke));
}
async function breakNeedle() {
  mBox.classList.remove('shake', 'hot'); mBox.classList.add('broken'); fx('ring'); burstHearts();
  if (!reduce) await new Promise(res => {
    let x = 0, y = 0, vx = 4, vy = -7, a = 90, f = 0;
    (function s() { x += vx; y += vy; vy += .6; a += 14; needle.setAttribute('transform', `translate(${x} ${y}) rotate(${a} 120 120)`); needle.style.opacity = Math.max(0, 1 - f / 50); ++f < 55 ? requestAnimationFrame(s) : res(); })();
  });
  needle.style.display = 'none'; needle.style.opacity = '';
  $('#gCrack').classList.add('on'); gTop.textContent = '\u221e'; gTop.classList.add('inf');
  isBroken = true; broke++; renderMeterResult();
  $('#gResult').hidden = false; $('#again').hidden = false; running = false;
}
async function runMeter() {
  if (running) return; running = true; isBroken = false;
  $('#measure').hidden = $('#again').hidden = $('#gResult').hidden = true;
  mBox.classList.remove('broken', 'hot', 'shake'); needle.style.display = ''; needle.style.opacity = '';
  $('#gCrack').classList.remove('on'); gTop.classList.remove('inf'); setV(mv > 99 ? 100 : mv);
  const S = T('meterSeq');
  await tween(mv, 0, 600);
  await Promise.all([say(S[0], 2000), tween(0, 38, 2000)]);
  await Promise.all([say(S[1], 2400), tween(38, 74, 2400, easeIO, 4)]);
  await Promise.all([say(S[2], 2900, 'warn'), tween(74, 99, 2200, easeOut, 2).then(() => { mBox.classList.add('hot'); return sleep(700); })]);
  mBox.classList.add('hot', 'shake'); fx('ring'); burstHearts();
  await Promise.all([say(S[3], 2300, 'err'), tween(99, 100, 200)]);
  const steam = setInterval(() => fx('steam'), 140), vib = setInterval(() => setV(100 - Math.random() * 3), 40);
  await say(S[4], 2800, 'warn');
  clearInterval(vib); clearInterval(steam);
  await breakNeedle();
}
$('#measure').onclick = runMeter; $('#again').onclick = runMeter;
function meterLang() { if (!running && !isBroken) setV(mv); if (isBroken) renderMeterResult(); }

// ---------- moon letter ----------
$('#moonM').innerHTML = C.moonLetter ? `${C.moonLetter.replace(/[<>&]/g, '')}<i>\u2764</i>` : '';

// ---------- surprise ----------
$('#surprise').onclick = () => {
  $('#surBox').hidden = false;
  if (C.surpriseImage) { const i = $('#surImg'); i.src = C.surpriseImage; i.hidden = false; i.onerror = () => i.hidden = true; }
  $('#surClose').focus();
  for (let k = 0; k < 3; k++) setTimeout(() => popHearts(innerWidth / 2, innerHeight / 2), k * 300);
};
const closeSur = () => $('#surBox').hidden = true;
$('#surBox').onclick = e => { if (e.target.id === 'surBox') closeSur(); };
$('#surClose').onclick = closeSur;
addEventListener('keydown', e => { if (e.key === 'Escape') closeSur(); });

// ---------- music ----------
const audio = $('#audio'), mb = $('#music');
if (C.music) {
  audio.src = C.music; mb.hidden = false;
  audio.addEventListener('error', () => { mb.hidden = true; mb.classList.remove('on'); });
  mb.onclick = () => { if (audio.paused) { audio.play().then(() => mb.classList.add('on')).catch(() => {}); } else { audio.pause(); mb.classList.remove('on'); } };
}

// ---------- global button ripple (delegated, covers dynamic buttons too) ----------
if (!reduce) addEventListener('pointerdown', e => {
  const b = e.target.closest('.yes,.bubble'); if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('i');
  s.className = 'ripple'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.appendChild(s); setTimeout(() => s.remove(), 650);
});

// ---------- easter eggs (secret star + hidden photo double-click) ----------
function toast(msg) {
  const p = $('#ps'); p.textContent = msg; p.classList.add('show');
  clearTimeout(p._t); p._t = setTimeout(() => p.classList.remove('show'), 4000);
}
$('#secretStar').onclick = () => { toast(T('secret')); popHearts(innerWidth / 2, innerHeight / 2); };

// ---------- chapters indicator ----------
const chapEls = $$('[data-chapter]'), chapInd = $('#chapterInd');
if (chapEls.length) {
  const chapIO = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) chapInd.dataset.n = e.target.dataset.chapter; });
    if (chapInd.dataset.n) { chapInd.classList.add('show'); renderChapter(); } else chapInd.classList.remove('show');
  }, { threshold: .35 });
  chapEls.forEach(e => chapIO.observe(e));
}
function renderChapter() {
  const n = +chapInd.dataset.n || 1, list = T('chapters');
  chapInd.innerHTML = `<b>${dig(String(n).padStart(2, '0'))} / ${dig('05')}</b><span>${list[n - 1] || ''}</span>`;
}

// ---------- days since we started (reuses first timeline entry, no duplicate config) ----------
function tickSince() {
  const el = $('#sinceCount'); if (!el) return;
  const start = new Date(C.timeline[0]?.date); if (isNaN(start)) { el.hidden = true; return; }
  const d = Math.max(0, Date.now() - start);
  const v = [d / 864e5, d / 36e5 % 24, d / 6e4 % 60].map(Math.floor), k = ['days', 'hours', 'mins'];
  el.innerHTML = v.map((n, i) => `<div><b>${dig(n)}</b><small>${T(k[i])}</small></div>`).join('');
}
setInterval(tickSince, 30000);

// ---------- heartbeat ----------
let hbTaps = 0, hbCapped = false, hbBpm = 70;
const heartBtn = $('#heart'), hbNum = $('#hbNum'), hbMsg = $('#hbMsg');
if (heartBtn) heartBtn.onclick = () => {
  if (hbCapped) return;
  hbTaps++; hbBpm = Math.min(220, 70 + hbTaps * 6 + Math.round(Math.random() * 4));
  hbNum.textContent = `${dig(hbBpm)} ${T('hbLabel')}`;
  if (!reduce) { heartBtn.classList.remove('beat'); void heartBtn.offsetWidth; heartBtn.classList.add('beat'); }
  const r = heartBtn.getBoundingClientRect(); popHearts(r.left + r.width / 2, r.top);
  if (hbTaps >= 12 && !hbCapped) { hbCapped = true; hbMsg.textContent = T('hbCap'); }
};

// ---------- choose one ----------
const chosen = {};
function renderChoices() {
  const box = $('#choices'); if (!box) return;
  box.innerHTML = C.choices.map((c, i) => `<div class="choicePair" data-i="${i}">
    <button class="choiceBtn${chosen[i] === 'a' ? ' chosen' : ''}" data-i="${i}" data-side="a"><span class="ci">${c.aIcon}</span>${L(c.a)}</button>
    <span class="vs">/</span>
    <button class="choiceBtn${chosen[i] === 'b' ? ' chosen' : ''}" data-i="${i}" data-side="b"><span class="ci">${c.bIcon}</span>${L(c.b)}</button>
  </div>`).join('');
  $$('.choiceBtn', box).forEach(b => b.onclick = () => {
    chosen[b.dataset.i] = b.dataset.side; renderChoices();
    const r = b.getBoundingClientRect(); popHearts(r.left + r.width / 2, r.top + r.height / 2);
    if (Object.keys(chosen).length >= C.choices.length) {
      const m = $('#chooseMsg'); m.textContent = T('chooseFinal'); m.classList.add('in');
    }
  });
}

// ---------- final interaction (before Eng Aly credit) ----------
let chosenFinal = false;
$('#fYes').onclick = $('#fAlways').onclick = () => {
  document.body.classList.add('finalGlow'); chosenFinal = true;
  for (let k = 0; k < 3; k++) setTimeout(() => popHearts(innerWidth * (.3 + Math.random() * .4), innerHeight * (.3 + Math.random() * .3)), k * 250);
  $('#nextChapterMsg').textContent = T('nextChapter'); $('#nextChapterMsg').classList.add('in');
};

applyLang();
})();
