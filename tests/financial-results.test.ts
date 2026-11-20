import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateGSTBreakdown, calculateLoan, convertUnit, loanSummaryToCSV,
} from "../lib/calculations";
import { calculateSubmission, currentSubmission } from "../lib/submitted-calculation";

const paise = (value: number) => Math.round(value * 100);

test("editing EMI terms invalidates the result and an existing export retains its submitted terms", () => {
  const draft = { principal: "500000", rate: "9", months: "60" };
  const submit = () => calculateSubmission(draft, input =>
    calculateLoan(Number(input.principal), Number(input.rate), Number(input.months)));
  const original = submit();
  assert.equal(currentSubmission(original, draft), original);
  draft.principal = "600000";
  assert.equal(currentSubmission(original, draft), null);
  const csv = loanSummaryToCSV(original.value);
  assert.match(csv, /^Loan amount,500000\.00\r\nAnnual interest rate,9%\r\nTerm in months,60\r\nMonthly EMI,10379\.18\r\n/);
  assert.equal(csv.trimEnd().split("\r\n").length, 68);
  assert.match(loanSummaryToCSV(submit().value), /^Loan amount,600000\.00/);
});

test("editing a GST rate invalidates the old result and preserves its original tax and label", () => {
  const draft = { rate: "18", amount: "1000" };
  const calculate = (input: typeof draft) => calculateGSTBreakdown(Number(input.amount), Number(input.rate), "add", "single");
  const old = calculateSubmission(draft, calculate);
  draft.rate = "5";
  assert.equal(currentSubmission(old, draft), null);
  assert.deepEqual([old.value.rate, old.value.gstAmount], [18, 180]);
  assert.equal(calculateSubmission(draft, calculate).value.gstAmount, 50);
});

test("editing a conversion invalidates the old equation and keeps zero a valid result", () => {
  const draft = { value: "5", from: "kilometre", to: "mile" };
  const calculate = (input: typeof draft) => convertUnit(Number(input.value), "length", input.from, input.to);
  const old = calculateSubmission(draft, calculate);
  draft.value = "10";
  assert.equal(currentSubmission(old, draft), null);
  assert.equal(old.inputs.value, "5");
  assert.equal(calculateSubmission(draft, calculate).value, 2 * old.value);
  draft.value = "0";
  assert.equal(currentSubmission(calculateSubmission(draft, calculate), draft)?.value, 0);
});

for (const [principal, rate, months] of [
  [1200, 0, 12], [500000, 9, 60], [500000, 1e-15, 60], [1e12, Number.MIN_VALUE, 600],
  [100000, 100, 600], [1e12, 100, 600], [0.01, 100, 600], [0.01, 0, 1],
]) {
  test(`loan schedule reconciles every payment for ${principal} at ${rate}% over ${months} months`, () => {
    const result = calculateLoan(principal, rate, months);
    assert.equal(result.schedule.length, months);
    let balance = paise(principal);
    let interest = 0;
    let payments = 0;
    for (const row of result.schedule) {
      const principalPart = paise(row.principal);
      assert.ok(principalPart >= 0 && principalPart <= balance);
      assert.equal(paise(row.interest), Math.round(balance * (rate / 1200)));
      assert.equal(paise(row.payment), principalPart + paise(row.interest));
      assert.ok(Math.abs(paise(row.payment) - paise(result.monthlyPayment)) <= 2);
      balance -= principalPart;
      assert.equal(paise(row.balance), balance);
      interest += paise(row.interest);
      payments += paise(row.payment);
    }
    assert.equal(balance, 0);
    assert.equal(paise(result.totalInterest), interest);
    assert.equal(paise(result.totalPayment), payments);
    assert.equal(payments, paise(principal) + interest);
    if (rate < 1e-12) assert.ok(Math.abs(result.monthlyPayment - principal / months) < 0.00001);
  });
}

test("GST supports custom rates, inclusive tax and exact half-up rounding on split amounts", () => {
  for (const rate of [0, 7.25, 40, 100, 1e-8]) {
    const added = calculateGSTBreakdown(100, rate, "add", "split");
    const removed = calculateGSTBreakdown(added.totalAmount, rate, "remove", "split");
    assert.equal(added.rate, rate);
    assert.equal(added.gstAmount, Math.round(rate * 100) / 100);
    assert.equal(removed.baseAmount, 100);
    assert.equal(paise(added.cgstAmount) + paise(added.sgstAmount), paise(added.gstAmount));
  }
  for (const [amount, rate, mode] of [[0.10, 5, "add"], [0.01, 100, "remove"]] as const) {
    const result = calculateGSTBreakdown(amount, rate, mode, "split");
    assert.deepEqual([result.gstAmount, result.cgstAmount, result.sgstAmount], [0.01, 0.01, 0]);
    assert.equal(paise(result.baseAmount) + 1, paise(result.totalAmount));
  }
  assert.equal(calculateGSTBreakdown(1, 0.5, "add", "split").gstAmount, 0.01);
  for (const invalid of [-0.01, 100.01, Infinity, NaN])
    assert.throws(() => calculateGSTBreakdown(100, invalid, "add", "split"), /GST rate/);
  assert.throws(() => calculateLoan(1.001, 9, 60), /paise/);
  assert.throws(() => calculateGSTBreakdown(1.001, 5, "add", "split"), /paise/);
});
