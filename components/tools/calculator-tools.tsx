"use client";

import { useState, type FormEvent } from "react";
import { Download } from "lucide-react";
import {
  addDaysToDate, calculateAge, calculateAgeDifference, calculateBirthdayInfo, calculateBMI,
  calculateDateDifference, calculateDiscount, calculateGSTBreakdown, calculateLoan, calculateLoanTenureComparison,
  calculatePercentage, formatAmount, formatDiscountResult, formatPercentageResult, formatValue, loanScheduleToCSV, loanSummaryToCSV,
  parseNumericInput, weekdayOfDate,
  type BmiUnits, type GstMode, type PercentageMode,
} from "@/lib/calculations";
import {
  ErrorNotice, NumberField, ResultPanel, ResultStat, SelectField, TextField,
  ToolActions, useSubmittedCalculation, useToolCalculation,
} from "@/components/tools/form-elements";

function localDateValue(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function useReset(resetForm: () => void, resetCalculation: () => void) {
  return () => {
    resetForm();
    resetCalculation();
  };
}

export function AgeCalculator() {
  const [mode, setMode] = useState<"age" | "age-on-date" | "difference">("age");
  const [birthDate, setBirthDate] = useState("");
  const [secondBirthDate, setSecondBirthDate] = useState("");
  const [ageOnDate, setAgeOnDate] = useState("");
  type AgeCalculation =
    | { mode: "age"; age: ReturnType<typeof calculateAge>; referenceDate: string; birthday: ReturnType<typeof calculateBirthdayInfo> }
    | { mode: "age-on-date"; age: ReturnType<typeof calculateAge>; referenceDate: string }
    | { mode: "difference"; age: ReturnType<typeof calculateAgeDifference> };
  const calc = useToolCalculation<AgeCalculation>();
  const reset = useReset(() => { setMode("age"); setBirthDate(""); setSecondBirthDate(""); setAgeOnDate(""); }, calc.reset);
  const today = localDateValue(new Date());
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    calc.run(() => {
      if (mode === "age") return { mode, age: calculateAge(birthDate, today), referenceDate: today, birthday: calculateBirthdayInfo(birthDate, today) };
      if (mode === "age-on-date") return { mode, age: calculateAge(birthDate, ageOnDate), referenceDate: ageOnDate };
      return { mode, age: calculateAgeDifference(birthDate, secondBirthDate, today) };
    });
  };
  const age = calc.result?.age;
  const copyText = calc.result?.mode === "difference"
    ? `Age difference: ${age?.years} years, ${age?.months} months, ${age?.days} days (${age?.totalDays} total days).`
    : calc.result?.mode === "age"
      ? `Age as of ${calc.result.referenceDate}: ${age?.years} years, ${age?.months} months, ${age?.days} days (${age?.totalDays} total days); born ${calc.result.birthday.birthWeekday}; next birthday ${calc.result.birthday.nextBirthday} in ${calc.result.birthday.daysUntilNextBirthday} days.`
      : calc.result ? `Age as of ${calc.result.referenceDate}: ${age?.years} years, ${age?.months} months, ${age?.days} days (${age?.totalDays} total days).` : "";

  return <>
    <form noValidate className="tool-form" onSubmit={onSubmit}>
      <SelectField id="age-mode" label="Calculation" value={mode} onChange={(value) => { setMode(value as "age" | "age-on-date" | "difference"); calc.reset(); }} options={[{ value: "age", label: "Current age and next birthday" }, { value: "age-on-date", label: "Age on a selected date" }, { value: "difference", label: "Compare two birth dates" }]} />
      <div className="tool-form-grid">
        <TextField id="birth-date" type="date" label={mode === "difference" ? "First date of birth" : "Date of birth"} value={birthDate} onChange={setBirthDate} hint="Dates are used only for this browser calculation." />
        {mode === "age-on-date" && <TextField id="age-on-date" type="date" label="Age on this date" value={ageOnDate} onChange={setAgeOnDate} hint="The birth date must be on or before this date." />}
        {mode === "difference" && <TextField id="second-birth-date" type="date" label="Second date of birth" value={secondBirthDate} onChange={setSecondBirthDate} />}
      </div>
      <ToolActions onReset={reset} calculateLabel={mode === "age" ? "Calculate current age" : mode === "age-on-date" ? "Calculate age on date" : "Calculate age difference"} />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result && <ResultPanel copyText={copyText}>
      <p className="result-equation">{calc.result.mode === "difference" ? "Calendar difference between the birth dates" : `Age as of ${calc.result.referenceDate}`}</p>
      <div className="age-result"><strong>{age?.years}</strong><span>years</span><strong>{age?.months}</strong><span>months</span><strong>{age?.days}</strong><span>days</span></div>
      <p className="result-supporting">{formatValue(age?.totalDays ?? 0)} total days{calc.result.mode === "difference" ? " between the dates" : " since birth"}.</p>
      {calc.result.mode === "age" && <div className="result-stat-grid">
        <ResultStat label="Next birthday" value={`${calc.result.birthday.daysUntilNextBirthday} ${calc.result.birthday.daysUntilNextBirthday === 1 ? "day" : "days"}`} />
        <ResultStat label="Next birthday date" value={`${calc.result.birthday.nextBirthday} (${calc.result.birthday.nextBirthdayWeekday})`} />
      </div>}
    </ResultPanel>}
  </>;
}

