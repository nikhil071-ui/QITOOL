import assert from "node:assert/strict";
import test from "node:test";
import {
  addDaysToDate, calculateAge, calculateBMI, calculateDateDifference, calculateDiscount,
  calculateEMI, calculateGST, calculateLoan, calculateLoanTenureComparison, calculatePercentage, calculateTypingMetrics,
  convertUnit, countCharacters, countText, formatPercentageResult, loanScheduleToCSV, parseNumericInput, unitOptions,
} from "../lib/calculations";

test("age calculator handles exact calendar ages, birthdays, and leap days", () => {
  assert.deepEqual(calculateAge("1990-03-14", "2026-11-19"), { years: 36, months: 8, days: 5, totalDays: 13399 });
  assert.deepEqual(calculateAge("2000-02-29", "2001-02-28"), { years: 1, months: 0, days: 0, totalDays: 365 });
  assert.deepEqual(calculateAge("2026-11-19", "2026-11-19"), { years: 0, months: 0, days: 0, totalDays: 0 });
  assert.deepEqual(calculateAge("1990-03-14", "2026-03-14"), { years: 36, months: 0, days: 0, totalDays: 13149 });
  assert.deepEqual(calculateAge("1990-03-15", "2026-03-14"), { years: 35, months: 11, days: 27, totalDays: 13148 });
  assert.throws(() => calculateAge("2027-01-01", "2026-11-19"), /future/);
  assert.throws(() => calculateAge("2023-02-29", "2026-11-19"), /real calendar/);
  assert.throws(() => calculateAge("2000-02-29", "2000-02-28"), /future/);
  assert.deepEqual(calculateAge("2000-02-29", "2004-02-29"), { years: 4, months: 0, days: 0, totalDays: 1461 });
  assert.throws(() => calculateAge("", "2026-11-19"), /date of birth/);
  assert.throws(() => calculateAge("2000-01-01", "2024-02-30"), /real calendar/);
});

test("percentage calculator covers each mode and rejects undefined ratios", () => {
  assert.equal(calculatePercentage("percent-of", 15, 240).value, 36);
  assert.equal(calculatePercentage("what-percent", 36, 240).value, 15);
  assert.equal(calculatePercentage("change", 80, 100).value, 25);
  assert.equal(calculatePercentage("change", 100, 80).value, -20);
  assert.throws(() => calculatePercentage("what-percent", 3, 0), /cannot be zero/);
  assert.throws(() => calculatePercentage("change", 0, 3), /starting value/);
  assert.throws(() => calculatePercentage("percent-of", Number.NaN, 3), /valid number/);
  assert.throws(() => calculatePercentage("percent-of", 1e308, 1e308), /too large to calculate safely/);
  assert.throws(() => calculatePercentage("what-percent", 1e308, 1e-308), /too large to calculate safely/);
  assert.throws(() => parseNumericInput(" ", "Amount"), /Enter amount/);
  assert.throws(() => parseNumericInput("Infinity", "Amount"), /valid number/);
});

test("percentage change wording follows numerical direction with signed baselines", () => {
  const negativeBaselineIncrease = calculatePercentage("change", -100, -50);
  assert.equal(negativeBaselineIncrease.value, -50);
  assert.equal(negativeBaselineIncrease.direction, "increase");
  assert.deepEqual(formatPercentageResult("change", negativeBaselineIncrease), {
    displayText: "Increase of 50%",
    copyText: "Change from -100 to -50: Increase of 50%.",
  });

  const positiveBaselineIncrease = calculatePercentage("change", 80, 100);
  assert.equal(positiveBaselineIncrease.direction, "increase");
  assert.equal(formatPercentageResult("change", positiveBaselineIncrease).displayText, "Increase of 25%");

  const negativeBaselineDecrease = calculatePercentage("change", -100, -150);
  assert.equal(negativeBaselineDecrease.direction, "decrease");
  assert.equal(formatPercentageResult("change", negativeBaselineDecrease).displayText, "Decrease of 50%");
});

