import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import PhysicsToday, { pick } from "./PhysicsToday";

// A small slice of Wikipedia's On This Day feed, including the entries that
// slipped through earlier versions of the filter.
const feed = {
  selected: [],
  events: [
    { year: 1930, text: "Clyde Tombaugh discovers Pluto.", pages: [{ description: "Dwarf planet" }] },
    { year: 1976, text: "The first electron micrograph of an Ebola virus is taken.", pages: [] },
    { year: 2011, text: "Michael Woodford was dismissed as the CEO of the optics manufacturer Olympus.", pages: [] },
  ],
  births: [
    { year: 1914, text: "Raymond Davis Jr., American chemist and physicist, Nobel Prize laureate (died 2006)", pages: [] },
    { year: 1821, text: "Rudolf Virchow, German physician, biologist, and politician (died 1902)", pages: [{ description: "German physician" }] },
  ],
  deaths: [{ year: 1984, text: "Martin Ryle, English astronomer and physicist (born 1918)", pages: [] }],
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("physics filter", () => {
  test("keeps physics, puts astrophysics first, and drops look-alikes and deaths", () => {
    const facts = pick(feed);
    expect(facts.map((f) => f.year)).toEqual([1930, 1914]);
  });

  test("never shows the word died", () => {
    const facts = pick(feed);
    expect(facts.find((f) => f.year === 1914).text).toBe(
      "Born: Raymond Davis Jr., American chemist and physicist, Nobel Prize laureate"
    );
    expect(facts.some((f) => /died/i.test(f.text))).toBe(false);
  });
});

test("the arrows step through the facts and wrap around", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => feed });
  render(<PhysicsToday />);

  expect(await screen.findByText("Clyde Tombaugh discovers Pluto.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next fact" }));
  expect(screen.getByText(/Raymond Davis Jr\./)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next fact" }));
  expect(screen.getByText("Clyde Tombaugh discovers Pluto.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Previous fact" }));
  expect(screen.getByText(/Raymond Davis Jr\./)).toBeTruthy();
});