const percentageOptions = [
  { value: "percent-of", label: "What is X% of Y?" },
  { value: "what-percent", label: "X is what percent of Y?" },
  { value: "change", label: "Percentage increase or decrease from X to Y" },
  { value: "difference", label: "Percentage difference between X and Y" },
];

export function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>("percent-of");
  const [first, setFirst] = useState("15");
  const [second, setSecond] = useState("240");
  const calc = useToolCalculation<ReturnType<typeof calculatePercentage>>();
  const reset = useReset(() => { setMode("percent-of"); setFirst("15"); setSecond("240"); }, calc.reset);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstLabel = mode === "percent-of" ? "Percentage" : mode === "what-percent" ? "Part" : mode === "change" ? "Starting value" : "First value";
    const secondLabel = mode === "percent-of" ? "Value" : mode === "what-percent" ? "Whole" : mode === "change" ? "New value" : "Second value";
    calc.run(() => calculatePercentage(mode, parseNumericInput(first, firstLabel), parseNumericInput(second, secondLabel)));
  };
  const label = mode === "percent-of" ? "Percentage" : mode === "what-percent" ? "Part" : mode === "change" ? "Starting value" : "First value";
  const secondLabel = mode === "percent-of" ? "Value" : mode === "what-percent" ? "Whole" : mode === "change" ? "New value" : "Second value";
  const presentation = calc.result ? formatPercentageResult(mode, calc.result) : null;

  return <>
    <form noValidate className="tool-form" onSubmit={onSubmit}>
      <SelectField id="percentage-mode" label="Calculation" value={mode} onChange={(value) => { setMode(value as PercentageMode); calc.reset(); }} options={percentageOptions} />
      <div className="tool-form-grid">
        <NumberField id="percentage-first" label={label} value={first} onChange={setFirst} />
        <NumberField id="percentage-second" label={secondLabel} value={second} onChange={setSecond} />
      </div>
      <ToolActions onReset={reset} calculateLabel="Calculate percentage" />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result && presentation && <ResultPanel copyText={presentation.copyText}>
      <p className="result-equation">{calc.result.label}</p>
      <div className="result-highlight">{presentation.displayText}</div>
    </ResultPanel>}
  </>;
}

