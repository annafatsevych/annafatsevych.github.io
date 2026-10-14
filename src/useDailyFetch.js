import { useEffect, useState } from "react";

// Fetches `url` at most once per visitor per `cacheKey` (include the date in the
// key), turns the response into a list with `pick`, and remembers it in the
// browser. Returns [] until loaded, and also if the service can't be reached.
export default function useDailyFetch(url, cacheKey, pick) {
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null; // storage unavailable: just fetch
    }
  });

  useEffect(() => {
    if (items) return;
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
