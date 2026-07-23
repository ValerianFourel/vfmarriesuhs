/* ============================================================
   Lightweight i18n
   - Copy lives in /i18n/{en,fr,de}.json (single source of truth)
   - Elements opt in with data-i18n="dot.path" (sets text)
     or data-i18n-alt / -title / -aria-label / -content (sets attribute)
   - {token} placeholders are filled from the "couple" block of
     the active locale file, so names/dates/codes are edited once
   - First visit lands on French; an explicit choice from the
     switcher is persisted in localStorage
   ============================================================ */

(function () {
  'use strict';

  var SUPPORTED = ['en', 'fr', 'de', 'ko'];
  var DEFAULT_LANG = 'fr';
  var STORAGE_KEY = 'wedding.lang';

  var strings = null;

  /* ---------- helpers ---------- */

  function readStoredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(stored) !== -1 ? stored : null;
    } catch (err) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* private mode etc. — persistence is a nice-to-have */
    }
  }

  function detectLanguage() {
    // French is the landing language; a language the visitor
    // explicitly chose earlier wins.
    var stored = readStoredLang();
    return stored || DEFAULT_LANG;
  }

  function lookup(key) {
    var value = strings;
    var parts = key.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (value == null) return undefined;
      value = value[parts[i]];
    }
    return typeof value === 'string' ? value : undefined;
  }

  /* Fill {bride}, {groupCode}, … from the locale's "couple" block */
  function format(text) {
    return text.replace(/\{(\w+)\}/g, function (match, token) {
      var couple = strings && strings.couple;
      return couple && typeof couple[token] === 'string' ? couple[token] : match;
    });
  }

  function translate(key) {
    var text = lookup(key);
    if (text === undefined) {
      console.warn('[i18n] missing key: ' + key);
      return null;
    }
    return format(text);
  }

  /* ---------- DOM application ---------- */

  var ATTR_MAP = [
    ['data-i18n-alt', 'alt'],
    ['data-i18n-title', 'title'],
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-content', 'content']
  ];

  function applyTranslations(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var text = translate(el.getAttribute('data-i18n'));
      if (text !== null) el.textContent = text;
    });

    ATTR_MAP.forEach(function (pair) {
      document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
        var text = translate(el.getAttribute(pair[0]));
        if (text !== null) el.setAttribute(pair[1], text);
      });
    });

    var title = translate('meta.title');
    if (title !== null) document.title = title;

    document.querySelectorAll('.lang-switcher button[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
  }

  /* ---------- loading ---------- */

  function setLanguage(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    fetch('i18n/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        strings = json;
        if (persist) storeLang(lang);
        applyTranslations(lang);
      })
      .catch(function (err) {
        /* Typically: opened via file:// — serve over HTTP (see README).
           The English fallback already present in the HTML stays visible. */
        console.warn('[i18n] could not load "' + lang + '" translations:', err);
      });
  }

  /* ---------- wire up ---------- */

  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang'), true);
    });
  });

  setLanguage(detectLanguage(), false);
})();