export function BmiCalculator() {
  const [units, setUnits] = useState<BmiUnits>("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const calc = useToolCalculation<ReturnType<typeof calculateBMI>>();
  const updateUnits = (value: string) => {
    const nextUnits = value as BmiUnits;
    const numericWeight = Number(weight);
    const numericHeight = Number(height);
    if (Number.isFinite(numericWeight) && Number.isFinite(numericHeight)) {
      if (units === "metric" && nextUnits === "imperial") {
        setWeight((numericWeight / 0.45359237).toFixed(1));
        setHeight((numericHeight / 2.54).toFixed(1));
      } else if (units === "imperial" && nextUnits === "metric") {
        setWeight((numericWeight * 0.45359237).toFixed(1));
        setHeight((numericHeight * 2.54).toFixed(1));
      }
    }
    setUnits(nextUnits);
    calc.reset();
  };
  const reset = useReset(() => { setUnits("metric"); setWeight("70"); setHeight("175"); }, calc.reset);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    calc.run(() => calculateBMI(parseNumericInput(weight, "Weight"), parseNumericInput(height, "Height"), units));
  };

  return <>
    <form noValidate className="tool-form" onSubmit={onSubmit}>
      <SelectField id="bmi-units" label="Units" value={units} onChange={updateUnits} options={[{ value: "metric", label: "Metric (kg, cm)" }, { value: "imperial", label: "Imperial (lb, inches)" }]} />
      <div className="tool-form-grid">
        <NumberField id="bmi-weight" label={units === "metric" ? "Weight (kg)" : "Weight (lb)"} value={weight} onChange={setWeight} min={0} />
        <NumberField id="bmi-height" label={units === "metric" ? "Height (cm)" : "Height (inches)"} value={height} onChange={setHeight} min={0} />
      </div>
      <ToolActions onReset={reset} calculateLabel="Calculate BMI" />
      <ErrorNotice message={calc.error} />
    </form>
    <p className="result-supporting">For adults aged 20 and older only. Adult BMI categories do not apply to children or teens.</p>
    {calc.result && <ResultPanel copyText={`BMI ${calc.result.bmi.toFixed(1)} kg per square metre. Adult screening category: ${calc.result.category}.`}>
      <div className="result-highlight">{calc.result.bmi.toFixed(1)}<span> BMI</span></div>
      <ResultStat label="Adult screening category" value={calc.result.category} />
      <p className="result-supporting">The category uses the full-precision BMI; only the displayed BMI is rounded to one decimal place.</p>
      <p className="result-supporting"><a className="underline" href="https://www.cdc.gov/bmi/adult-calculator/" target="_blank" rel="noopener noreferrer">CDC adult BMI categories and guidance for ages 20+</a></p>
      <p className="result-caution">BMI is a screening measure, not a diagnosis. It does not account for body composition, pregnancy, age-related factors, or individual health circumstances.</p>
    </ResultPanel>}
  </>;
}

