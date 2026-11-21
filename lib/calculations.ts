const DAY_MS = 86_400_000;

function requireFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} must be a valid number.`);
  return value;
}

function requireRange(value: number, label: string, min: number, max: number): number {
  requireFinite(value, label);
  if (value < min || value > max) throw new Error(`${label} must be between ${min} and ${max}.`);
  return value;
}

function requireFiniteResult(value: number): number {
  if (!Number.isFinite(value)) throw new Error("These values are too large to calculate safely.");
  return value;
}

export function parseNumericInput(value: string, label: string): number {
  if (!value.trim()) throw new Error(`Enter ${label.toLowerCase()}.`);
  const parsed = Number(value);
  return requireFinite(parsed, label);
}

type CalendarDate = { year: number; month: number; day: number; epoch: number };

export function parseISODate(value: string, label = "Date"): CalendarDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Choose a valid ${label.toLowerCase()}.`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1000 || year > 9999) throw new Error(`${label} must be between years 1000 and 9999.`);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`Choose a real calendar ${label.toLowerCase()}.`);
  }
  return { year, month, day, epoch: date.getTime() };
}

function addCalendarMonths(date: CalendarDate, monthCount: number): CalendarDate {
  const absoluteMonth = date.year * 12 + date.month - 1 + monthCount;
  const year = Math.floor(absoluteMonth / 12);
  const month = ((absoluteMonth % 12) + 12) % 12 + 1;
  const finalDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(date.day, finalDayOfMonth);
  const epoch = Date.UTC(year, month - 1, day);
  return { year, month, day, epoch };
}

export type AgeResult = { years: number; months: number; days: number; totalDays: number };

function calendarAgeBetween(birth: CalendarDate, asOf: CalendarDate): AgeResult {
  let years = asOf.year - birth.year;
  let yearAnchor = addCalendarMonths(birth, years * 12);
  if (yearAnchor.epoch > asOf.epoch) {
    years -= 1;
    yearAnchor = addCalendarMonths(birth, years * 12);
  }

  let months = (asOf.year - yearAnchor.year) * 12 + asOf.month - yearAnchor.month;
  let monthAnchor = addCalendarMonths(yearAnchor, months);
  if (monthAnchor.epoch > asOf.epoch) {
    months -= 1;
    monthAnchor = addCalendarMonths(yearAnchor, months);
  }

  return {
    years,
    months,
    days: Math.floor((asOf.epoch - monthAnchor.epoch) / DAY_MS),
    totalDays: Math.floor((asOf.epoch - birth.epoch) / DAY_MS),
  };
}

export function calculateAge(birthDate: string, asOfDate: string): AgeResult {
  const birth = parseISODate(birthDate, "date of birth");
  const asOf = parseISODate(asOfDate, "comparison date");
  if (birth.epoch > asOf.epoch) throw new Error("Date of birth cannot be in the future.");
  return calendarAgeBetween(birth, asOf);
}

export function calculateAgeDifference(firstDate: string, secondDate: string, asOfDate?: string): AgeResult {
  const first = parseISODate(firstDate, "first date of birth");
  const second = parseISODate(secondDate, "second date of birth");
  if (asOfDate) {
    const asOf = parseISODate(asOfDate, "comparison date");
    if (first.epoch > asOf.epoch || second.epoch > asOf.epoch) throw new Error("Dates of birth cannot be in the future.");
  }
  return first.epoch <= second.epoch ? calendarAgeBetween(first, second) : calendarAgeBetween(second, first);
}

export function weekdayOfDate(dateValue: string): string {
  const date = parseISODate(dateValue);
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(new Date(date.epoch));
}

export type BirthdayInfo = { birthWeekday: string; nextBirthday: string; nextBirthdayWeekday: string; daysUntilNextBirthday: number };

