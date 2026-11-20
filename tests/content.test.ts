import assert from "node:assert/strict";
import test from "node:test";
import { tools } from "../lib/tools";
import { getToolArticle } from "../lib/tool-content";
import { categoryGuides } from "../lib/category-guides";

test("every listed tool has distinct, complete search and help content", () => {
  const introductions = new Set<string>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const tool of tools) {
    const article = getToolArticle(tool);
    assert.ok(article.seoTitle.length > 20, `${tool.slug} needs a descriptive title`);
    assert.ok(!titles.has(article.seoTitle), `${tool.slug} repeats a title`);
    titles.add(article.seoTitle);
    assert.ok(article.seoDescription.length > 50, `${tool.slug} needs a useful search description`);
    assert.ok(article.introduction.length > 60, `${tool.slug} needs a unique introduction`);
    assert.ok(article.whatItDoes.length > 30, `${tool.slug} needs a purpose explanation`);
    assert.ok(article.instructions.length >= 2, `${tool.slug} needs usage instructions`);
    assert.ok(article.example.title.length > 0 && article.example.details.length > 20, `${tool.slug} needs a practical example`);
    assert.ok(article.resultExplanation.length > 30, `${tool.slug} needs result context`);
    assert.ok(article.faqs.length >= 2, `${tool.slug} needs useful FAQs`);
    assert.ok(article.related.length >= 1, `${tool.slug} needs related tools`);
    for (const relatedSlug of article.related) assert.ok(tools.some((candidate) => candidate.slug === relatedSlug), `${tool.slug} links to missing tool ${relatedSlug}`);
    assert.equal(introductions.has(article.introduction), false, `${tool.slug} repeats an introduction`);
    assert.equal(descriptions.has(article.seoDescription), false, `${tool.slug} repeats an SEO description`);
    introductions.add(article.introduction);
    descriptions.add(article.seoDescription);
  }
});

test("every tool has a lesson on its own category page and every lesson links back to live tools", () => {
  for (const tool of tools) {
    assert.ok(categoryGuides[tool.category].some(lesson => lesson.tools.some(link => link.slug === tool.slug)), tool.slug);
  }
  for (const [category, lessons] of Object.entries(categoryGuides)) {
    assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
    for (const lesson of lessons) {
      for (const link of lesson.tools) {
        assert.ok(tools.some(tool => tool.slug === link.slug && tool.category === category), link.slug);
      }
    }
  }
});

test("Phase 11 tool content accurately describes the new date, age, GST, EMI and volume tasks", () => {
  const getArticle = (slug: string) => {
    const tool = tools.find(candidate => candidate.slug === slug);
    assert.ok(tool, `missing tool ${slug}`);
    return getToolArticle(tool);
  };

  const age = getArticle("age-calculator");
  assert.match(age.seoTitle, /Specific Date/u);
  assert.match(age.introduction, /cutoff date/u);
  assert.ok(age.faqs.some(faq => /specific date/u.test(faq.question)));
  assert.match(age.whatItDoes, /February 28/u);

  const date = getArticle("date-calculator");
  assert.match(date.seoTitle, /Inclusive Days/u);
  assert.match(date.example.details, /9 elapsed days.*10 days/u);
  assert.ok(date.faqs.some(faq => /elapsed and inclusive/u.test(faq.question)));

  const gst = getArticle("gst-calculator");
  assert.match(gst.whatItDoes, /inclusive amount × 100 ÷ \(100 \+ GST rate\)/u);
  assert.match(gst.example.details, /₹590.*₹500.*₹90/u);
  assert.match(gst.instructions[1], /rate that applies/u);

  const emi = getArticle("emi-calculator");
  assert.match(emi.seoDescription, /three loan tenures/u);
  assert.match(emi.instructions[1], /two different comparison tenures/u);
  assert.ok(emi.faqs.some(faq => /compare loan tenures/u.test(faq.question)));

  const unitConverter = getArticle("unit-converter");
  assert.match(unitConverter.seoDescription, /imperial gallons/u);
  assert.match(unitConverter.example.details, /4\.54609 litres/u);
  assert.match(unitConverter.faqs.find(faq => /gallon/u.test(faq.question))?.answer ?? "", /3\.785411784 litres.*4\.54609 litres/u);
});