export function EmiCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("9");
  const [months, setMonths] = useState("60");
  const [comparisonMonthsOne, setComparisonMonthsOne] = useState("36");
  const [comparisonMonthsTwo, setComparisonMonthsTwo] = useState("84");
  const calc = useSubmittedCalculation({ principal, rate, months, comparisonMonthsOne, comparisonMonthsTwo }, input =>
    calculateLoanTenureComparison(
      parseNumericInput(input.principal, "Loan amount"),
      parseNumericInput(input.rate, "Annual interest rate"),
      [input.months, input.comparisonMonthsOne, input.comparisonMonthsTwo].map(value => parseNumericInput(value, "Loan term in months")),
    ));
  const primaryResult = calc.result?.[0];
  const reset = useReset(() => {
    setPrincipal("500000"); setRate("9"); setMonths("60"); setComparisonMonthsOne("36"); setComparisonMonthsTwo("84");
  }, calc.reset);
  const resultText = primaryResult ? `Monthly EMI ${formatAmount(primaryResult.monthlyPayment)}; total interest ${formatAmount(primaryResult.totalInterest)}; total repayment ${formatAmount(primaryResult.totalPayment)} over ${primaryResult.inputs.months} months.` : "";
  const downloadSchedule = () => {
    if (!primaryResult) return;
    const csv = loanSummaryToCSV(primaryResult);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "qitool-emi-summary.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <>
    <form noValidate className="tool-form" onSubmit={calc.submit} onChange={calc.reset}>
      <NumberField id="emi-principal" label="Loan amount (₹)" value={principal} onChange={setPrincipal} min={0.01} max={1_000_000_000_000} step={0.01} hint="₹0.01 to ₹1 trillion, in whole paise. Annual rates from 0% to 100%, for 1 to 600 whole months." />
      <div className="tool-form-grid">
        <NumberField id="emi-rate" label="Annual interest rate (%)" value={rate} onChange={setRate} min={0} max={100} step="any" />
        <NumberField id="emi-months" label="Main tenure (months)" value={months} onChange={setMonths} min={1} max={600} step={1} hint="Enter three different whole-number terms from 1 to 600 months." />
        <NumberField id="emi-compare-months-one" label="Compare tenure 1 (months)" value={comparisonMonthsOne} onChange={setComparisonMonthsOne} min={1} max={600} step={1} />
        <NumberField id="emi-compare-months-two" label="Compare tenure 2 (months)" value={comparisonMonthsTwo} onChange={setComparisonMonthsTwo} min={1} max={600} step={1} />
      </div>
      <ToolActions onReset={reset} calculateLabel="Calculate and compare EMI" />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result && primaryResult && <ResultPanel copyText={resultText}>
      <ResultStat label={`Monthly EMI · ${primaryResult.inputs.months} months`} value={formatAmount(primaryResult.monthlyPayment)} prominent />
      <div className="result-stat-grid"><ResultStat label="Total interest" value={formatAmount(primaryResult.totalInterest)} /><ResultStat label="Total repayment" value={formatAmount(primaryResult.totalPayment)} /></div>
      <div className="schedule-header"><h4>Compare repayment by tenure</h4></div>
      <div className="schedule-table-wrap"><table className="schedule-table"><caption className="sr-only">Monthly EMI, total repayment, and total interest for each selected tenure</caption><thead><tr><th scope="col">Tenure</th><th scope="col">Monthly EMI</th><th scope="col">Total repayment</th><th scope="col">Total interest</th></tr></thead><tbody>{calc.result.map((loan) => <tr key={loan.inputs.months}><th scope="row">{loan.inputs.months} months</th><td>{formatAmount(loan.monthlyPayment)}</td><td>{formatAmount(loan.totalPayment)}</td><td>{formatAmount(loan.totalInterest)}</td></tr>)}</tbody></table></div>
      <p className="result-supporting">All options use the same loan amount and fixed annual rate with equal monthly payments. Fees, taxes, insurance, rate changes, and prepayments are excluded. The schedule and CSV below use the main tenure.</p>
      <div className="schedule-header"><h4>Amortization schedule · {primaryResult.inputs.months} months</h4><button className="download-schedule" type="button" onClick={downloadSchedule}><Download size={14} aria-hidden="true" />Download summary CSV</button></div>
      <div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th scope="col">Month</th><th scope="col">Payment</th><th scope="col">Principal</th><th scope="col">Interest</th><th scope="col">Balance</th></tr></thead><tbody>{primaryResult.schedule.slice(0, 12).map((row) => <tr key={row.month}><td>{row.month}</td><td>{formatAmount(row.payment)}</td><td>{formatAmount(row.principal)}</td><td>{formatAmount(row.interest)}</td><td>{formatAmount(row.balance)}</td></tr>)}</tbody></table></div>
      {primaryResult.inputs.annualRatePercent === 0 && <p className="result-supporting">At 0% interest, the principal is divided evenly across the selected months.</p>}
    </ResultPanel>}
  </>;
}

const gstRates = [
  ...["0", "5", "12", "18", "28"].map((rate) => ({ value: rate, label: `${rate}%` })),
  { value: "custom", label: "Custom rate" },
];

