/* Aviso de cookies y Consent Mode v2 para clasespadelvalencia.com
   Genera el banner, guarda la decisión y solo carga Google Analytics si se acepta.
   Las cookies publicitarias quedan siempre denegadas: esta web no hace publicidad. */
(function () {
  'use strict';

  var GA_ID = 'G-HT4WB8DKEV';
  var STORAGE_KEY = 'cpv_cookie_consent';
  var lang = (document.documentElement.lang || 'es').toLowerCase();
  var isEN = lang.indexOf('en') === 0;

  var TEXT = isEN ? {
    title: 'Cookies',
    body: 'This website uses Google Analytics to count visits. These are measurement cookies: they do not identify you and are not used for advertising. You can accept or reject them.',
    accept: 'Accept',
    reject: 'Reject',
    more: 'More information',
    href: 'privacy.html',
    aria: 'Cookie notice'
  } : {
    title: 'Cookies',
    body: 'Esta web usa Google Analytics para saber cu\u00e1ntas personas la visitan. Son cookies de medici\u00f3n: no sirven para identificarte ni para mostrarte publicidad. Puedes aceptarlas o rechazarlas.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    more: 'M\u00e1s informaci\u00f3n',
    href: 'privacidad.html',
    aria: 'Aviso de cookies'
  };

  function getStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function store(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function updateConsent(granted) {
    if (typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: granted ? 'granted' : 'denied'
    });
  }

  function loadAnalytics() {
    if (document.querySelector('script[data-cpv-ga]')) {
      return;
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.setAttribute('data-cpv-ga', '1');
    document.head.appendChild(s);
  }

  function apply(granted) {
    updateConsent(granted);
    if (granted) {
      loadAnalytics();
    }
  }

  function styles() {
    if (document.getElementById('cpv-cookie-style')) {
      return;
    }
    var css = '#cpv-cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#0f172a;color:#fff;border-top:3px solid #10b981;box-shadow:0 -8px 24px rgba(0,0,0,.25);padding:18px 16px;font-family:inherit}' +
      '#cpv-cookie-banner .cpv-in{max-width:48rem;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px}' +
      '#cpv-cookie-banner .cpv-tx{flex:1 1 20rem;font-size:14px;line-height:1.5;margin:0}' +
      '#cpv-cookie-banner strong{display:block;font-size:15px;margin-bottom:4px}' +
      '#cpv-cookie-banner a{color:#6ee7b7;text-decoration:underline}' +
      '#cpv-cookie-banner .cpv-bt{display:flex;gap:8px;flex-wrap:wrap}' +
      '#cpv-cookie-banner button{font:inherit;font-size:14px;font-weight:700;padding:10px 18px;border-radius:10px;cursor:pointer;border:1px solid transparent}' +
      '#cpv-cookie-banner .cpv-ok{background:#059669;color:#fff}' +
      '#cpv-cookie-banner .cpv-no{background:transparent;color:#fff;border-color:rgba(255,255,255,.45)}' +
      '#cpv-cookie-banner button:focus-visible{outline:2px solid #6ee7b7;outline-offset:2px}' +
      '@media (max-width:480px){#cpv-cookie-banner .cpv-bt{width:100%}#cpv-cookie-banner button{flex:1 1 auto}}';
    var st = document.createElement('style');
    st.id = 'cpv-cookie-style';
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  }

  function showBanner() {
    if (document.getElementById('cpv-cookie-banner')) {
      return;
    }
    styles();

    var box = document.createElement('div');
    box.id = 'cpv-cookie-banner';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', TEXT.aria);

    var inner = document.createElement('div');
    inner.className = 'cpv-in';

    var tx = document.createElement('p');
    tx.className = 'cpv-tx';
    var strong = document.createElement('strong');
    strong.textContent = TEXT.title;
    tx.appendChild(strong);
    tx.appendChild(document.createTextNode(TEXT.body + ' '));
    var link = document.createElement('a');
    link.href = TEXT.href;
    link.textContent = TEXT.more;
    tx.appendChild(link);

    var bt = document.createElement('div');
    bt.className = 'cpv-bt';

    var ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'cpv-ok';
    ok.textContent = TEXT.accept;
    ok.addEventListener('click', function () {
      store('granted');
      apply(true);
      box.remove();
    });

    var no = document.createElement('button');
    no.type = 'button';
    no.className = 'cpv-no';
    no.textContent = TEXT.reject;
    no.addEventListener('click', function () {
      store('denied');
      apply(false);
      box.remove();
    });

    bt.appendChild(ok);
    bt.appendChild(no);
    inner.appendChild(tx);
    inner.appendChild(bt);
    box.appendChild(inner);
    document.body.appendChild(box);

    ok.focus();
  }

  function init() {
    var stored = getStored();
    if (stored === 'granted') {
      apply(true);
    } else if (stored === 'denied') {
      apply(false);
    } else {
      showBanner();
    }
  }

  window.cpvAbrirCookies = showBanner;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