export function calculateBirthdayInfo(birthDate: string, asOfDate: string): BirthdayInfo {
  const birth = parseISODate(birthDate, "date of birth");
  const asOf = parseISODate(asOfDate, "comparison date");
  if (birth.epoch > asOf.epoch) throw new Error("Date of birth cannot be in the future.");

  let nextBirthday = addCalendarMonths(birth, (asOf.year - birth.year) * 12);
  if (nextBirthday.epoch < asOf.epoch) nextBirthday = addCalendarMonths(birth, (asOf.year - birth.year + 1) * 12);
  const nextDate = `${nextBirthday.year.toString().padStart(4, "0")}-${nextBirthday.month.toString().padStart(2, "0")}-${nextBirthday.day.toString().padStart(2, "0")}`;

  return {
    birthWeekday: weekdayOfDate(birthDate),
    nextBirthday: nextDate,
    nextBirthdayWeekday: weekdayOfDate(nextDate),
    daysUntilNextBirthday: Math.floor((nextBirthday.epoch - asOf.epoch) / DAY_MS),
  };
}

export type PercentageMode = "percent-of" | "what-percent" | "change" | "difference";
export type PercentageChangeDirection = "increase" | "decrease" | "unchanged";
export type PercentageResult = { value: number; label: string; direction: PercentageChangeDirection | null };

export function calculatePercentage(mode: PercentageMode, first: number, second: number): PercentageResult {
  requireFinite(first, "First value");
  requireFinite(second, "Second value");
  if (mode === "percent-of") return { value: requireFiniteResult((first / 100) * second), label: `${first}% of ${second}`, direction: null };
  if (mode === "what-percent") {
    if (second === 0) throw new Error("The comparison value cannot be zero.");
    return { value: requireFiniteResult((first / second) * 100), label: `${first} as a percentage of ${second}`, direction: null };
  }
  if (mode === "change") {
    const label = `Change from ${first} to ${second}`;
    if (first === second) return { value: 0, label, direction: "unchanged" };
    if (first === 0) throw new Error("The starting value cannot be zero for percentage change.");
    return {
      value: requireFiniteResult(((second - first) / first) * 100),
      label,
      direction: second > first ? "increase" : "decrease",
    };
  }
  if (mode === "difference") {
    const averageMagnitude = (Math.abs(first) + Math.abs(second)) / 2;
    if (averageMagnitude === 0) throw new Error("At least one value must be non-zero to calculate percentage difference.");
    const value = (Math.abs(first - second) / averageMagnitude) * 100;
    return { value: requireFiniteResult(value), label: `Percentage difference between ${first} and ${second}`, direction: null };
  }
  throw new Error("Choose a percentage calculation type.");
}

export type BmiUnits = "metric" | "imperial";
export type BmiResult = { bmi: number; category: string; unitLabel: string };

export function calculateBMI(weight: number, height: number, units: BmiUnits): BmiResult {
  requireFinite(weight, "Weight");
  requireFinite(height, "Height");
  let kilograms: number;
  let metres: number;
  if (units === "metric") {
    requireRange(weight, "Weight in kilograms", 1, 700);
    requireRange(height, "Height in centimetres", 30, 300);
    kilograms = weight;
    metres = height / 100;
  } else if (units === "imperial") {
    requireRange(weight, "Weight in pounds", 2, 1540);
    requireRange(height, "Height in inches", 12, 120);
    kilograms = weight * 0.45359237;
    metres = height * 0.0254;
  } else {
    throw new Error("Choose metric or imperial units.");
  }

  const bmi = kilograms / (metres * metres);
  // Classify the full-precision result; the component rounds only the displayed value.
  const category = bmi < 18.5 ? "Below the adult reference range" : bmi < 25 ? "Within the adult reference range" : bmi < 30 ? "Above the adult reference range" : "High adult reference range";
  return { bmi, category, unitLabel: "kg/m²" };
}

export type LoanRow = { month: number; payment: number; principal: number; interest: number; balance: number };
export type LoanResult = {
  inputs: { principal: number; annualRatePercent: number; months: number };
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: LoanRow[];
};

function toPaise(amount: number, label: string): number {
  const paise = Math.round(amount * 100);
  if (paise / 100 !== amount) throw new Error(`${label} must be in whole paise (up to two decimal places).`);
  return paise;
}

