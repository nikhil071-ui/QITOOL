import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { tools } from "../lib/tools";
import { getToolArticle, toolArticles } from "../lib/tool-content";
import { typingPassageIndexForStart, typingPassages } from "../lib/typing-test";
import { categoryGuides } from "../lib/category-guides";
import { calculateGSTBreakdown, calculateLoanTenureComparison, calculateTypingMetrics, countParagraphs, countText, formatAmount } from "../lib/calculations";

test("the reverse GST example matches Remove GST for an inclusive invoice", () => {
  const { example, whatItDoes } = toolArticles["gst-calculator"];
  assert.match(example.jumpLabel ?? "", /Remove GST.*reverse GST calculation/i);
  assert.match(whatItDoes, /divide the inclusive price by \(1 \+ GST rate \/ 100\)/);
  const { totalAmount, rate, baseAmount, gstAmount } = calculateGSTBreakdown(590, 18, "remove", "single");
  assert.ok(example.details.includes(`₹${totalAmount} already includes ${rate}% GST`));
  assert.ok(example.details.includes(`₹${totalAmount} ÷ 1.18 = ₹${baseAmount}`));
  assert.ok(example.details.includes(`₹${gstAmount} is GST`));
});

test("the discount GST FAQ links to the registered GST calculator", () => {
  const link = toolArticles["discount-calculator"].faqs.find(item => item.question === "Does the result include GST?")?.link;
  assert.ok(link);
  assert.equal(link.label, "calculate GST on the discounted price");
  assert.equal(link.href, "/tools/gst-calculator");
  assert.ok(tools.some(tool => `/tools/${tool.slug}` === link.href));
});

test("the discount result displays and copies the same rounded price presentation", () => {
  const source = readFileSync("components/tools/calculator-tools.tsx", "utf8");
  const component = source.split("export function DiscountCalculator() {")[1]?.split("\n}")[0] ?? "";
  assert.match(component, /formatDiscountResult\(calc\.result\)/u);
  assert.match(component, /ResultPanel copyText=\{presentation\.copyText\}/u);
  assert.match(component, /presentation\.originalPriceText/u);
  assert.match(component, /presentation\.savingsText/u);
  assert.match(component, /presentation\.finalPriceText/u);
});

test("the EMI worked example matches the calculator to the paise for all three tenures", () => {
  const emi = tools.find(tool => tool.slug === "emi-calculator");
  assert.ok(emi);
  const { details, loanComparison } = getToolArticle(emi).example;
  assert.ok(loanComparison);
  assert.match(details, /principal stays fixed at ₹5,00,000/u);
  assert.match(details, /nominal annual rate stays fixed at 9%/u);
  const { principal, annualRatePercent, tenures } = loanComparison;
  const loans = calculateLoanTenureComparison(principal, annualRatePercent, tenures);
  assert.deepEqual(loans.map(loan => [
    loan.inputs.months, formatAmount(loan.monthlyPayment), formatAmount(loan.totalInterest), formatAmount(loan.totalPayment),
  ]), [
    [36, "₹15,899.87", "₹72,395.17", "₹5,72,395.17"],
    [60, "₹10,379.18", "₹1,22,750.66", "₹6,22,750.66"],
    [84, "₹8,044.54", "₹1,75,741.27", "₹6,75,741.27"],
  ]);
});

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
  assert.match(gst.instructions[1], /rate that applies/u);

  const emi = getArticle("emi-calculator");
  assert.match(emi.seoDescription, /three loan tenures/u);
  assert.match(emi.instructions[1], /two different comparison tenures/u);
  assert.ok(emi.faqs.some(faq => /compare loan tenures/u.test(faq.question)));

  const unitConverter = getArticle("unit-converter");
  assert.match(unitConverter.seoDescription, /imperial gallons/u);
  assert.match(unitConverter.example.details, /4\.54609 litres/u);
  assert.match(unitConverter.example.details, /3\.785411784 litres/u);
  assert.match(unitConverter.resultExplanation, /eight significant digits.*displayed result may be rounded/u);
  const gallonCopy = [unitConverter.example.details, unitConverter.resultExplanation, ...unitConverter.faqs.map(faq => faq.answer)].join(" ");
  assert.equal(gallonCopy.match(/3\.785411784/gu)?.length, 1);
  assert.equal(gallonCopy.match(/4\.54609/gu)?.length, 1);
  assert.match(unitConverter.faqs.find(faq => /gallon/u.test(faq.question))?.answer ?? "", /Select the system stated on the source label/u);
});

