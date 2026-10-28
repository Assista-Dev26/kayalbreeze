/* Kayal Breeze — shared behaviour */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* page loaded: hero entrance + shutter */
  window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
      document.querySelectorAll('.shutter[data-now]').forEach(function (el) { el.classList.add('is-in'); });
    });
  });

  /* mobile menu */
  var nav = document.querySelector('.nav');
  var openBtn = document.querySelector('.menu-btn');
  var closeBtn = document.querySelector('.nav-close');
  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus(); else openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) setMenu(false);
  });

  /* section entrances */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('[data-reveal], .shutter:not([data-now])').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal], .shutter').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* showcase: one frame, three distances */
  var showcase = document.querySelector('.showcase');
  if (showcase && !reduce) {
    var setStage = function () {
      var r = showcase.getBoundingClientRect();
      var p = -r.top / (r.height - window.innerHeight);
      showcase.dataset.stage = p < 0.3 ? '1' : p < 0.64 ? '2' : '3';
    };
    window.addEventListener('scroll', setStage, { passive: true });
    setStage();
  }

  /* rising triptych */
  var trip = document.querySelector('.triptych');
  if (trip && !reduce) {
    var row = trip.querySelector('.triptych__row');
    var head = trip.querySelector('.triptych__head');
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = trip.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / span));
      var vh = window.innerHeight;
      var target = head.offsetTop + head.offsetHeight + 40; /* never over the heading */
      var start = -0.5 * vh;
      var end = -(vh - target);
      row.style.setProperty('--rise', (start + (end - start) * p) + 'px');
      row.style.setProperty('--grow', String(1 + 0.14 * p));
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* day / night */
  var dusk = document.querySelector('.dusk__view');
  if (dusk) {
    var range = document.getElementById('dusk-range');
    var set = function (v) {
      v = Math.max(0, Math.min(100, v));
      dusk.style.setProperty('--split', v + '%');
      range.value = v;
      range.setAttribute('aria-valuetext', v < 15 ? 'Day' : v > 85 ? 'Night' : 'Day on the left, night on the right');
    };
    range.addEventListener('input', function () { set(+range.value); });
    var drag = false;
    var fromPointer = function (e) {
      var r = dusk.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    dusk.addEventListener('pointerdown', function (e) { drag = true; dusk.setPointerCapture(e.pointerId); fromPointer(e); });
    dusk.addEventListener('pointermove', function (e) { if (drag) fromPointer(e); });
    dusk.addEventListener('pointerup', function () { drag = false; });
    dusk.addEventListener('pointercancel', function () { drag = false; });
    set(+range.value);
  }

  /* gallery: filters + lightbox */
  var gallery = document.querySelector('.masonry');
  if (gallery) {
    var figs = Array.prototype.slice.call(gallery.querySelectorAll('figure'));
    var filterBtns = document.querySelectorAll('.filters button');
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var cat = b.dataset.filter;
        figs.forEach(function (f) { f.hidden = cat !== 'all' && f.dataset.cat !== cat; });
      });
    });

    var box = document.querySelector('.lightbox');
    var boxImg = box.querySelector('.lightbox__img img');
    var boxCap = box.querySelector('.lightbox__cap');
    var current = 0;
    var visible = function () { return figs.filter(function (f) { return !f.hidden; }); };
    var show = function (fig) {
      var btn = fig.querySelector('button');
      boxImg.src = btn.dataset.full;
      boxImg.alt = fig.querySelector('img').alt;
      boxCap.textContent = fig.querySelector('figcaption').textContent;
    };
    figs.forEach(function (f) {
      f.querySelector('button').addEventListener('click', function () {
        current = visible().indexOf(f);
        show(f);
        if (box.showModal) box.showModal(); else window.open(f.querySelector('button').dataset.full);
      });
    });
    var step = function (d) {
      var v = visible();
      current = (current + d + v.length) % v.length;
      show(v[current]);
    };
    box.querySelector('[data-prev]').addEventListener('click', function () { step(-1); });
    box.querySelector('[data-next]').addEventListener('click', function () { step(1); });
    box.querySelector('[data-close]').addEventListener('click', function () { box.close(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    var sx = null;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      sx = null;
    });
  }

  /* enquiry form */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var wrap = form.closest('.form-wrap');
    var status = form.querySelector('.form__status');
    var cin = form.elements.checkin;
    var cout = form.elements.checkout;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var today = new Date();
    var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    cin.min = iso(today);
    cout.min = iso(new Date(today.getTime() + 864e5));
    cin.addEventListener('change', function () {
      if (!cin.value) return;
      var next = new Date(cin.value + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      cout.min = iso(next);
      if (cout.value && cout.value <= cin.value) cout.value = iso(next);
    });

    var params = new URLSearchParams(location.search);
    var room = params.get('room');
    if (room) {
      var map = { ac: 'AC Room', nonac: 'Non-AC Room', any: 'Any Available Room' };
      if (map[room]) form.elements.room_type.value = map[room];
      if (params.get('stay')) form.elements.notes.value = 'Interested in: ' + params.get('stay');
    }
    form.elements.started.value = String(Date.now());

    var setErr = function (el, msg) {
      var err = document.getElementById(el.id + '-err');
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg || '';
    };
    var check = function () {
      var ok = true, first = null;
      var fail = function (el, msg) { setErr(el, msg); ok = false; if (!first) first = el; };
      ['name', 'phone', 'checkin', 'checkout', 'guests', 'rooms', 'room_type'].forEach(function (n) { setErr(form.elements[n], ''); });
      var f = form.elements;
      if (f.name.value.trim().length < 2) fail(f.name, 'Please enter your full name.');
      var digits = f.phone.value.replace(/[^\d]/g, '');
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

    var waText = function () {
      var f = form.elements;
      return 'Hello Kayal Breeze, I sent a room enquiry.%0A' + encodeURIComponent(
        'Name: ' + f.name.value.trim() + '\nCheck-in: ' + f.checkin.value + '\nCheck-out: ' + f.checkout.value +
        '\nGuests: ' + f.guests.value + '\nRooms: ' + f.rooms.value + '\nRoom type: ' + f.room_type.value);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!check()) return;
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      status.textContent = 'Sending your enquiry…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res.ok) {
            var done = document.getElementById('sent');
            done.querySelector('[data-wa]').href = 'https://wa.me/919847392283?text=' + waText();
            wrap.classList.add('is-sent');
            done.classList.add('is-shown');
            done.querySelector('h2').focus();
          } else {
            if (res.errors) Object.keys(res.errors).forEach(function (k) { if (form.elements[k]) setErr(form.elements[k], res.errors[k]); });
            status.textContent = res.message || 'Something went wrong. Please try again, or message us on WhatsApp.';
          }
        })
        .catch(function () { status.textContent = 'Could not send. Check your connection, or message us on WhatsApp.'; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
