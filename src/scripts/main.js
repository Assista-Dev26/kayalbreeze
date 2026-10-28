/* Kayal Breeze — shared behaviour */
import { waBase as WA, enquiryEmail } from "../data/site.js";

/* page loaded: hero entrance + shutter */
requestAnimationFrame(() => {
  document.body.classList.add('is-loaded');
  document.querySelectorAll('.shutter[data-now]').forEach((el) => el.classList.add('is-in'));
});

/* header: clear over the hero, solid green once scrolled */
const header = document.querySelector('.site-header');
if (header) {
  const setSolid = () => header.classList.toggle('is-solid', window.scrollY > 40);
  window.addEventListener('scroll', setSolid, { passive: true });
  setSolid();
}

/* mobile menu */
const nav = document.querySelector('.nav');
const openBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.nav-close');
function setMenu(open) {
  if (!nav) return;
  nav.classList.toggle('is-open', open);
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) closeBtn.focus(); else openBtn.focus();
}
openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('is-open')) setMenu(false);
});

/* section entrances */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal], .shutter:not([data-now])').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('[data-reveal], .shutter').forEach((el) => el.classList.add('is-in'));
}

/* day / night */
const dusk = document.querySelector('.dusk__view');
if (dusk) {
  const range = document.getElementById('dusk-range');
  const set = (v) => {
    v = Math.max(0, Math.min(100, v));
    dusk.style.setProperty('--split', v + '%');
    range.value = v;
    range.setAttribute('aria-valuetext', v < 15 ? 'Day' : v > 85 ? 'Night' : 'Day on the left, night on the right');
  };
  range.addEventListener('input', () => set(+range.value));
  let drag = false;
  const fromPointer = (e) => {
    const r = dusk.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  dusk.addEventListener('pointerdown', (e) => { drag = true; dusk.setPointerCapture(e.pointerId); fromPointer(e); });
  dusk.addEventListener('pointermove', (e) => { if (drag) fromPointer(e); });
  dusk.addEventListener('pointerup', () => { drag = false; });
  dusk.addEventListener('pointercancel', () => { drag = false; });
  set(+range.value);
}

/* gallery: filters + lightbox */
const gallery = document.querySelector('.masonry');
if (gallery) {
  const figs = [...gallery.querySelectorAll('figure')];
  const filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach((b) => {
    b.addEventListener('click', () => {
      filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const cat = b.dataset.filter;
      figs.forEach((f) => { f.hidden = cat !== 'all' && f.dataset.cat !== cat; });
    });
  });

  const box = document.querySelector('.lightbox');
  const boxImg = box.querySelector('.lightbox__img img');
  const boxCap = box.querySelector('.lightbox__cap');
  let current = 0;
  const visible = () => figs.filter((f) => !f.hidden);
  const show = (fig) => {
    boxImg.src = fig.querySelector('button').dataset.full;
    boxImg.alt = fig.querySelector('img').alt;
    boxCap.textContent = fig.querySelector('figcaption').textContent;
  };
  figs.forEach((f) => {
    f.querySelector('button').addEventListener('click', () => {
      current = visible().indexOf(f);
      show(f);
      if (box.showModal) box.showModal(); else window.open(f.querySelector('button').dataset.full);
    });
  });
  const step = (d) => {
    const v = visible();
    current = (current + d + v.length) % v.length;
    show(v[current]);
  };
  box.querySelector('[data-prev]').addEventListener('click', () => step(-1));
  box.querySelector('[data-next]').addEventListener('click', () => step(1));
  box.querySelector('[data-close]').addEventListener('click', () => box.close());
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  let sx = null;
  box.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    sx = null;
  });
}