export function calculateLoan(principal: number, annualRatePercent: number, months: number): LoanResult {
  requireRange(principal, "Loan amount", 0.01, 1_000_000_000_000);
  requireRange(annualRatePercent, "Annual interest rate", 0, 100);
  requireRange(months, "Loan term in months", 1, 600);
  if (!Number.isInteger(months)) throw new Error("Loan term must be a whole number of months.");

  const monthlyRate = annualRatePercent / 1200;
  const principalPaise = toPaise(principal, "Loan amount");
  const logGrowth = Math.log1p(monthlyRate);
  const discount = -Math.expm1(-months * logGrowth);
  const monthlyPayment = principal * (discount === 0 ? 1 / months : monthlyRate / discount);
  let paidPrincipal = 0;
  let interestPaiseTotal = 0;
  const schedule: LoanRow[] = [];
  for (let month = 1; month <= months; month += 1) {
    // Closed-form cumulative principal avoids subtracting near-equal payment and interest
    // hundreds of times. Discounting keeps all exponential arguments nonpositive.
    const fractionPaid = discount === 0 ? month / months :
      Math.exp(-(months - month) * logGrowth) * (-Math.expm1(-month * logGrowth) / discount);
    const nextPaidPrincipal = month === months ? principalPaise : Math.round(principalPaise * fractionPaid);
    const principalPart = nextPaidPrincipal - paidPrincipal;
    const interest = Math.round((principalPaise - paidPrincipal) * monthlyRate);
    interestPaiseTotal += interest;
    paidPrincipal = nextPaidPrincipal;
    schedule.push({
      month, payment: (principalPart + interest) / 100, principal: principalPart / 100,
      interest: interest / 100, balance: (principalPaise - paidPrincipal) / 100,
    });
  }

  // At the supported limits even 600 months of interest on the full principal
  // plus the original principal fits within Number.MAX_SAFE_INTEGER paise.
  return {
    inputs: { principal, annualRatePercent, months },
    monthlyPayment,
    totalPayment: (principalPaise + interestPaiseTotal) / 100,
    totalInterest: interestPaiseTotal / 100,
    schedule,
  };
}

export function loanScheduleToCSV(result: LoanResult): string {
  const rows = ["Month,Payment,Principal,Interest,Remaining balance"];
  for (const row of result.schedule) {
    rows.push([row.month, row.payment, row.principal, row.interest, row.balance].map((value) => typeof value === "number" ? value.toFixed(2) : value).join(","));
  }
  return rows.join("\r\n");
}

export function loanSummaryToCSV(result: LoanResult): string {
  const { principal, annualRatePercent, months } = result.inputs;
  return [
    `Loan amount,${principal.toFixed(2)}`,
    `Annual interest rate,${annualRatePercent}%`,
    `Term in months,${months}`,
    `Monthly EMI,${result.monthlyPayment.toFixed(2)}`,
    `Total interest,${result.totalInterest.toFixed(2)}`,
    `Total repayment,${result.totalPayment.toFixed(2)}`,
    "",
    loanScheduleToCSV(result),
  ].join("\r\n");
}

export function calculateEMI(principal: number, annualRatePercent: number, months: number): Pick<LoanResult, "monthlyPayment" | "totalPayment" | "totalInterest"> {
  const { monthlyPayment, totalPayment, totalInterest } = calculateLoan(principal, annualRatePercent, months);
  return { monthlyPayment, totalPayment, totalInterest };
}

export function calculateLoanTenureComparison(principal: number, annualRatePercent: number, tenures: number[]): LoanResult[] {
  if (tenures.length < 2 || tenures.length > 3) throw new Error("Compare two or three loan terms at a time.");
  if (new Set(tenures).size !== tenures.length) throw new Error("Choose a different tenure for each comparison.");
  return tenures.map(months => calculateLoan(principal, annualRatePercent, months));
}

export type GstMode = "add" | "remove";
export type GstResult = { baseAmount: number; gstAmount: number; totalAmount: number; rate: number; mode: GstMode };

export function calculateGST(amount: number, rate: number, mode: GstMode): GstResult {
  requireRange(amount, "Amount", 0, 1_000_000_000_000);
  requireRange(rate, "GST rate", 0, 100);
  if (mode !== "add" && mode !== "remove") throw new Error("Choose whether to add or remove GST.");
  const amountPaise = toPaise(amount, "Amount");
  // Represent the submitted decimal percentage as an exact ratio before rounding
  // half-paise ties. Number.toString() may use scientific notation for small rates.
  const [mantissa, exponent = "0"] = rate.toString().split("e");
  const [whole, decimals = ""] = mantissa.split(".");
  const scale = decimals.length - Number(exponent);
  const rateNumerator = BigInt(whole + decimals) * 10n ** BigInt(Math.max(0, -scale));
  const percentDenominator = 100n * 10n ** BigInt(Math.max(0, scale));
  const divisor = mode === "add" ? percentDenominator : percentDenominator + rateNumerator;
  const numerator = BigInt(amountPaise) * rateNumerator;
  const taxPaise = Number((2n * numerator + divisor) / (2n * divisor));
  const basePaise = mode === "add" ? amountPaise : amountPaise - taxPaise;
  return { baseAmount: basePaise / 100, gstAmount: taxPaise / 100,
    totalAmount: (basePaise + taxPaise) / 100, rate, mode };
}

