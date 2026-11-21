import type { ToolInfo } from "./tools";
import { typingPassages } from "./typing-test";

export type ToolArticle = {
  seoTitle: string;
  seoDescription: string;
  introduction: string;
  whatItDoes: string;
  instructions: string[];
  example: {
    title: string;
    details: string;
    jumpLabel?: string;
    loanComparison?: { principal: number; annualRatePercent: number; tenures: number[] };
  };
  resultExplanation: string;
  commonMistakes: string[];
  faqs: { question: string; answer: string; link?: { href: string; label: string } }[];
  related: string[];
};

export const toolArticles: Record<string, Omit<ToolArticle, "commonMistakes">> = {
  "age-calculator": {
    seoTitle: "Age Calculator by Date of Birth or Specific Date",
    seoDescription: "Calculate age in years, months and days today or on a selected date. Find a birthday weekday, next birthday countdown, or compare two birth dates.",
    introduction: "Calculate a calendar age today or choose a cutoff date to see how old someone was on that date. For the calendar gap between two people, use the birth-date comparison.",
    whatItDoes: "The calculator compares calendar dates rather than dividing total days by 365. A February 29 birthday uses February 28 as its anniversary in non-leap years. Age on a selected date requires the birth date to be on or before that reference date. Age difference compares the earlier birth date to the later one.",
    instructions: ["Choose current age, age on a selected date, or compare two birth dates.", "Enter the birth date and, for a selected-date calculation, the reference date. The birth date must not be after it.", "Select Calculate and review the calendar age, total days and, for current age, birthday details."],
    example: { title: "A birthday on 14 March 1990", details: "If today were 19 November 2026, the calendar age would be 36 years, 8 months, and 5 days." },
    resultExplanation: "Years and months are completed calendar periods, and remaining days follow those periods. The birthday countdown uses the next calendar anniversary; the tool does not store a birth date or represent a medical or legal age record.",
    faqs: [
      { question: "Does this account for leap years?", answer: "Yes. Date arithmetic uses real calendar month lengths. For a February 29 birthday in a non-leap year, this calculator uses February 28 as the anniversary date." },
      { question: "Can I compare two birth dates?", answer: "Yes. Choose Age difference, enter both dates, and the calculator reports the complete calendar interval and total elapsed days." },
      { question: "Can I calculate age on a specific date?", answer: "Yes. Choose Age on a selected date, enter the birth date and cutoff date, then calculate the completed calendar years, months and days on that date." },
      { question: "How is the birthday countdown calculated?", answer: "It counts whole calendar days until the next anniversary. A leap-day birthday uses February 28 in a non-leap year, matching the age calculation convention shown on this page." },
      { question: "Is my birth date sent to a server?", answer: "No. The calculation runs in this browser and the selected date is not saved by QITOOL." },
    ],
    related: ["date-calculator"],
  },
  "percentage-calculator": {
    seoTitle: "Percentage Calculator for Change and Difference",
    seoDescription: "Find a percentage of a number, a part as a percent, percentage change from a starting value, or percentage difference between two values.",
    introduction: "Choose the question you want to answer. For a test score, compare the part with the whole. For a change in price, put the original price first. Use percentage difference when neither value is the starting point.",
    whatItDoes: "Percent of multiplies the value by the rate and divides by 100. Percentage change divides the signed difference by the starting value. Percentage difference divides the absolute difference by the average magnitude of the two values; two zero values have no defined comparison.",
    instructions: ["Choose the question that matches your calculation.", "Enter the percentage or values in the labeled fields.", "Select Calculate to view and copy the result."],
    example: { title: "What is 15% of 240?", details: "Multiply 240 by 15 and divide by 100. The result is 36." },
    resultExplanation: "The display uses up to eight significant digits. A part or a change is expressed as a percentage. A percentage of an amount has the same unit as that amount. For a negative starting value, interpret the signed ratio together with the direction of the original numbers.",
    faqs: [
      { question: "How do I calculate a percentage of a number?", answer: "Multiply the number by the percentage and divide by 100. For example, 20% of 80 is 80 × 20 ÷ 100 = 16." },
      { question: "Why can't percentage change start at zero?", answer: "Percentage change divides the difference by the starting value. Division by zero has no defined percentage result." },
      { question: "How is percentage difference different from percentage change?", answer: "Percentage difference compares two values against their average magnitude and has no direction. Percentage change uses a starting value as the baseline and measures the signed change relative to that value." },
    ],
    related: ["discount-calculator", "gst-calculator"],
  },
  "bmi-calculator": {
    seoTitle: "Adult BMI Calculator for Kilograms or Pounds",
    seoDescription: "Calculate adult body mass index for adults aged 20 and older using kg and cm or pounds and total inches. See a worked example and rounded screening result.",
    introduction: "This BMI calculator uses adult screening categories for people aged 20 and older only. Choose kilograms and centimetres or pounds and total inches. Children and teenagers need age-specific BMI interpretation.",
    whatItDoes: "BMI is weight in kilograms divided by height in metres squared. For imperial inputs, this tool converts pounds to kilograms and inches to metres before applying the same formula. Its adult screening categories are for people aged 20 and older, not children or teenagers, and do not diagnose health or measure body composition.",
    instructions: ["Choose metric or imperial units.", "Enter weight in kg and height in cm, or weight in lb and height in total inches. For 5 ft 9 in, enter 69 in.", "Select Calculate BMI and read the value and category with the limitations below."],
    example: { title: "A metric example", details: "At 70 kg and 175 cm, BMI is 70 ÷ 1.75², or about 22.9." },
    resultExplanation: "For adults aged 20 and older, the categories use the unrounded BMI: below 18.5, 18.5 to under 25, 25 to under 30, and 30 or above. The displayed BMI is rounded to one decimal place. BMI does not distinguish muscle from fat and should not be used alone to assess health.",
    faqs: [
      { question: "Can BMI diagnose a health condition?", answer: "No. It is a screening measure only. A clinician can interpret it alongside other information and personal circumstances." },
      { question: "Who should not use adult BMI ranges?", answer: "Adult categories are for people aged 20 and older, not children or teenagers, who need age-specific BMI interpretation. Results may also be misleading during pregnancy, for some athletes, and for some older adults. Seek individualized guidance when needed." },
      { question: "How do I enter feet and inches?", answer: "Multiply feet by 12 and add the remaining inches. For example, 5 feet 6 inches is 66 inches. Enter 66 in imperial mode." },
      { question: "Are my measurements stored?", answer: "No. The calculation is performed in the browser and the values are not saved or sent to QITOOL." },
    ],
    related: ["unit-converter"],
  },
  "emi-calculator": {
    seoTitle: "EMI Calculator for India with Tenure Comparison",
    seoDescription: "Estimate monthly EMI, total repayment and interest in Indian rupees. Compare three loan tenures using the same principal and fixed annual rate.",
    introduction: "Enter a loan amount in Indian rupees, a fixed nominal annual rate and three different tenures in months. Compare monthly EMI, total repayment and interest before considering fees or lender terms.",
    whatItDoes: "The calculation uses the standard amortizing-loan formula with the annual nominal rate divided into monthly periods. It assumes a fixed rate, equal monthly instalments, and no fees, taxes, or prepayments. The schedule applies each month’s interest to the remaining balance.",
    instructions: ["Enter the loan principal in rupees and a fixed annual interest rate.", "Enter the main tenure and two different comparison tenures as whole months.", "Select Calculate and compare EMI. Review monthly payments and totals, then use the main tenure's schedule or CSV."],
    example: {
      title: "How does tenure affect the cost of a ₹5,00,000 loan?",
      details: "The principal stays fixed at ₹5,00,000 and the nominal annual rate stays fixed at 9%. A longer tenure lowers the monthly EMI but increases the total interest paid.",
      loanComparison: { principal: 500000, annualRatePercent: 9, tenures: [36, 60, 84] },
    },
    resultExplanation: "The schedule rounds cumulative principal and each month’s interest to whole paise. Monthly amounts can differ by a paise from the displayed EMI. The final row pays the outstanding principal, and totals add up to the scheduled payments. Lenders may use different day-count rules, round instalments, or add charges.",
    faqs: [
      { question: "What does EMI mean?", answer: "EMI means equated monthly instalment: a regular payment that includes both principal repayment and interest." },
      { question: "Does this include fees or a changing rate?", answer: "No. It assumes a fixed annual rate and excludes fees, taxes, insurance, and rate changes." },
      { question: "How do I compare loan tenures?", answer: "Enter three different terms in months. Each result uses the same loan amount and fixed annual rate, so you can compare monthly EMI, total repayment and total interest. Fees, rate changes and prepayments are excluded." },
      { question: "Can I keep the amortization schedule?", answer: "Yes. Download the CSV summary to save the entered terms, totals, and month-by-month payment split for your own review." },
    ],
    related: ["loan-calculator", "gst-calculator"],
  },
  "gst-calculator": {
    seoTitle: "India GST Calculator for Inclusive and Exclusive Prices",
    seoDescription: "Add GST to an INR amount or recover the base from an inclusive total using the rate you supply. See tax and the applicable CGST and SGST split.",
    introduction: "Start with the price on your Indian invoice. Choose whether it already includes GST and enter the rate that you supply for the calculation. The breakdown shows the price before tax, the tax amount and the inclusive total.",
    whatItDoes: "To add GST, multiply the base price by the GST rate divided by 100 and add that tax to the base price. To remove GST, divide the inclusive price by (1 + GST rate / 100) to find the base price. The difference is the GST amount. Use the CGST/SGST split only when it applies to your transaction.",
    instructions: ["Choose Add GST or Remove GST.", "Enter an amount in rupees and paise. Supply the rate that applies to your transaction, using a preset or a custom percentage from 0 to 100.", "Choose a split only when it applies to your transaction, then calculate and review the base, tax, and total."],
    example: {
      jumpLabel: "See how Remove GST works in a reverse GST calculation.",
      title: "Remove 18% GST from ₹590",
      details: "If ₹590 already includes 18% GST, the base price is ₹590 ÷ 1.18 = ₹500. The remaining ₹90 is GST.",
    },
    resultExplanation: "The listed rates are selectable examples, not tax advice. Tax is rounded to the nearest paise, with half a paise rounded up. CGST receives any odd paise and SGST receives the remainder. GST treatment can depend on the goods or services, place of supply, and current rules.",
    faqs: [
      { question: "Are these the right GST rates for every item?", answer: "No. Rates depend on the goods or services and applicable rules. Confirm the correct rate for your specific transaction." },
      { question: "When should I use the CGST and SGST split?", answer: "Use the split display only when an intra-state supply is taxed with CGST and SGST. Cross-state and other cases can have different treatment, so verify the applicable rule." },
    ],
    related: ["percentage-calculator", "discount-calculator"],
  },
  "date-calculator": {
    seoTitle: "Date Calculator for Elapsed and Inclusive Days",
    seoDescription: "Calculate elapsed and inclusive days between two dates, add or subtract whole days, or find a weekday. Compare counts with the start date excluded or both dates included.",
    introduction: "Enter two dates to see both elapsed days, which exclude the start date, and an inclusive count, which counts both dates. You can also add or subtract days or look up a weekday.",
    whatItDoes: "Date difference counts days after the first date up to the second date for elapsed time. The inclusive count includes both endpoint dates, so it is one greater than the elapsed count. Add/subtract mode uses whole integer days and follows Gregorian month lengths and leap years. Weekdays use UTC calendar arithmetic.",
    instructions: ["Choose days between two dates, add or subtract days, or find a weekday.", "For an interval, enter a start and end date. The results show elapsed days and a separate inclusive total.", "Select Calculate to see the counts, direction and weekday details. Use Reset to start over."],
    example: { title: "How many days from 1 January to 10 January?", details: "There are 9 elapsed days when the start date is day zero, or 10 days when both the start and end dates are counted." },
    resultExplanation: "The difference is also shown as full weeks and remaining days. The direction identifies whether the second date is before or after the first, and weekday labels use the Gregorian calendar.",
    faqs: [
      { question: "What is the difference between elapsed and inclusive days?", answer: "Elapsed days exclude the start date. The inclusive count includes both the start and end dates, so it is one greater than the elapsed count, including when both dates are the same." },
      { question: "Does adding days handle leap years?", answer: "Yes. Date arithmetic follows the Gregorian calendar, including February 29 in leap years." },
      { question: "Can I find which weekday a date falls on?", answer: "Yes. Choose Find weekday for a single date, or see weekday names alongside the date interval or calculated future/past date." },
    ],
    related: ["age-calculator"],
  },
  "discount-calculator": {
    seoTitle: "Discount Calculator for Sale Price and Savings",
    seoDescription: "Calculate the final price and savings from a percentage discount in INR. Check a sale price before adding tax, delivery or another offer.",
    introduction: "Enter the price before the offer and the advertised percentage off. The result shows rupees saved and the price left to pay before additional charges.",
    whatItDoes: "Savings equal the original price multiplied by the discount rate. Final price is the original amount minus savings; a 100% discount produces a zero final price.",
    instructions: ["Enter the original price in rupees.", "Enter a discount from 0% to 100%.", "Select Calculate discount to see savings and the final price."],
    example: { title: "20% off ₹2,500", details: "You save ₹500 and pay ₹2,000 before any additional taxes or delivery charges." },
    resultExplanation: "The final price does not include additional taxes, shipping, fees, coupons, or store-specific rounding unless those values are included separately in the original amount.",
    faqs: [
      { question: "How do I check two discounts on the same item?", answer: "Use the first sale price as the second original price. For example, applying 20% and then 10% to ₹1,000 gives ₹800 and then ₹720." },
      { question: "Can a discount be greater than 100%?", answer: "No. A discount above 100% would make the price negative, so this tool accepts values from 0% through 100%." },
      {
        question: "Does the result include GST?",
        answer: "The calculator applies the discount to the price you enter. If GST still needs to be added, first work out the sale price, then",
        link: { href: "/tools/gst-calculator", label: "calculate GST on the discounted price" },
      },
    ],
    related: ["percentage-calculator", "gst-calculator"],
  },
  "loan-calculator": {
    seoTitle: "Loan Amortization Calculator with CSV Schedule",
    seoDescription: "Build a monthly INR repayment schedule for a fixed-rate loan. See principal, interest and remaining balance, then download all monthly rows as CSV.",
    introduction: "Follow a fixed-rate rupee loan from its opening balance to its last payment. Inspect the first twelve monthly rows here and download the full schedule to check a later month.",
    whatItDoes: "This calculator produces a reducing-balance amortization schedule for up to 600 monthly payments. It assumes regular end-of-month payments and no extra payments, fees, or rate changes.",
    instructions: ["Enter the principal, annual interest rate, and repayment term in months.", "Select Calculate repayment plan.", "Review totals and the first twelve monthly schedule rows. Copy the summary or download the complete schedule as CSV."],
    example: { title: "₹3,00,000 at 10% for 36 months", details: "The estimated payment is about ₹9,680 per month. The schedule shows the interest share falling as the outstanding balance decreases." },
    resultExplanation: "Each row uses whole paise. The principal paid to date is rounded at each month, and interest is rounded on that month’s opening balance. The final row clears the balance. A lender’s schedule may differ due to dates, fees, rounding policies, or rate changes.",
    faqs: [
      { question: "How is the schedule calculated?", answer: "Each month, interest is calculated from the remaining balance and monthly rate. The rest of the fixed payment reduces principal." },
      { question: "Can I add extra repayments?", answer: "The schedule models fixed monthly instalments. It does not account for early repayments, penalties, fees, or changing rates." },
    ],
    related: ["emi-calculator", "percentage-calculator"],
  },
  "word-counter": {
    seoTitle: "Word Counter with Paragraphs and Reading Time",
    seoDescription: "Count words, paragraphs, sentences and characters in a draft. Estimate reading time at 200 words per minute and copy the counts without uploading text.",
    introduction: "Paste the part of your draft that counts toward a word limit. The totals update as you edit, alongside a paragraph count and an estimated reading time rounded up to whole minutes.",
    whatItDoes: "Words use Unicode-aware word segmentation when available. Characters are counted as visible graphemes, paragraphs are non-empty text blocks separated by a blank line, and reading time is estimated at 200 words per minute, rounded up for non-empty text.",
    instructions: ["Paste or type text into the editor.", "Review live words, characters, characters without whitespace, sentences, paragraphs, and reading time.", "Copy the summary if needed, or use Clear text to empty the editor."],
    example: { title: "A 400-word article", details: "At the default reading pace of 200 words per minute, the estimated reading time is 2 minutes." },
    resultExplanation: "Word boundaries can vary by language and writing system. A paragraph means a non-empty block separated from the next block by a blank line. The reading-time estimate is a guide; actual speed varies by reader and text difficulty.",
    faqs: [
      { question: "Is my text sent anywhere?", answer: "No. The counter works in the current page and does not save or transmit the text." },
      { question: "How is reading time estimated?", answer: "The counter uses 200 words per minute and rounds up. It is only a rough estimate." },
      { question: "How are sentences counted?", answer: "Sentence counts are estimated from punctuation such as periods, question marks, and exclamation marks. Abbreviations or unusual punctuation can affect the count." },
      { question: "What counts as a paragraph?", answer: "A paragraph is a non-empty block separated from the next block by a blank line. A single line break alone does not start a new paragraph." },
    ],
    related: ["character-counter", "typing-speed-test"],
  },
  "character-counter": {
    seoTitle: "Character Counter With and Without Spaces",
    seoDescription: "Check visible characters, whitespace, words and lines in text. Compare the count with spaces to the count excluding spaces, tabs and line breaks.",
    introduction: "Paste a caption, form entry or message to count its visible characters. Compare the full length with the total after spaces, tabs and line breaks are removed.",
    whatItDoes: "The counter uses Unicode grapheme segmentation when supported. It reports characters with all text, characters excluding whitespace, whitespace characters, words, and lines (including an empty final line after a line break).",
    instructions: ["Type or paste text into the editor.", "Review the live character and line counts.", "Copy the summary or choose Clear text to empty the field."],
    example: { title: "Text with an emoji", details: "In a browser with grapheme segmentation, “Hi 👋” counts as four visible characters, or three without the space. A joined family emoji can also occupy just one visible position." },
    resultExplanation: "“Without whitespace” removes spaces, tabs, and line breaks. Some platforms count characters differently, so compare the same counting convention used by your destination.",
    faqs: [
      { question: "Does an emoji count as one character?", answer: "Most emoji are counted as one visible grapheme, including joined sequences, in browsers that support Intl.Segmenter. A Unicode-aware fallback is used otherwise." },
      { question: "What does without spaces mean here?", answer: "It excludes all whitespace characters, including spaces, tabs, and line breaks." },
    ],
    related: ["word-counter", "typing-speed-test"],
  },
  "qr-code-generator": {
    seoTitle: "QR Code Generator for Text and Links",
    seoDescription: "Create a static QR code for a URL or short text and download a 512-pixel PNG. Scan the result to check the content before printing or sharing.",
    introduction: "Enter the final web address or short message you want someone to scan. Generate a static QR image in your browser, then download the PNG and test it at the size you plan to use.",
    whatItDoes: "The generator encodes text locally using the QR standard and a built-in QR library. A quiet margin and medium error correction are applied for ordinary scanning use.",
    instructions: ["Enter a complete web address or a short message. If a dense or multibyte message will not fit, shorten it and generate again.", "Select Generate QR code.", "Scan the preview or download the PNG. Keep the downloaded image intact so scanners can read it."],
    example: { title: "A small event link", details: "Paste the public event URL, generate its code, then print or share the PNG. Test the downloaded image with a phone before distributing it." },
    resultExplanation: "A QR code stores the entered text; it does not guarantee that a linked website is safe. Check links before opening them and only share QR codes containing information you intend to make public.",
    faqs: [
      { question: "Can I change the link after printing?", answer: "The static image encodes the original address. To use a different address, generate and print a new code. Content hosted at the original address can still change." },
      { question: "Is my QR content uploaded?", answer: "No. QR encoding happens locally in your browser." },
      { question: "Can I encode a password or private note?", answer: "The tool does not upload the text, but anyone who can scan the resulting image can read the encoded content. Do not encode secrets." },
    ],
    related: ["image-compressor", "character-counter"],
  },
  "password-generator": {
    seoTitle: "Random Password Generator with Length Controls",
    seoDescription: "Generate a password of 8 to 128 characters with your choice of letters, digits and symbols. Reveal or copy the result, generated locally with Web Crypto.",
    introduction: "Match the length and allowed characters to the destination site's rules. Generate a fresh password for that account, reveal it if needed and save it before you leave the page.",
    whatItDoes: "The generator uses cryptographically secure random bytes with rejection sampling to avoid modulo bias. It includes at least one character from every selected set, then securely shuffles the result.",
    instructions: ["Choose a length from 8 to 128 characters.", "Select at least one character type and keep any types you need for the target site.", "Select Generate password, then copy it into a trusted password manager. Reset clears the displayed password."],
    example: { title: "A 20-character password", details: "Selecting lowercase, uppercase, numbers, and symbols creates a random 20-character result with at least one of each selected type." },
    resultExplanation: "A longer unique password is generally harder to guess. Save it in a reputable password manager; do not reuse passwords across sites or share the generated result.",
    faqs: [
      { question: "Is the password sent or saved?", answer: "No. It is generated in your browser and is not sent to or stored by QITOOL. The output is masked until you reveal it. Reset clears it from the page." },
      { question: "Why does the tool require Web Crypto?", answer: "Math.random is not designed for secrets. This tool refuses to generate a password when cryptographically secure browser randomness is unavailable." },
    ],
    related: ["qr-code-generator", "character-counter"],
  },
  "unit-converter": {
    seoTitle: "Unit Converter with US and Imperial Gallons",
    seoDescription: "Convert length, weight, temperature and volume, including US liquid and imperial gallons to litres. Select the qualified units to avoid mixing gallon systems.",
    introduction: "Choose the type of measurement first, then select its starting and target units. Volume includes separate US liquid and imperial gallons. Check which system the original label uses.",
    whatItDoes: "Length, mass, and volume are converted through their base-unit factors. Temperature uses offset formulas: °F = (°C × 9/5) + 32, and K = °C + 273.15. This avoids treating temperature like a simple scale multiplier.",
    instructions: ["Choose a measurement category.", "Enter a value and select the units to convert from and to. For gallons, choose US liquid gallon or imperial gallon explicitly.", "Select Convert to view the result. Reset restores the default length example."],
    example: { title: "Convert 1 imperial gallon to litres", details: "One imperial gallon is 4.54609 litres. The US liquid gallon is smaller at 3.785411784 litres." },
    resultExplanation: "Length, mass and volume use their stated conversion factors, while temperature conversions account for offset. Results show up to eight significant digits, so the displayed result may be rounded from the full conversion value.",
    faqs: [
      { question: "What is the difference between a US and an imperial gallon?", answer: "US liquid and imperial gallons are separate units with different sizes. Select the system stated on the source label; the calculator keeps those choices distinct." },
      { question: "Why is Kelvin conversion different?", answer: "One kelvin is the same size as one degree Celsius. The zero points differ, so 0 °C equals 273.15 K. Fahrenheit also uses a different degree size." },
    ],
    related: ["bmi-calculator"],
  },
  "image-compressor": {
    seoTitle: "Image Compressor for JPEG, PNG and WebP",
    seoDescription: "Resize a local image, choose JPEG, PNG or WebP output, and compare the file size before downloading. Adjust quality or dimensions to fit an upload limit.",
    introduction: "Choose an image from your device, pick the longest edge you need and compare the new file with the original. The preview and byte counts help you decide whether to lower the quality or resize again.",
    whatItDoes: "The compressor accepts local JPEG, PNG, and WebP images up to 20 MB and 40 megapixels, resizes them in a browser canvas, and exports with the requested supported MIME type. JPEG and WebP use the quality control; PNG is lossless and may not become smaller for every image.",
    instructions: ["Choose a JPEG, PNG, or WebP image no larger than 20 MB and 40 megapixels.", "Select an output type and quality for JPEG/WebP. PNG preserves transparency but does not use a lossy quality setting.", "Select Compress image, compare the preview and file sizes, then download if the result suits your needs."],
    example: { title: "A large photo for a web page", details: "A 4,000 × 3,000 photo exported with a 2,000-pixel longest edge becomes 2,000 × 1,500. Check the encoded file size and small details before replacing the original." },
    resultExplanation: "Compression can reduce detail, especially at low JPEG/WebP quality. PNG is lossless. Browser support for WebP output varies; if an encoder is unavailable, choose JPEG or PNG.",
    faqs: [
      { question: "Are images uploaded?", answer: "No. Decoding, previewing, and encoding happen on your device." },
      { question: "Why can a PNG become larger?", answer: "PNG is lossless and some photographs do not compress well as PNG. Choose WebP or JPEG for photographic images when transparency is not required." },
      { question: "Does JPEG keep transparency?", answer: "No. Transparent pixels are flattened onto a white background when converting to JPEG." },
    ],
    related: ["qr-code-generator"],
  },
  "typing-speed-test": {
    seoTitle: "One-Minute Typing Speed Test with WPM and Accuracy",
    seoDescription: "Type a practice passage for up to 60 seconds. See correct WPM, raw WPM and character accuracy, then restart with a fresh passage.",
    introduction: "Start the timer and type the displayed passage, including spaces and punctuation. When time runs out or you reach the passage length, compare your correct words per minute with your raw speed.",
    whatItDoes: "Correct words per minute uses the common five-character word convention. Accuracy is the fraction of typed characters that match the passage at the same position; the raw speed is also shown so errors are not hidden.",
    instructions: ["Select Start test; the first start uses the initially displayed passage, and each later start cycles to a fresh passage.", "Focus the typing field and type the passage, including its punctuation and spaces.", "When the passage or 60-second timer ends, review speed and accuracy. Select Start again for a fresh passage or Reset to clear the current attempt."],
    example: {
      title: "Score a timed excerpt of the first passage",
      details: `On initial page load, the first test uses this passage: “${typingPassages[0]}” If you type its first 125 characters by the end of the full 60-second timer and 120 match at the same positions, raw WPM is 25 (125 ÷ 5 ÷ 1 minute), correct WPM is 24 (120 ÷ 5 ÷ 1 minute), and accuracy is 96% (120 ÷ 125).`,
    },
    resultExplanation: "Scores are practice estimates, not a standardized certification. Keyboard layout, language, passage difficulty, and test duration affect comparisons.",
    faqs: [
      { question: "How is WPM calculated?", answer: "Correct characters are divided by five and then divided by elapsed minutes. Raw WPM uses all typed characters in the same way." },
      { question: "Are my keystrokes recorded?", answer: "No. Typing is measured in the current page only and is not saved or sent to QITOOL." },
    ],
    related: ["word-counter", "character-counter"],
  },
};