test("equal percentage-change values display and copy No change, including zero", () => {
  for (const [first, second] of [[80, 80], [-100, -100], [0, 0]]) {
    const result = calculatePercentage("change", first, second);
    assert.equal(result.direction, "unchanged");
    assert.deepEqual(formatPercentageResult("change", result), {
      displayText: "No change",
      copyText: `Change from ${first} to ${second}: No change.`,
    });
  }
  assert.throws(() => calculatePercentage("change", 0, 3), /starting value/);
});

test("percentage difference display and clipboard include context and percent unit", () => {
  const result = calculatePercentage("difference", 80, 100);
  const presentation = formatPercentageResult("difference", result);
  assert.match(presentation.displayText, /%$/);
  assert.equal(presentation.copyText, `${result.label}: ${presentation.displayText}.`);
  assert.match(presentation.copyText, /Percentage difference between 80 and 100:/);
  assert.match(presentation.copyText, /%\.$/);
});

test("BMI supports metric and imperial inputs and rejects unsafe values", () => {
  const metric = calculateBMI(70, 175, "metric");
  const imperial = calculateBMI(70 / 0.45359237, 175 / 2.54, "imperial");
  assert.ok(Math.abs(metric.bmi - 22.857142857) < 0.000001);
  assert.ok(Math.abs(metric.bmi - imperial.bmi) < 0.000001);
  assert.equal(metric.category, "Within the adult reference range");
  assert.throws(() => calculateBMI(0, 170, "metric"), /between 1 and 700/);
  assert.throws(() => calculateBMI(65, 0, "metric"), /between 30 and 300/);
  assert.throws(() => calculateBMI(65, 170, "unknown" as "metric"), /Choose metric/);
});

test("BMI classifications use full precision across cutoffs even when display rounding crosses a cutoff", () => {
  const cases = [
    [18.499, "18.5", "Below the adult reference range"],
    [18.5, "18.5", "Within the adult reference range"],
    [24.999, "25.0", "Within the adult reference range"],
    [25, "25.0", "Above the adult reference range"],
    [29.999, "30.0", "Above the adult reference range"],
    [30, "30.0", "High adult reference range"],
  ] as const;

  for (const [weight, displayedBmi, category] of cases) {
    const result = calculateBMI(weight, 100, "metric");
    assert.equal(result.bmi, weight);
    assert.equal(result.bmi.toFixed(1), displayedBmi);
    assert.equal(result.category, category);
  }
});

test("EMI and loan schedule handle zero interest, ordinary rates, and invalid terms", () => {
  const standard = calculateEMI(500000, 9, 60);
  assert.ok(Math.abs(standard.monthlyPayment - 10379.16) < 0.02);
  assert.ok(standard.totalPayment > 500000);
  assert.ok(standard.totalInterest > 0);
  const noInterest = calculateEMI(1200, 0, 12);
  assert.equal(noInterest.monthlyPayment, 100);
  assert.equal(noInterest.totalPayment, 1200);
  assert.equal(noInterest.totalInterest, 0);

  const loan = calculateLoan(300000, 10, 36);
  assert.equal(loan.schedule.length, 36);
  assert.ok(Math.abs(loan.monthlyPayment - 9680.156) < 0.002);
  assert.equal(loan.schedule.at(-1)?.balance, 0);
  assert.ok(loan.schedule[0].interest > loan.schedule[35].interest);
  assert.equal(loanScheduleToCSV(loan).split("\r\n").length, 37);
  assert.match(loanScheduleToCSV(loan), /^Month,Payment,Principal,Interest,Remaining balance/);
  assert.throws(() => calculateLoan(-1, 5, 36), /Loan amount/);
  assert.throws(() => calculateLoan(1000, 101, 12), /interest rate/);
  assert.throws(() => calculateLoan(1000, 5, 12.5), /whole number/);
  assert.throws(() => calculateLoan(1000, 5, 601), /between 1 and 600/);
});

