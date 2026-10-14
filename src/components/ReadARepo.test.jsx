import { expect, test } from "vitest";
import { pick } from "./ReadARepo";

const repo = (full_name, description, extra = {}) => ({
  full_name,
  description,
  html_url: `https://github.com/${full_name}`,
  fork: false,
  ...extra,
});

test("repo filter skips adult, hacking, forked and undescribed repos, and keeps five at most", () => {
  const items = [
    repo("someone/nsfw-pose-skill", "NSFW image skill"),
    repo("someone/artex", "AI pentest system"),
    repo("someone/copy", "A fork", { fork: true }),
    repo("someone/empty", null),
    ...["a", "b", "c", "d", "e", "f"].map((n) => repo(`good/${n}`, `Claude tool ${n}`)),
  ];

  expect(pick({ items }).map((r) => r.name)).toEqual(["good/a", "good/b", "good/c", "good/d", "good/e"]);
});
