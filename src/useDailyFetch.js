import { useEffect, useState } from "react";

// Fetches `url` at most once per visitor per `cacheKey` (include the date in the
// key), turns the response into a list with `pick`, and remembers it in the
// browser. Returns [] until loaded, and also if the service can't be reached.
export default function useDailyFetch(url, cacheKey, pick) {
  // Starts empty on every load (matching the pre-rendered HTML), then fills in.
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (items) return;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return setItems(JSON.parse(cached));
    } catch {
      // storage unavailable: just fetch
    }
    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((data) => {
        const list = pick(data);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(list));
        } catch {}
        if (!cancelled) setItems(list);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [url, cacheKey, pick, items]);

  return items || [];
}
