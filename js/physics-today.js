// "On this day in physics": asks Wikipedia's free On This Day feed for today's
// date, keeps the physics-related entries, and shows the best one first.
(function () {
  var card = document.getElementById('physics-today');
  if (!card) return;

  // An entry counts as physics if its text, or the description of a page it
  // links to, matches INCLUDE and does not match EXCLUDE.
  var ASTRO = /astrophysic|astronom|cosmolog|galax|nebula|supernova|comet|asteroid|exoplanet|planet|pulsar|quasar|black hole|telescope|solar system/i;
  var INCLUDE = /\bphysics\b|\bphysicists?\b|galax|nebula|supernova|comet|asteroid|planet|pulsar|quasar|black hole|telescope|solar system|quantum|relativity|astronom|cosmolog|particle|electromagnet|thermodynamic|optics|neutron|proton|photon|radioactiv|superconduct|nobel prize in physics/i;
  var EXCLUDE = /whistleblower|scripture|mytholog|astrolog|manufacturer|company|\bCEO\b|microscop|micrograph|virus|weapon|bomb|nuclear test|power plant|power station|disaster|terror|missile|meltdown/i;

  var now = new Date();
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var dd = String(now.getDate()).padStart(2, '0');
  var cacheKey = 'physics-today-v6-' + mm + dd;

  function describe(entry) {
    return (entry.pages || []).map(function (p) { return p.description || ''; }).join(' ');
  }

  // Astrophysics first, then the rest of physics. Within each, events and
  // discoveries come before people, and people described as physicists rank higher.
  function score(entry, kind) {
    var text = entry.text + ' ' + describe(entry);
    var s = ASTRO.test(text) ? 10 : 0;
    if (kind === 'events' || kind === 'selected') s += 3;
    if (/physicist|physics/i.test(text)) s += 2;
    if (/nobel/i.test(text)) s += 1;
    return s;
  }

  function pick(feed) {
    var seen = {};
    var found = [];
    ['selected', 'events', 'births'].forEach(function (kind) {
      (feed[kind] || []).forEach(function (entry) {
        // Birth entries end with "(died 2006)"; drop that, then skip anything still about a death.
        var clean = entry.text.replace(/ \((pictured|shown)[^)]*\)/gi, '').replace(/ \((died|d\.) [^)]*\)/gi, '');
        var text = clean + ' ' + describe(entry);
        if (!INCLUDE.test(text) || EXCLUDE.test(text) || /\bdied\b|\bdeath\b/i.test(clean) || seen[entry.text]) return;
        // Featured and regular events often repeat the same moment; keep one per year.
        if (kind !== 'births' && seen['year' + entry.year]) return;
        seen[entry.text] = true;
        if (kind !== 'births') seen['year' + entry.year] = true;
        var page = (entry.pages || [])[0];
        found.push({
          year: entry.year,
          kind: kind,
          text: clean,
          url: page && page.content_urls ? page.content_urls.desktop.page : null,
          score: score(entry, kind)
        });
      });
    });
    return found.sort(function (a, b) { return b.score - a.score; });
  }

  var LABEL = { births: 'Born', events: '', selected: '' };
  var facts = [];
  var index = 0;

  function show() {
    var f = facts[index];
    var label = LABEL[f.kind] ? LABEL[f.kind] + ': ' : '';
    card.querySelector('.pt-year').textContent = f.year;
    card.querySelector('.pt-text').textContent = label + f.text;
    card.querySelector('.pt-fact').title = f.year + ' ' + label + f.text;
    var link = card.querySelector('.pt-link');
    link.hidden = !f.url;
    if (f.url) link.href = f.url;
    card.querySelector('.pt-arrows').hidden = facts.length < 2;
    card.querySelector('.pt-count').textContent = facts.length > 1 ? (index + 1) + ' of ' + facts.length : '';
  }

  function render(list) {
    if (!list.length) return; // nothing physics-related today: the card stays hidden
    facts = list;
    card.querySelector('.pt-date').textContent =
      now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    card.querySelector('.pt-prev').addEventListener('click', function () {
      index = (index - 1 + facts.length) % facts.length;
      show();
    });
    card.querySelector('.pt-next').addEventListener('click', function () {
      index = (index + 1) % facts.length;
      show();
    });
    show();
    card.hidden = false;
  }

  try {
    var cached = localStorage.getItem(cacheKey);
    if (cached) return render(JSON.parse(cached));
  } catch (e) { /* storage unavailable: just fetch */ }

  fetch('https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/' + mm + '/' + dd)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (feed) {
      var list = pick(feed);
      try { localStorage.setItem(cacheKey, JSON.stringify(list)); } catch (e) {}
      render(list);
    })
    .catch(function () { /* Wikipedia unreachable: the card stays hidden */ });
})();
