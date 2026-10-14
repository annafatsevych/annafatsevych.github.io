// ‹ › buttons that step through a list and wrap around at either end.
export default function Arrows({ count, setIndex, label }) {
  if (count < 2) return null;
  const step = (by) => setIndex((i) => (i + by + count) % count);
  return (
    <span className="pt-arrows">
      <button className="pt-arrow" type="button" aria-label={`Previous ${label}`} onClick={() => step(-1)}>
        ‹
      </button>
      <button className="pt-arrow" type="button" aria-label={`Next ${label}`} onClick={() => step(1)}>
        ›
      </button>
    </span>
  );
}