export function GstCalculator() {
  const [mode, setMode] = useState<GstMode>("add");
  const [structure, setStructure] = useState<"single" | "split">("single");
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [customRate, setCustomRate] = useState("");
  const calc = useSubmittedCalculation({ amount, rate, customRate, mode, structure }, input => calculateGSTBreakdown(
    parseNumericInput(input.amount, "Amount"),
    parseNumericInput(input.rate === "custom" ? input.customRate : input.rate, "GST rate"),
    input.mode, input.structure,
  ));
  const reset = useReset(() => { setMode("add"); setStructure("single"); setAmount("1000"); setRate("18"); setCustomRate(""); }, calc.reset);
  const copyText = calc.result ? `GST at ${calc.result.rate}%: base ${formatAmount(calc.result.baseAmount)}, tax ${formatAmount(calc.result.gstAmount)}${calc.result.structure === "split" ? ` (CGST ${formatAmount(calc.result.cgstAmount)}, SGST ${formatAmount(calc.result.sgstAmount)})` : ""}, total ${formatAmount(calc.result.totalAmount)}.` : "";

  return <>
    <form noValidate className="tool-form" onSubmit={calc.submit} onChange={calc.reset}>
      <SelectField id="gst-mode" label="Calculation" value={mode} onChange={value => setMode(value as GstMode)} options={[{ value: "add", label: "Add GST to a pre-tax amount" }, { value: "remove", label: "Remove GST from a tax-inclusive amount" }]} />
      <SelectField id="gst-structure" label="Tax display" value={structure} onChange={value => setStructure(value as "single" | "split")} options={[{ value: "single", label: "Show total GST" }, { value: "split", label: "Split into CGST + SGST" }]} hint="Use the split for applicable intra-state supplies; confirm the correct tax treatment and rate for your transaction." />
      <div className="tool-form-grid">
        <NumberField id="gst-amount" label={mode === "add" ? "Amount before GST (₹)" : "Amount including GST (₹)"} value={amount} onChange={setAmount} min={0} step={0.01} hint="Enter rupees and paise (up to two decimal places)." />
        <SelectField id="gst-rate" label="GST rate" value={rate} onChange={setRate} options={gstRates} />
        {rate === "custom" && <NumberField id="gst-custom-rate" label="Custom GST rate (%)" value={customRate} onChange={setCustomRate} min={0} max={100} />}
      </div>
      <ToolActions onReset={reset} calculateLabel="Calculate GST" />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result && <ResultPanel copyText={copyText}>
      <ResultStat label={calc.result.mode === "add" ? "Amount including GST" : "Amount before GST"} value={formatAmount(calc.result.mode === "add" ? calc.result.totalAmount : calc.result.baseAmount)} prominent />
      <div className="result-stat-grid"><ResultStat label={calc.result.mode === "add" ? "Base amount" : `GST included (${calc.result.rate}%)`} value={formatAmount(calc.result.mode === "add" ? calc.result.baseAmount : calc.result.gstAmount)} /><ResultStat label={calc.result.mode === "add" ? `GST (${calc.result.rate}%)` : "Tax-inclusive amount"} value={formatAmount(calc.result.mode === "add" ? calc.result.gstAmount : calc.result.totalAmount)} />
        {calc.result.structure === "split" && <><ResultStat label={`CGST (${calc.result.rate / 2}%)`} value={formatAmount(calc.result.cgstAmount)} /><ResultStat label={`SGST (${calc.result.rate / 2}%)`} value={formatAmount(calc.result.sgstAmount)} /></>}
      </div>
      {calc.result.structure === "split" && <p className="result-supporting">Total tax is rounded to the nearest paise, with half a paise rounded up. CGST receives the extra paise when the split is uneven.</p>}
    </ResultPanel>}
  </>;
}