const commonMistakesByTool: Record<string, string[]> = {
  "age-calculator": [
    "Using today’s age for a past milestone. To measure an interval ending on another date in the past, compare the two dates.",
    "Treating an age difference as a difference between rounded ages; compare the complete dates to keep the remaining months and days.",
  ],
  "percentage-calculator": [
    "Using the new value as the percentage-change baseline; change is measured relative to the starting value.",
    "Confusing percentage points with percent change; a move from 10% to 15% is 5 percentage points and a 50% relative increase.",
  ],
  "bmi-calculator": [
    "Entering pounds into the kilogram field or inches into the centimetre field; confirm the unit mode before calculating.",
    "Treating the adult screening category as a diagnosis; BMI does not describe body composition or individual health.",
  ],
  "emi-calculator": [
    "Entering an interest rate per month when the field asks for an annual percentage rate.",
    "Comparing the estimate with a lender quote without accounting for fees, insurance, payment dates, or rate changes.",
  ],
  "gst-calculator": [
    "Removing GST by subtracting the rate percentage from a tax-inclusive total; use the inclusive-price formula instead.",
    "Selecting a rate or CGST/SGST split without checking the goods, service, and place-of-supply rules for the transaction.",
  ],
  "date-calculator": [
    "Assuming the start date is included in an elapsed-day result; this calculator treats it as day zero.",
    "Entering a fractional number of days; date arithmetic accepts whole calendar days only.",
  ],
  "discount-calculator": [
    "Applying a discount to the wrong original price when an item already has a sale price.",
    "Assuming the final price includes tax, shipping, or additional offers; those amounts are outside this calculation.",
  ],
  "loan-calculator": [
    "Assuming an estimate includes lender fees or changing interest rates; the schedule models a fixed rate and regular payments.",
    "Reading the first payment's principal and interest split as constant; the balance and interest portion change each month.",
  ],
  "word-counter": [
    "Expecting every language or platform to use identical word boundaries; Unicode word segmentation can differ by writing system.",
    "Treating reading time as a promise; it is a rough estimate based on the displayed words-per-minute assumption.",
  ],
  "character-counter": [
    "Assuming a social network or form uses the same character rules; destinations may count line breaks, emoji, or URLs differently.",
    "Forgetting that “without whitespace” also removes tabs and line breaks, not just ordinary spaces.",
  ],
  "qr-code-generator": [
    "Sharing a QR code before scanning the downloaded image; verify the code and its destination on a second device.",
    "Putting passwords or private notes in a QR image; anyone who can scan it can read the encoded text.",
  ],
  "password-generator": [
    "Reusing one generated password across sites; create a unique password for each account.",
    "Leaving the result visible or copying it on a shared device; clear it and save it in a trusted password manager.",
  ],
  "unit-converter": [
    "Choosing a similar-sounding unit from the wrong category, such as fluid volume instead of mass.",
    "Rounding an intermediate value too early; use the displayed precision for the final result and retain units in notes.",
  ],
  "image-compressor": [
    "Reducing quality without checking the preview; compare detail and file size before downloading.",
    "Choosing JPEG for an image that needs transparency; JPEG flattens transparent areas.",
  ],
  "typing-speed-test": [
    "Pasting the passage instead of typing it; the score is intended to reflect keystrokes entered during the timed test.",
    "Comparing WPM across different passage lengths, languages, or test durations as if they were identical conditions.",
  ],
};

export function getToolArticle(tool: ToolInfo): ToolArticle {
  const article = toolArticles[tool.slug];
  if (!article) throw new Error(`Missing article content for ${tool.slug}`);
  const commonMistakes = commonMistakesByTool[tool.slug];
  if (!commonMistakes) throw new Error(`Missing common-mistakes content for ${tool.slug}`);
  return { ...article, commonMistakes };
}
