// "Read a Repo": asks GitHub's free search API for this week's most-starred new
// repos about Claude, skips adult, hacking-tool and spam projects, and links to
// the best one.
(function () {
  var card = document.getElementById('read-a-repo');
  if (!card) return;

  var TOPIC = 'claude';
  var EXCLUDE = /pentest|penetration|渗透|exploit|hack|crack|cheat|bypass|stealer|keylogger|botnet|ddos|phish|malware|jailbreak|nsfw|porn|nude|lora|disguise|spoof|casino|airdrop/i;

  var weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  var cacheKey = 'read-a-repo-v2-' + new Date().toISOString().slice(0, 10);

  var repos = [];
  var index = 0;

  function show() {
    var r = repos[index];
    var link = card.querySelector('.rr-name');
    link.textContent = r.name;
    link.href = r.url;
    link.title = r.description;
    card.querySelector('.rr-arrows').hidden = repos.length < 2;
  }

  function render(list) {
    if (!list.length) return; // nothing suitable this week: the card stays hidden
    repos = list;
    card.querySelector('.rr-prev').addEventListener('click', function () {
      index = (index - 1 + repos.length) % repos.length;
      show();
    });
    card.querySelector('.rr-next').addEventListener('click', function () {
      index = (index + 1) % repos.length;
      show();
    });
    show();
    card.hidden = false;
  }

  function pick(result) {
    return (result.items || [])
      .filter(function (r) {
        return r.description && !r.fork && !EXCLUDE.test(r.full_name + ' ' + r.description);
      })
      .slice(0, 5)
      .map(function (r) {
        return {
          name: r.full_name,
          url: r.html_url,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count
        };
      });
  }

  try {
    var cached = localStorage.getItem(cacheKey);
    if (cached) return render(JSON.parse(cached));
  } catch (e) { /* storage unavailable: just fetch */ }

  var query = TOPIC + ' created:>' + weekAgo;
  fetch('https://api.github.com/search/repositories?sort=stars&order=desc&per_page=20&q=' + encodeURIComponent(query))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (result) {
      var list = pick(result);
      try { localStorage.setItem(cacheKey, JSON.stringify(list)); } catch (e) {}
      render(list);
    })
    .catch(function () { /* GitHub unreachable or rate-limited: the card stays hidden */ });
})();