export function DateCalculator() {
  const [mode, setMode] = useState<"difference" | "add" | "weekday">("difference");
  const [firstDate, setFirstDate] = useState("");
  const [secondDate, setSecondDate] = useState("");
  const [dayCount, setDayCount] = useState("30");
  const calc = useToolCalculation<{ title: string; detail: string; copyText: string; elapsedDays?: number; inclusiveDays?: number }>();
  const reset = useReset(() => { setMode("difference"); setFirstDate(""); setSecondDate(""); setDayCount("30"); }, calc.reset);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    calc.run(() => {
      if (mode === "difference") {
        const result = calculateDateDifference(firstDate, secondDate);
        const elapsedLabel = `${result.days} elapsed ${result.days === 1 ? "day" : "days"}`;
        const inclusiveLabel = `${result.inclusiveDays} inclusive ${result.inclusiveDays === 1 ? "day" : "days"}`;
        const detail = `${result.weeks} ${result.weeks === 1 ? "week" : "weeks"} and ${result.remainingDays} ${result.remainingDays === 1 ? "day" : "days"} apart; the second date is ${result.direction}. ${firstDate} is ${weekdayOfDate(firstDate)} and ${secondDate} is ${weekdayOfDate(secondDate)}.`;
        return { title: "Date interval", detail, elapsedDays: result.days, inclusiveDays: result.inclusiveDays, copyText: `${elapsedLabel}; ${inclusiveLabel}, counting both dates. ${detail}` };
      }
      if (mode === "weekday") {
        const weekday = weekdayOfDate(firstDate);
        return { title: weekday, detail: `${firstDate} falls on a ${weekday}.`, copyText: `${firstDate} falls on a ${weekday}.` };
      }
      const resultDate = addDaysToDate(firstDate, parseNumericInput(dayCount, "Number of days"));
      const weekday = weekdayOfDate(resultDate);
      return { title: resultDate, detail: `${Math.abs(Number(dayCount))} days ${Number(dayCount) < 0 ? "before" : "after"} ${firstDate}; it is a ${weekday}.`, copyText: `${resultDate} (${weekday}; ${dayCount} days from ${firstDate})` };
    });
  };

  return <>
    <form noValidate className="tool-form" onSubmit={onSubmit}>
      <SelectField id="date-mode" label="Calculation" value={mode} onChange={(value) => { setMode(value as "difference" | "add" | "weekday"); calc.reset(); }} options={[{ value: "difference", label: "Days between two dates" }, { value: "add", label: "Add or subtract days" }, { value: "weekday", label: "Find weekday for a date" }]} />
      <div className="tool-form-grid">
        <TextField id="date-first" type="date" label={mode === "difference" ? "Start date" : "Date"} value={firstDate} onChange={setFirstDate} />
        {mode === "difference" ? <TextField id="date-second" type="date" label="End date" value={secondDate} onChange={setSecondDate} hint="Elapsed days exclude the start date. Inclusive count includes both dates." /> : mode === "add" ? <NumberField id="date-days" label="Days to add or subtract" value={dayCount} onChange={setDayCount} step={1} hint="Use a negative number to count backward." /> : null}
      </div>
      <ToolActions onReset={reset} calculateLabel={mode === "difference" ? "Calculate difference" : mode === "add" ? "Calculate date" : "Find weekday"} />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result && <ResultPanel copyText={calc.result.copyText}>
      {calc.result.elapsedDays !== undefined && calc.result.inclusiveDays !== undefined
        ? <div className="result-stat-grid"><ResultStat label="Elapsed days · start excluded" value={formatValue(calc.result.elapsedDays)} prominent /><ResultStat label="Inclusive days · both dates counted" value={formatValue(calc.result.inclusiveDays)} prominent /></div>
        : <div className="result-highlight result-date-highlight">{calc.result.title}</div>}
      <p className="result-supporting">{calc.result.detail}</p>
    </ResultPanel>}
  </>;
}