export type GstBreakdown = GstResult & { structure: "single" | "split"; cgstAmount: number; sgstAmount: number };

export function calculateGSTBreakdown(amount: number, rate: number, mode: GstMode, structure: "single" | "split"): GstBreakdown {
  const result = calculateGST(amount, rate, mode);
  const splitPaise = structure === "split" ? Math.round(result.gstAmount * 100) : 0;
  return { ...result, structure, cgstAmount: Math.ceil(splitPaise / 2) / 100, sgstAmount: Math.floor(splitPaise / 2) / 100 };
}

export type DateDifference = { days: number; inclusiveDays: number; weeks: number; remainingDays: number; direction: "after" | "before" | "same day" };

export function calculateDateDifference(firstDate: string, secondDate: string): DateDifference {
  const first = parseISODate(firstDate, "first date");
  const second = parseISODate(secondDate, "second date");
  const delta = Math.floor((second.epoch - first.epoch) / DAY_MS);
  const days = Math.abs(delta);
  return { days, inclusiveDays: days + 1, weeks: Math.floor(days / 7), remainingDays: days % 7, direction: delta > 0 ? "after" : delta < 0 ? "before" : "same day" };
}

export function addDaysToDate(dateValue: string, daysToAdd: number): string {
  const date = parseISODate(dateValue);
  requireRange(daysToAdd, "Number of days", -1_000_000, 1_000_000);
  if (!Number.isInteger(daysToAdd)) throw new Error("Number of days must be a whole number.");
  const next = new Date(date.epoch + daysToAdd * DAY_MS);
  const year = next.getUTCFullYear();
  if (year < 1000 || year > 9999) throw new Error("The calculated date must be between years 1000 and 9999.");
  return `${year.toString().padStart(4, "0")}-${(next.getUTCMonth() + 1).toString().padStart(2, "0")}-${next.getUTCDate().toString().padStart(2, "0")}`;
}

export type DiscountResult = { originalPrice: number; savings: number; finalPrice: number; discountPercent: number };

function decimalRatio(value: number): { numerator: bigint; denominator: bigint } {
  const [mantissa, exponentText = "0"] = value.toString().split("e");
  const [whole, decimals = ""] = mantissa.split(".");
  let numerator = BigInt(`${whole}${decimals}`);
  let decimalPlaces = decimals.length - Number(exponentText);
  if (decimalPlaces < 0) {
    numerator *= 10n ** BigInt(-decimalPlaces);
    decimalPlaces = 0;
  }
  return { numerator, denominator: 10n ** BigInt(decimalPlaces) };
}

function roundPositiveRatioHalfUp(numerator: bigint, denominator: bigint): bigint {
  return (2n * numerator + denominator) / (2n * denominator);
}

export function calculateDiscount(price: number, discountPercent: number): DiscountResult {
  requireRange(price, "Original price", 0, 1_000_000_000_000);
  requireRange(discountPercent, "Discount percentage", 0, 100);
  const priceRatio = decimalRatio(price);
  const originalPaise = roundPositiveRatioHalfUp(priceRatio.numerator * 100n, priceRatio.denominator);
  const percentRatio = decimalRatio(discountPercent);
  const savingsPaise = roundPositiveRatioHalfUp(originalPaise * percentRatio.numerator, percentRatio.denominator * 100n);
  const finalPaise = originalPaise - savingsPaise;
  return {
    originalPrice: Number(originalPaise) / 100,
    savings: Number(savingsPaise) / 100,
    finalPrice: Number(finalPaise) / 100,
    discountPercent,
  };
}

