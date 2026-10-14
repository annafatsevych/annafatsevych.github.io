import { useState } from "react";
import useDailyFetch from "../useDailyFetch";
import Arrows from "./Arrows";

// "Read a Repo": GitHub's free search API for this week's most-starred new repos
// about Claude, skipping adult, hacking-tool and spam projects.

const TOPIC = "claude";
const EXCLUDE = /pentest|penetration|渗透|exploit|hack|crack|cheat|bypass|stealer|keylogger|botnet|ddos|phish|malware|jailbreak|nsfw|porn|nude|lora|disguise|spoof|casino|airdrop/i;

function pick(result) {
  return (result.items || [])
    .filter((r) => r.description && !r.fork && !EXCLUDE.test(r.full_name + " " + r.description))
    .slice(0, 5)
    .map((r) => ({ name: r.full_name, url: r.html_url, description: r.description }));
}

const today = new Date().toISOString().slice(0, 10);
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function ReadARepo() {
  const repos = useDailyFetch(
    "https://api.github.com/search/repositories?sort=stars&order=desc&per_page=20&q=" +
      encodeURIComponent(`${TOPIC} created:>${weekAgo}`),
    `read-a-repo-v3-${today}`,
    pick
  );
  const [index, setIndex] = useState(0);
  if (!repos.length) return null; // still loading, nothing suitable, or GitHub unreachable/rate-limited

  const repo = repos[index];
  return (
    <aside className="physics repo" aria-live="polite">
      <p className="pt-head">Read a Repo</p>
      <div className="pt-foot">
        <a className="rr-name" href={repo.url} title={`${repo.name}: ${repo.description}`} target="_blank" rel="noopener">
          {repo.name}
        </a>
        <Arrows count={repos.length} setIndex={setIndex} label="repo" />
      </div>
    </aside>
  );
}