export function DiscountCalculator() {
  const [price, setPrice] = useState("2500");
  const [discount, setDiscount] = useState("20");
  const calc = useToolCalculation<ReturnType<typeof calculateDiscount>>();
  const reset = useReset(() => { setPrice("2500"); setDiscount("20"); }, calc.reset);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    calc.run(() => calculateDiscount(parseNumericInput(price, "Original price"), parseNumericInput(discount, "Discount percentage")));
  };
  const presentation = calc.result ? formatDiscountResult(calc.result) : null;

  return <>
    <form noValidate className="tool-form" onSubmit={onSubmit}>
      <div className="tool-form-grid">
        <NumberField id="discount-price" label="Original price (₹)" value={price} onChange={setPrice} min={0} />
        <NumberField id="discount-percent" label="Discount (%)" value={discount} onChange={setDiscount} min={0} max={100} step="any" />
      </div>
      <ToolActions onReset={reset} calculateLabel="Calculate discount" />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result && presentation && <ResultPanel copyText={presentation.copyText}>
      <ResultStat label="Final price" value={presentation.finalPriceText} prominent />
      <div className="result-stat-grid">
        <ResultStat label="Original price" value={presentation.originalPriceText} />
        <ResultStat label={`You save (${formatValue(calc.result.discountPercent)}%)`} value={presentation.savingsText} />
      </div>
      <p className="result-supporting">Amounts are rounded half-up to the nearest paise. Final price equals the rounded original price minus the rounded savings.</p>
    </ResultPanel>}
  </>;
}

export function LoanCalculator() {
  const [principal, setPrincipal] = useState("300000");
  const [rate, setRate] = useState("10");
  const [months, setMonths] = useState("36");
  const calc = useSubmittedCalculation({ principal, rate, months }, input =>
    calculateLoan(
      parseNumericInput(input.principal, "Loan amount"),
      parseNumericInput(input.rate, "Annual interest rate"),
      parseNumericInput(input.months, "Loan term in months"),
    ));
  const reset = useReset(() => { setPrincipal("300000"); setRate("10"); setMonths("36"); }, calc.reset);
  const copyText = calc.result ? `Monthly payment ${formatAmount(calc.result.monthlyPayment)}; total interest ${formatAmount(calc.result.totalInterest)}; total payment ${formatAmount(calc.result.totalPayment)}.` : "";
  const downloadCsv = () => {
    if (!calc.result) return;
    const blob = new Blob([loanScheduleToCSV(calc.result)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "qitool-loan-schedule.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <>
    <form noValidate className="tool-form" onSubmit={calc.submit} onChange={calc.reset}>
      <NumberField id="loan-principal" label="Loan amount (₹)" value={principal} onChange={setPrincipal} min={0.01} max={1_000_000_000_000} step={0.01} hint="₹0.01 to ₹1 trillion, in whole paise. Annual rates from 0% to 100%, for 1 to 600 whole months." />
      <div className="tool-form-grid">
        <NumberField id="loan-rate" label="Annual interest rate (%)" value={rate} onChange={setRate} min={0} max={100} step="any" />
        <NumberField id="loan-months" label="Repayment term (months)" value={months} onChange={setMonths} min={1} max={600} step={1} />
      </div>
      <ToolActions onReset={reset} calculateLabel="Calculate repayment plan" />
      <ErrorNotice message={calc.error} />
    </form>
    <p className="result-supporting">Changing any loan input clears the schedule. Recalculate to generate an updated repayment plan.</p>
    {calc.result && <ResultPanel copyText={copyText}>
      <ResultStat label="Monthly payment" value={formatAmount(calc.result.monthlyPayment)} prominent />
      <div className="result-stat-grid"><ResultStat label="Total interest" value={formatAmount(calc.result.totalInterest)} /><ResultStat label="Total repayment" value={formatAmount(calc.result.totalPayment)} /></div>
      <div className="schedule-header"><h4>First {Math.min(12, calc.result.schedule.length)} monthly payments</h4><button className="download-schedule" type="button" onClick={downloadCsv}><Download size={14} aria-hidden="true" />Download full CSV</button></div>
      <div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{calc.result.schedule.slice(0, 12).map((row) => <tr key={row.month}><td>{row.month}</td><td>{formatAmount(row.payment)}</td><td>{formatAmount(row.principal)}</td><td>{formatAmount(row.interest)}</td><td>{formatAmount(row.balance)}</td></tr>)}</tbody></table></div>
    </ResultPanel>}
  </>;
}