test("EMI tenure comparison reuses validated loan schedules and matches an independent payment formula", () => {
  const principal = 500000;
  const annualRatePercent = 9;
  const comparisons = calculateLoanTenureComparison(principal, annualRatePercent, [36, 60, 84]);
  const monthlyRate = annualRatePercent / 1200;

  assert.deepEqual(comparisons.map(result => result.inputs.months), [36, 60, 84]);
  for (const result of comparisons) {
    const expectedPayment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -result.inputs.months));
    assert.ok(Math.abs(result.monthlyPayment - expectedPayment) < 1e-8);
    assert.equal(result.schedule.length, result.inputs.months);
    assert.equal(Math.round(result.totalInterest * 100), Math.round((result.totalPayment - principal) * 100));
  }
  assert.ok(comparisons[0].monthlyPayment > comparisons[1].monthlyPayment);
  assert.ok(comparisons[1].monthlyPayment > comparisons[2].monthlyPayment);
  assert.ok(comparisons[0].totalInterest < comparisons[1].totalInterest);
  assert.ok(comparisons[1].totalInterest < comparisons[2].totalInterest);

  const zeroRate = calculateLoanTenureComparison(1200, 0, [12, 24, 36]);
  assert.deepEqual(zeroRate.map(result => result.inputs.months), [12, 24, 36]);
  for (const result of zeroRate) {
    assert.ok(Math.abs(result.monthlyPayment - 1200 / result.inputs.months) < 1e-12);
    assert.equal(result.totalPayment, 1200);
    assert.equal(result.totalInterest, 0);
  }
  assert.throws(() => calculateLoanTenureComparison(1000, 5, [12]), /two or three/);
  assert.throws(() => calculateLoanTenureComparison(1000, 5, [12, 12]), /different tenure/);
  assert.throws(() => calculateLoanTenureComparison(1000, 5, [12, 24.5]), /whole number/);
  assert.throws(() => calculateLoanTenureComparison(1000, 5, [12, 24, 601]), /600/);
});

test("GST add and remove are inverse operations at selectable rates", () => {
  const added = calculateGST(1000, 18, "add");
  assert.deepEqual(added, { baseAmount: 1000, gstAmount: 180, totalAmount: 1180, rate: 18, mode: "add" });
  const removed = calculateGST(1180, 18, "remove");
  assert.equal(removed.baseAmount, 1000);
  assert.equal(removed.gstAmount, 180);
  assert.equal(calculateGST(12.5, 0, "add").totalAmount, 12.5);
  const inclusiveAmount = 590;
  const rate = 18;
  const independentlyCalculatedBase = inclusiveAmount * 100 / (100 + rate);
  const extracted = calculateGST(inclusiveAmount, rate, "remove");
  assert.equal(independentlyCalculatedBase, 500);
  assert.equal(extracted.baseAmount, 500);
  assert.equal(extracted.gstAmount, 90);
  assert.equal(extracted.totalAmount, 590);
  assert.throws(() => calculateGST(-1, 18, "add"), /Amount/);
  assert.throws(() => calculateGST(100, 101, "remove"), /GST rate/);
});

test("date calculator counts elapsed days and crosses leap-day boundaries", () => {
  assert.deepEqual(calculateDateDifference("2026-01-01", "2026-01-10"), { days: 9, inclusiveDays: 10, weeks: 1, remainingDays: 2, direction: "after" });
  assert.deepEqual(calculateDateDifference("2026-01-10", "2026-01-01"), { days: 9, inclusiveDays: 10, weeks: 1, remainingDays: 2, direction: "before" });
  assert.deepEqual(calculateDateDifference("2026-01-01", "2026-01-01"), { days: 0, inclusiveDays: 1, weeks: 0, remainingDays: 0, direction: "same day" });
  assert.deepEqual(calculateDateDifference("2024-02-28", "2024-03-01"), { days: 2, inclusiveDays: 3, weeks: 0, remainingDays: 2, direction: "after" });
  assert.deepEqual(calculateDateDifference("2026-01-31", "2026-02-01"), { days: 1, inclusiveDays: 2, weeks: 0, remainingDays: 1, direction: "after" });
  assert.deepEqual(calculateDateDifference("2025-12-31", "2026-01-01"), { days: 1, inclusiveDays: 2, weeks: 0, remainingDays: 1, direction: "after" });
  assert.equal(addDaysToDate("2024-02-28", 1), "2024-02-29");
  assert.equal(addDaysToDate("2024-03-01", -1), "2024-02-29");
  assert.throws(() => addDaysToDate("2024-01-01", 1.5), /whole number/);
  assert.throws(() => calculateDateDifference("2023-02-29", "2023-03-01"), /real calendar/);
  assert.throws(() => calculateDateDifference("2026-01-01", ""), /second date/);
});