export type DiscountPresentation = { originalPriceText: string; savingsText: string; finalPriceText: string; copyText: string };

export function formatDiscountResult(result: DiscountResult): DiscountPresentation {
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  const originalPriceText = currency.format(result.originalPrice);
  const savingsText = currency.format(result.savings);
  const finalPriceText = currency.format(result.finalPrice);
  return {
    originalPriceText,
    savingsText,
    finalPriceText,
    copyText: `Original price: ${originalPriceText}; discount: ${formatValue(result.discountPercent)}%; savings: ${savingsText}; final price: ${finalPriceText}.`,
  };
}

function countGraphemes(text: string): number {
  if (typeof Intl.Segmenter === "function") {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)).length;
  }
  return Array.from(text).length;
}

function countWords(text: string): number {
  if (typeof Intl.Segmenter === "function") {
    let count = 0;
    for (const item of new Intl.Segmenter(undefined, { granularity: "word" }).segment(text)) {
      if (item.isWordLike) count += 1;
    }
    return count;
  }
  return (text.match(/[\p{L}\p{M}\p{N}]+(?:[’'-][\p{L}\p{M}\p{N}]+)*/gu) ?? []).length;
}

export type WordCountResult = { words: number; characters: number; charactersWithoutWhitespace: number; sentences: number; readingMinutes: number };

export function countParagraphs(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.replace(/\r\n?/gu, "\n").split(/\n[\t ]*\n+/u).filter((paragraph) => paragraph.trim().length > 0).length;
}

export function countText(text: string): WordCountResult {
  const words = countWords(text);
  const sentences = text.trim() ? (text.trim().match(/[^.!?]+(?:[.!?]+|$)/gu) ?? []).filter((part) => part.trim()).length : 0;
  return {
    words,
    characters: countGraphemes(text),
    charactersWithoutWhitespace: countGraphemes(text.replace(/\s/gu, "")),
    sentences,
    readingMinutes: words === 0 ? 0 : Math.ceil(words / 200),
  };
}

export type CharacterCountResult = { characters: number; charactersWithoutWhitespace: number; whitespace: number; words: number; lines: number };

export function countCharacters(text: string): CharacterCountResult {
  const whitespace = (text.match(/\s/gu) ?? []).length;
  return {
    characters: countGraphemes(text),
    charactersWithoutWhitespace: countGraphemes(text.replace(/\s/gu, "")),
    whitespace,
    words: countWords(text),
    lines: text.length === 0 ? 0 : text.split(/\r\n|\r|\n/u).length,
  };
}

export type TypingMetrics = { correctWpm: number; rawWpm: number; accuracyPercent: number; correctCharacters: number; typedCharacters: number };

export function calculateTypingMetrics(target: string, typed: string, elapsedSeconds: number): TypingMetrics {
  requireRange(elapsedSeconds, "Elapsed time in seconds", 0, 86_400);
  const targetCharacters = Array.from(target);
  const typedCharacters = Array.from(typed);
  let correctCharacters = 0;
  typedCharacters.forEach((character, index) => {
    if (targetCharacters[index] === character) correctCharacters += 1;
  });
  if (elapsedSeconds === 0 && typedCharacters.length > 0) throw new Error("Elapsed time must be greater than zero when text has been typed.");
  const minutes = elapsedSeconds / 60;
  return {
    correctWpm: minutes === 0 ? 0 : correctCharacters / 5 / minutes,
    rawWpm: minutes === 0 ? 0 : typedCharacters.length / 5 / minutes,
    accuracyPercent: typedCharacters.length === 0 ? 0 : (correctCharacters / typedCharacters.length) * 100,
    correctCharacters,
    typedCharacters: typedCharacters.length,
  };
}

const unitTables = {
  length: { millimetre: 0.001, centimetre: 0.01, metre: 1, kilometre: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 },
  weight: { milligram: 0.000001, gram: 0.001, kilogram: 1, ounce: 0.028349523125, pound: 0.45359237 },
  volume: { millilitre: 0.001, litre: 1, cup: 0.2365882365, pint: 0.473176473, gallon: 3.785411784, imperialGallon: 4.54609 },
} as const;

export type UnitCategory = "length" | "weight" | "temperature" | "volume";
const unitLabels: Record<UnitCategory, Record<string, string>> = {
  length: { millimetre: "Millimetre (mm)", centimetre: "Centimetre (cm)", metre: "Metre (m)", kilometre: "Kilometre (km)", inch: "Inch (in)", foot: "Foot (ft)", yard: "Yard (yd)", mile: "Mile (mi)" },
  weight: { milligram: "Milligram (mg)", gram: "Gram (g)", kilogram: "Kilogram (kg)", ounce: "Ounce (oz)", pound: "Pound (lb)" },
  temperature: { celsius: "Celsius (°C)", fahrenheit: "Fahrenheit (°F)", kelvin: "Kelvin (K)" },
  volume: { millilitre: "Millilitre (mL)", litre: "Litre (L)", cup: "US customary cup", pint: "US liquid pint", gallon: "US liquid gallon", imperialGallon: "Imperial gallon (UK gal)" },
};

export const unitOptions: Record<UnitCategory, { value: string; label: string }[]> = {
  length: Object.entries(unitLabels.length).map(([value, label]) => ({ value, label })),
  weight: Object.entries(unitLabels.weight).map(([value, label]) => ({ value, label })),
  temperature: Object.entries(unitLabels.temperature).map(([value, label]) => ({ value, label })),
  volume: Object.entries(unitLabels.volume).map(([value, label]) => ({ value, label })),
};

export function convertUnit(value: number, category: UnitCategory, from: string, to: string): number {
  requireFinite(value, "Value");
  const allowedUnits = unitOptions[category]?.map((unit) => unit.value) ?? [];
  if (!allowedUnits.includes(from) || !allowedUnits.includes(to)) throw new Error("Choose valid units in the selected category.");
  if (category !== "temperature" && value < 0) throw new Error("This measurement cannot be negative.");

  if (category === "temperature") {
    if ((from === "kelvin" && value < 0) || (from === "celsius" && value < -273.15) || (from === "fahrenheit" && value < -459.67)) {
      throw new Error("Temperature cannot be below absolute zero.");
    }
    let celsius: number;
    if (from === "celsius") celsius = value;
    else if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
    else celsius = value - 273.15;
    if (to === "celsius") return requireFiniteResult(celsius);
    if (to === "fahrenheit") return requireFiniteResult(celsius * (9 / 5) + 32);
    return requireFiniteResult(celsius + 273.15);
  }

  const table = unitTables[category as keyof typeof unitTables] as Record<string, number>;
  const converted = (value * table[from]) / table[to];
  if (!Number.isFinite(converted)) throw new Error("These values are too large to convert safely.");
  return converted;
}

export function validateQrContent(content: string, maxLength = 2000): string {
  const normalized = content.trim();
  if (!normalized) throw new Error("Enter a web address or text to encode.");
  if (normalized.length > maxLength) throw new Error(`QR content must be ${maxLength.toLocaleString("en-US")} characters or fewer.`);
  return normalized;
}

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function validateImageFile(file: { type: string; size: number }, maxBytes = MAX_IMAGE_BYTES): void {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) throw new Error("Choose a JPEG, PNG, or WebP image.");
  if (!Number.isFinite(file.size) || file.size <= 0) throw new Error("Image file must be larger than 0 bytes.");
  if (file.size > maxBytes) {
    const megabytes = maxBytes / (1024 * 1024);
    const sizeLimit = `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
    throw new Error(`Image file size exceeds the ${sizeLimit} limit. Choose a supported image within the ${sizeLimit} file-size limit and the 40-megapixel resolution limit.`);
  }
}

export function formatPercentageResult(mode: PercentageMode, result: PercentageResult): { displayText: string; copyText: string } {
  let displayText: string;
  if (mode === "change") {
    if (result.direction === null) throw new Error("Percentage change result is missing its direction.");
    if (result.direction === "unchanged") {
      displayText = "No change";
    } else {
      const directionLabel = result.direction === "increase" ? "Increase" : "Decrease";
      displayText = `${directionLabel} of ${formatValue(Math.abs(result.value))}%`;
    }
  } else {
    displayText = `${formatValue(result.value)}${mode === "percent-of" ? "" : "%"}`;
  }
  return { displayText, copyText: `${result.label}: ${displayText}.` };
}

export function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

export function formatValue(value: number, maximumSignificantDigits = 8): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits }).format(value);
}

