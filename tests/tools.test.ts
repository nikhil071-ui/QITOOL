import assert from "node:assert/strict";
import test from "node:test";
import { filterTools, tools } from "../lib/tools";

test("the unfiltered catalog contains the 15 planned tools", () => {
  assert.equal(filterTools("").length, 15);
  assert.equal(tools.length, 15);
});

test("search is trimmed and case insensitive", () => {
  assert.deepEqual(filterTools("  pErCeNtAgE  ").map(({ slug }) => slug), ["percentage-calculator"]);
});

test("search includes useful descriptions, not only tool names", () => {
  assert.deepEqual(filterTools("reading time").map(({ slug }) => slug), ["word-counter"]);
  assert.ok(filterTools("tenure").some(tool => tool.slug === "emi-calculator"));
});

test("category filters return only matching tools", () => {
  const calculators = filterTools("", "calculators");
  assert.equal(calculators.length, 8);
  assert.ok(calculators.every(({ category }) => category === "calculators"));

  assert.deepEqual(filterTools("", "productivity").map(({ slug }) => slug), [
    "password-generator",
    "typing-speed-test",
  ]);
});

test("search and category filters combine", () => {
  assert.deepEqual(filterTools("calculator", "calculators").map(({ slug }) => slug), [
    "age-calculator",
    "percentage-calculator",
    "bmi-calculator",
    "emi-calculator",
    "gst-calculator",
    "date-calculator",
    "discount-calculator",
    "loan-calculator",
  ]);
  assert.deepEqual(filterTools("calculator", "images"), []);
});