/* enquiry form */
const form = document.getElementById('enquiry-form');
if (form) {
  const wrap = form.closest('.form-wrap');
  const cin = form.elements.checkin;
  const cout = form.elements.checkout;
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = new Date();
  cin.min = iso(today);
  cout.min = iso(new Date(today.getTime() + 864e5));
  cin.addEventListener('change', () => {
    if (!cin.value) return;
    const next = new Date(cin.value + 'T00:00:00');
    next.setDate(next.getDate() + 1);
    cout.min = iso(next);
    if (cout.value && cout.value <= cin.value) cout.value = iso(next);
  });

  const params = new URLSearchParams(location.search);
  const room = params.get('room');
  if (room) {
    const map = { ac: 'AC Room', nonac: 'Non-AC Room', any: 'Any Available Room' };
    if (map[room]) form.elements.room_type.value = map[room];
    if (params.get('stay')) form.elements.notes.value = 'Interested in: ' + params.get('stay');
  }

  const setErr = (el, msg) => {
    const err = document.getElementById(el.id + '-err');
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
  };
  const check = () => {
    let ok = true, first = null;
    const fail = (el, msg) => { setErr(el, msg); ok = false; if (!first) first = el; };
    ['name', 'phone', 'checkin', 'checkout', 'guests', 'rooms', 'room_type'].forEach((n) => setErr(form.elements[n], ''));
    const f = form.elements;
    if (f.name.value.trim().length < 2) fail(f.name, 'Please enter your full name.');
    const digits = f.phone.value.replace(/[^\d]/g, '');
    if (!/^[+\d][\d\s()-]{7,}$/.test(f.phone.value.trim()) || digits.length < 10 || digits.length > 15) fail(f.phone, 'Enter a valid mobile number, e.g. +91 98473 92283.');
    if (!f.checkin.value) fail(f.checkin, 'Choose a check-in date.');
    if (!f.checkout.value) fail(f.checkout, 'Choose a check-out date.');
    else if (f.checkin.value && f.checkout.value <= f.checkin.value) fail(f.checkout, 'Check-out must be after check-in.');
    if (!f.guests.value) fail(f.guests, 'Choose the number of guests.');
    if (!f.rooms.value) fail(f.rooms, 'Choose the number of rooms.');
    if (!f.room_type.value) fail(f.room_type, 'Choose a room type.');
    if (first) first.focus();
    return ok;
  };

  const nice = (v) => new Date(v + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const waText = () => {
    const f = form.elements;
    const nights = Math.round((new Date(f.checkout.value) - new Date(f.checkin.value)) / 864e5);
    const notes = f.notes.value.trim();
    return encodeURIComponent([
      'Hello Kayal Breeze, I would like to enquire about a room.',
      '',
      'Name: ' + f.name.value.trim(),
      'Mobile: ' + f.phone.value.trim(),
      'Room type: ' + f.room_type.value,
      'Check-in: ' + nice(f.checkin.value),
      'Check-out: ' + nice(f.checkout.value) + ' (' + nights + ' night' + (nights === 1 ? '' : 's') + ')',
      'Guests: ' + f.guests.value,
      'Rooms: ' + f.rooms.value,
      ...(notes ? ['Notes: ' + notes] : []),
    ].join('\n'));
  };

  /* Send enquiry opens WhatsApp with the enquiry written out; the guest presses send there */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!check()) return;
    const url = WA + '?text=' + waText();
    const done = document.getElementById('sent');
    done.querySelector('[data-wa]').href = url;
    // WhatsApp must open inside the click, before any waiting, or the browser blocks it
    window.open(url, '_blank', 'noopener');
    wrap.classList.add('is-sent');
    done.classList.add('is-shown');
    done.querySelector('h2').focus();
    sendEmail();
  });

  /* the same enquiry, emailed through formsubmit.co */
  const mailStatus = document.getElementById('mail-status');
  const setMail = (msg, error = false) => {
    mailStatus.textContent = msg;
    mailStatus.classList.toggle('is-error', error);
  };
  const sendEmail = () => {
    const f = form.elements;
    const digits = f.phone.value.replace(/\D/g, '');
    const nights = Math.round((new Date(f.checkout.value) - new Date(f.checkin.value)) / 864e5);
    setMail('Sending the email…');
    fetch('https://formsubmit.co/ajax/' + enquiryEmail, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: 'Room enquiry: ' + f.name.value.trim() + ', ' + nice(f.checkin.value) + ' to ' + nice(f.checkout.value),
        _template: 'table',
        _captcha: 'false',
        Name: f.name.value.trim(),
        Mobile: f.phone.value.trim(),
        'Room type': f.room_type.value,
        'Check-in': nice(f.checkin.value),
        'Check-out': nice(f.checkout.value),
        Nights: String(nights),
        Guests: f.guests.value,
        Rooms: f.rooms.value,
        Notes: f.notes.value.trim() || '-',
        'Reply on WhatsApp': 'https://wa.me/' + (digits.length === 10 ? '91' + digits : digits),
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (String(res.success) === 'true') setMail('Email sent.');
        else setMail('The email was not sent: ' + (res.message || 'unknown error') + ' Your WhatsApp message still reaches us.', true);
      })
      .catch(() => setMail('The email could not be sent (no connection). Your WhatsApp message still reaches us.', true));
  };

  /* back to the form to change something */
  document.getElementById('edit-enquiry')?.addEventListener('click', () => {
    wrap.classList.remove('is-sent');
    document.getElementById('sent').classList.remove('is-shown');
    form.elements.name.focus();
  });
}
