import { useState } from "react";
import useDailyFetch from "../useDailyFetch";
import Arrows from "./Arrows";

// "On this day in physics": Wikipedia's free On This Day feed for today's date,
// filtered down to physics, astrophysics first.

// An entry counts as physics if its text, or the description of a page it
// links to, matches INCLUDE and does not match EXCLUDE.
const ASTRO = /astrophysic|astronom|cosmolog|galax|nebula|supernova|comet|asteroid|exoplanet|planet|pulsar|quasar|black hole|telescope|solar system/i;
const INCLUDE = /\bphysics\b|\bphysicists?\b|galax|nebula|supernova|comet|asteroid|planet|pulsar|quasar|black hole|telescope|solar system|quantum|relativity|astronom|cosmolog|particle|electromagnet|thermodynamic|optics|neutron|proton|photon|radioactiv|superconduct|nobel prize in physics/i;
const EXCLUDE = /whistleblower|scripture|mytholog|astrolog|manufacturer|company|\bCEO\b|microscop|micrograph|virus|weapon|bomb|nuclear test|power plant|power station|disaster|terror|missile|meltdown/i;

const LABEL = { births: "Born: ", events: "", selected: "" };

const describe = (entry) => (entry.pages || []).map((p) => p.description || "").join(" ");

// Astrophysics first, then the rest of physics. Within each, events and
// discoveries come before people, and people described as physicists rank higher.
function score(text, kind) {
  let s = ASTRO.test(text) ? 10 : 0;
  if (kind === "events" || kind === "selected") s += 3;
  if (/physicist|physics/i.test(text)) s += 2;
  if (/nobel/i.test(text)) s += 1;
  return s;
}

export function pick(feed) {
  const seenText = new Set();
  const seenYear = new Set();
  const found = [];
  for (const kind of ["selected", "events", "births"]) {
    for (const entry of feed[kind] || []) {
      // Birth entries end with "(died 2006)"; drop that, then skip anything still about a death.
      const clean = entry.text
        .replace(/ \((pictured|shown)[^)]*\)/gi, "")
        .replace(/ \((died|d\.) [^)]*\)/gi, "");
      const text = clean + " " + describe(entry);
      if (!INCLUDE.test(text) || EXCLUDE.test(text) || /\bdied\b|\bdeath\b/i.test(clean)) continue;
      if (seenText.has(entry.text)) continue;
      // Featured and regular events often repeat the same moment; keep one per year.
      if (kind !== "births" && seenYear.has(entry.year)) continue;
      seenText.add(entry.text);
      if (kind !== "births") seenYear.add(entry.year);
      const page = (entry.pages || [])[0];
      found.push({
        year: entry.year,
        text: LABEL[kind] + clean,
        url: page?.content_urls?.desktop.page ?? null,
        score: score(text, kind),
      });
    }
  }
  return found.sort((a, b) => b.score - a.score);
}

const now = new Date();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

export default function PhysicsToday() {
  const facts = useDailyFetch(
    `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`,
    `physics-today-v7-${mm}${dd}`,
    pick
  );
  const [index, setIndex] = useState(0);
  if (!facts.length) return null; // still loading, nothing physics-related today, or Wikipedia unreachable

  const fact = facts[index];
  return (
    <section aria-label="On this day in physics" className="physics" aria-live="polite">
      <p className="pt-head">
        On this day in physics · {now.toLocaleDateString(undefined, { month: "long", day: "numeric" })}
      </p>
      <p className="pt-fact" title={`${fact.year} ${fact.text}`}>
        <span className="pt-year">{fact.year}</span> {fact.text}
      </p>
      <div className="pt-foot">
        {fact.url && (
          <a href={fact.url} target="_blank" rel="noopener">
            Read on Wikipedia<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {facts.length > 1 && <span className="pt-count">{index + 1} of {facts.length}</span>}
        <Arrows count={facts.length} setIndex={setIndex} label="fact" />
      </div>
    </section>
  );
}