test("Word Counter example output matches its sample text and displayed counters", () => {
  const article = toolArticles["word-counter"];
  const match = article.example.details.match(/^Input: “([^”]+)” Output: (.+)$/u);
  assert.ok(match, "the example must include concrete sample text and output");
  const sample = match[1];
  const counts = countText(sample);
  const paragraphs = countParagraphs(sample);
  const expected = `Input: “${sample}” Output: ${counts.words} words; ${counts.characters} characters; ${counts.charactersWithoutWhitespace} characters without whitespace; ${counts.sentences} sentences; ${paragraphs} paragraph${paragraphs === 1 ? "" : "s"}; estimated reading time: ${counts.readingMinutes} minute${counts.readingMinutes === 1 ? "" : "s"}.`;
  assert.equal(article.example.details, expected);

  const source = readFileSync("components/tools/text-tools.tsx", "utf8");
  const component = source.split("export function WordCounter() {")[1]?.split("\n}")[0] ?? "";
  assert.match(component, /const result = countText\(text\)/u);
  assert.match(component, /const paragraphs = countParagraphs\(text\)/u);
  for (const summaryField of ["result.words", "result.characters", "result.charactersWithoutWhitespace", "result.sentences", "paragraphs", "result.readingMinutes"]) {
    assert.ok(component.includes(summaryField), `copy summary should use ${summaryField}`);
  }
});

test("BMI content states its 20+ age scope and places CDC guidance beside classification", () => {
  const article = toolArticles["bmi-calculator"];
  assert.match(article.seoDescription, /adults aged 20 and older/u);
  assert.match(article.introduction, /aged 20 and older only/u);
  assert.match(article.introduction, /children and teenagers/iu);
  assert.match(article.whatItDoes, /20 and older, not children or teenagers/u);
  assert.match(article.resultExplanation, /unrounded BMI/u);
  assert.match(article.faqs.find(faq => /Who should not use/u.test(faq.question))?.answer ?? "", /aged 20 and older, not children or teenagers/u);

  const bmiGuide = categoryGuides.calculators.find(lesson => lesson.id === "bmi-measurements");
  assert.ok(bmiGuide);
  assert.match(bmiGuide.paragraphs.join(" "), /adults aged 20 and older only/u);
  assert.equal(bmiGuide.source?.url, "https://www.cdc.gov/bmi/adult-calculator/");

  const source = readFileSync("components/tools/calculator-tools.tsx", "utf8");
  const bmiComponent = source.split("export function BmiCalculator() {")[1]?.split("\n}")[0] ?? "";
  assert.match(bmiComponent, /For adults aged 20 and older only\. Adult BMI categories do not apply to children or teens\./u);
  assert.match(bmiComponent, /The category uses the full-precision BMI; only the displayed BMI is rounded to one decimal place\./u);
  assert.match(bmiComponent, /<ResultStat label="Adult screening category" value=\{calc\.result\.category\}/u);
  assert.match(bmiComponent, /calc\.result\.bmi\.toFixed\(1\)/u);

  const categoryPosition = bmiComponent.indexOf('<ResultStat label="Adult screening category"');
  const cdcLinkPosition = bmiComponent.indexOf('href="https://www.cdc.gov/bmi/adult-calculator/"', categoryPosition);
  assert.ok(categoryPosition >= 0 && cdcLinkPosition > categoryPosition && cdcLinkPosition - categoryPosition < 500,
    "CDC reference should appear immediately beside the category result");
  assert.match(bmiComponent.slice(cdcLinkPosition), /CDC adult BMI categories and guidance for ages 20\+/u);
});

test("Image Compressor content describes both image input limits", () => {
  const article = toolArticles["image-compressor"];
  assert.match(article.instructions[0], /20 MB and 40 megapixels/u);
  assert.match(article.whatItDoes, /up to 20 MB and 40 megapixels/u);
});

test("typing test example uses the first available passage and matches full-timer scoring", () => {
  const article = toolArticles["typing-speed-test"];
  const passage = typingPassages[0];
  assert.ok(article.example.details.includes(passage));
  assert.match(article.instructions[0], /first start uses the initially displayed passage/u);
  assert.equal(typingPassageIndexForStart(0, false), 0);
  assert.equal(typingPassageIndexForStart(0, true), 1);
  assert.equal(typingPassageIndexForStart(typingPassages.length - 1, true), 0);

  const target = Array.from(passage).slice(0, 125);
  assert.equal(target.length, 125);
  assert.ok(Array.from(passage).length > target.length, "the sample excerpt does not complete the passage before the timer");
  const wrongPositions = new Set([10, 30, 50, 70, 90]);
  const typed = target.map((character, index) => wrongPositions.has(index) ? (character === "x" ? "y" : "x") : character).join("");
  const metrics = calculateTypingMetrics(passage, typed, 60);
  assert.deepEqual(metrics, { correctWpm: 24, rawWpm: 25, accuracyPercent: 96, correctCharacters: 120, typedCharacters: 125 });

  assert.match(article.example.details, /first 125 characters.*full 60-second timer/u);
  assert.match(article.example.details, /raw WPM is 25.*correct WPM is 24.*accuracy is 96%/u);
  assert.doesNotMatch(article.example.details, /30-second/u);

  const source = readFileSync("components/tools/text-tools.tsx", "utf8");
  const typingComponent = source.split("export function TypingSpeedTest() {")[1]?.split("\n}")[0] ?? "";
  assert.match(typingComponent, /const passage = typingPassages\[passageIndex\]/u);
  assert.match(typingComponent, /const hasPreviousStart = hasStartedRef\.current;\s*setPassageIndex\(\(current\) => typingPassageIndexForStart\(current, hasPreviousStart\)\);/u);
  assert.match(typingComponent, /hasStartedRef\.current = true;/u);
  assert.match(source, /const TEST_SECONDS = 60;/u);
});