test("discount handles free, full-price, and full-discount edges", () => {
  assert.deepEqual(calculateDiscount(2500, 20), { savings: 500, finalPrice: 2000, discountPercent: 20 });
  assert.equal(calculateDiscount(120, 0).finalPrice, 120);
  assert.equal(calculateDiscount(120, 100).finalPrice, 0);
  assert.throws(() => calculateDiscount(100, -1), /Discount percentage/);
  assert.throws(() => calculateDiscount(100, 100.1), /Discount percentage/);
});

test("word and character counters handle whitespace, punctuation, and emoji graphemes", () => {
  assert.deepEqual(countText("Hello, world! Good day."), { words: 4, characters: 23, charactersWithoutWhitespace: 20, sentences: 2, readingMinutes: 1 });
  assert.deepEqual(countText(""), { words: 0, characters: 0, charactersWithoutWhitespace: 0, sentences: 0, readingMinutes: 0 });
  const characters = countCharacters("a 👩‍👩‍👧‍👦\n");
  assert.equal(characters.characters, 4);
  assert.equal(characters.charactersWithoutWhitespace, 2);
  assert.equal(characters.whitespace, 2);
  assert.equal(characters.words, 1);
  assert.equal(characters.lines, 2);
  assert.equal(countCharacters("").lines, 0);
});

test("typing speed returns correct and raw WPM with exact-position accuracy", () => {
  assert.deepEqual(calculateTypingMetrics("hello world", "hello world", 60), { correctWpm: 2.2, rawWpm: 2.2, accuracyPercent: 100, correctCharacters: 11, typedCharacters: 11 });
  const typo = calculateTypingMetrics("hello world", "hello worle", 60);
  assert.equal(typo.correctWpm, 2);
  assert.ok(Math.abs(typo.accuracyPercent - (10 / 11) * 100) < 0.0001);
  assert.equal(calculateTypingMetrics("abc", "", 0).accuracyPercent, 0);
  assert.throws(() => calculateTypingMetrics("abc", "a", 0), /greater than zero/);
  assert.throws(() => calculateTypingMetrics("abc", "a", -1), /Elapsed time/);
});

test("unit conversion uses correct temperature offsets and metric factors", () => {
  assert.equal(convertUnit(5, "length", "kilometre", "mile"), 5 / 1.609344);
  assert.equal(convertUnit(1, "weight", "kilogram", "gram"), 1000);
  assert.ok(Math.abs(convertUnit(32, "temperature", "fahrenheit", "celsius")) < 1e-10);
  assert.equal(convertUnit(0, "temperature", "celsius", "kelvin"), 273.15);
  assert.throws(() => convertUnit(1e308, "temperature", "celsius", "fahrenheit"), /too large to calculate safely/);
  assert.equal(convertUnit(1, "volume", "litre", "millilitre"), 1000);
  assert.equal(convertUnit(1, "volume", "gallon", "litre"), 3.785411784);
  assert.equal(convertUnit(1, "volume", "imperialGallon", "litre"), 4.54609);
  assert.equal(unitOptions.volume.find(unit => unit.value === "gallon")?.label, "US liquid gallon");
  assert.equal(unitOptions.volume.find(unit => unit.value === "imperialGallon")?.label, "Imperial gallon (UK gal)");
  assert.ok(Math.abs(convertUnit(4.54609, "volume", "litre", "imperialGallon") - 1) < 1e-12);
  assert.ok(Math.abs(convertUnit(3.785411784, "volume", "litre", "gallon") - 1) < 1e-12);
  assert.ok(Math.abs(convertUnit(convertUnit(3.25, "volume", "imperialGallon", "litre"), "volume", "litre", "imperialGallon") - 3.25) < 1e-12);
  assert.equal(convertUnit(0, "length", "metre", "foot"), 0);
  assert.throws(() => convertUnit(-1, "length", "metre", "foot"), /cannot be negative/);
  assert.throws(() => convertUnit(-1, "temperature", "kelvin", "celsius"), /absolute zero/);
  assert.throws(() => convertUnit(5, "length", "kilometre", "gallon"), /valid units/);
});
