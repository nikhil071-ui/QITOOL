import type { ToolCategoryId } from "./tools";

type Lesson = {
  id: string;
  title: string;
  paragraphs: string[];
  tools: { slug: string; label: string }[];
  source?: { url: string; label: string };
};

export const categoryGuides: Record<ToolCategoryId, Lesson[]> = {
  calculators: [
    {
      id: "calendar-age", title: "Why age in months differs from elapsed days",
      paragraphs: [
        "Imagine two babies born on 1 February and 1 March 2024. Their birthdays are one calendar month apart, but the gap is 29 days. Use completed years and months for a birthday milestone and total elapsed days when the length of the interval matters.",
        "To compare siblings, enter both birth dates in the age-difference mode. Subtracting their ages rounded to whole years loses the months between birthdays. To check an age cutoff, use the selected-date mode and enter the date printed on the notice. For a 29 February birth, QITOOL uses 28 February as the anniversary in a non-leap year. A form that asks for eligibility on an official cutoff date can follow its own rule.",
      ],
      tools: [{ slug: "age-calculator", label: "Calculate age on a cutoff date or compare two birth dates" }],
    },
    {
      id: "counting-days", title: "Count elapsed days or include both dates",
      paragraphs: [
        "A room booked from 28 February to 1 March 2024 spans two nights. There are three dates on the calendar if you attend an event on arrival day, leap day and departure day. The same two inputs answer different questions depending on whether you include both endpoints.",
        "QITOOL shows elapsed days, which exclude the start date, and an inclusive count, which counts both entered dates. The inclusive count is one more than elapsed days even when both inputs are the same day. To find the date two weeks after a milestone, use add-days mode with 14. Weekends and public holidays count, so a deadline expressed in working days needs a separate holiday calendar.",
      ],
      tools: [{ slug: "date-calculator", label: "Find the days between two dates" }],
    },
    {
      id: "percentage-baselines", title: "Choose the base before calculating a percentage",
      paragraphs: [
        "A price falls from 80 to 60. The saving is 20, and the starting price is 80, so the discount is 25%. Returning from 60 to 80 takes an increase of about 33.33%. Both calculations use the same price difference but divide by different starting values.",
        "For a share such as 18 correct answers out of 24, divide the part by the whole to get 75%. For a rate moving from 10% to 15%, the gap is five percentage points and the relative increase is 50%. With successive discounts, apply the second percentage to the reduced price: 20% off followed by 10% off turns 100 into 72.",
      ],
      tools: [{ slug: "percentage-calculator", label: "Compare a share and a percentage change" }, { slug: "discount-calculator", label: "Calculate a discounted price in rupees" }],
    },
    {
      id: "reading-an-emi", title: "Read an EMI alongside the repayment schedule",
      paragraphs: [
        "On a ₹1,20,000 loan at a nominal 12% per year, the first month’s interest is ₹1,200: the monthly rate is 1% of the opening balance. Subtract that interest from the first instalment to find the principal repaid. The next month uses the reduced balance.",
        "To compare tenures in QITOOL, keep principal and annual rate fixed, enter three different month counts in the EMI Calculator, and compare monthly EMI, total repayment and total interest. Its monthly schedule and CSV use the main tenure. The Loan Calculator exports a separate month-by-month schedule when you want to inspect the balance after a particular payment. Both tools use INR, end-of-month payments and a fixed rate. Fees, taxes, insurance, rate changes and prepayments are excluded, so a quote with different terms needs a like-for-like comparison.",
      ],
      tools: [{ slug: "emi-calculator", label: "Estimate a monthly EMI in INR" }, { slug: "loan-calculator", label: "Download a loan amortization schedule" }],
    },
    {
      id: "gst-inclusive-price", title: "Recover the tax inside a GST-inclusive price",
      paragraphs: [
        "If the user-supplied rate for an Indian invoice is 18%, a ₹590 inclusive price represents 118% of the base. Calculate ₹590 × 100 ÷ 118 = ₹500, leaving ₹90 of GST. Taking 18% of ₹590 would give ₹106.20 because that calculation taxes the inclusive amount again.",
        "Use the confirmed rate for the supply and its date. Enter a custom percentage if the preset list does not contain it. When the CGST and SGST split applies, the ₹90 example gives ₹45 each. For an odd number of paise, this estimator assigns the extra paise to CGST. Check the actual invoice rules when reconciling a filing. The Canadian and Australian tax systems have their own rules despite sharing the term GST.",
      ],
      tools: [{ slug: "gst-calculator", label: "Extract GST from an INR total" }],
      source: { url: "https://www.gstcouncil.gov.in/cgst-rate-notification", label: "GST Council rate notifications" },
    },
    {
      id: "bmi-measurements", title: "Prepare height and weight for adult BMI",
      paragraphs: [
        "For a height of 1.75 metres, enter 175 in the centimetre field. At 70 kilograms, the calculation is 70 divided by 1.75 squared, or about 22.9. In imperial mode, 5 feet 9 inches goes into the height field as 69 total inches. A weight of 11 stone goes into the pounds field as 154.",
        "The category uses the unrounded number and the display shows one decimal place. A rounded value close to a cutoff can therefore look like the next category. BMI is one screening measure for adults. Children and teens need age-specific interpretation, and a clinician can consider factors such as muscle mass alongside the result.",
      ],
      tools: [{ slug: "bmi-calculator", label: "Calculate adult BMI in metric or imperial units" }],
      source: { url: "https://www.cdc.gov/bmi/adult-calculator/", label: "CDC adult BMI screening guidance" },
    },
  ],
  text: [{
    id: "word-and-character-limits", title: "Check an essay limit and a character limit separately",
    paragraphs: [
      "The phrase “red fox” has two words and seven visible characters including its space. An essay with a 500-word limit and a form with a 500-character limit allow very different amounts of text. For an essay, paste only the material the submission rules include. A bibliography or title can change the count even when the body has stayed the same.",
      "For a character limit, compare the totals with and without whitespace. Tabs and line breaks also occupy space. A joined emoji can look like one symbol while an external form counts several underlying units. Check the final draft in the destination field when a hard limit matters.",
      "Reading time is a separate estimate. At the tool’s 200 words per minute, a 401-word draft rounds up to three minutes. That is a reading estimate for planning, not a measured time for delivering a speech.",
    ],
    tools: [{ slug: "word-counter", label: "Count an essay and estimate reading time" }, { slug: "character-counter", label: "Check a character allowance with spaces" }],
  }],
  images: [
    {
      id: "compress-to-a-size-limit", title: "Reduce an image to fit an upload limit",
      paragraphs: [
        "Start by checking the dimensions the destination needs. A 4000 × 3000 photo resized to a 2000-pixel longest edge becomes 2000 × 1500. That leaves one quarter as many pixels. The encoded file size depends on detail and format, so the byte count will usually change by a different proportion.",
        "For a photograph, try JPEG or WebP at the desired dimensions, compare the output size to the upload limit, and zoom in on faces and text. If the file is still too large, lower quality or choose a smaller edge and compare again. For a transparent logo, try PNG or WebP. JPEG fills transparent pixels with white. Keep the original available until the destination accepts the new file.",
      ],
      tools: [{ slug: "image-compressor", label: "Resize and compress a JPEG, PNG or WebP" }],
    },
    {
      id: "print-a-qr-code", title: "Check a QR code at its final print size",
      paragraphs: [
        "Generate the PNG from the exact link you intend to share. Scan the downloaded image, then scan a sample printed at the intended size. Keep the light margin around the square and avoid stretching the image on one axis. Recheck the destination after each edit to the encoded text.",
      ],
      tools: [{ slug: "qr-code-generator", label: "Generate a static QR code as a PNG" }],
    },
  ],
  productivity: [
    {
      id: "compare-typing-attempts", title: "Read typing speed and accuracy together",
      paragraphs: [
        "For one minute of typing, 150 typed characters give 30 raw WPM with a five-character word. If 135 characters match their passage positions, correct speed is 27 WPM and accuracy is 90%. Recording both tells you whether the next practice session should focus on speed or on reducing errors.",
        "Compare attempts on the same keyboard and type the passage yourself. A run can end when you reach the passage length, so compare the elapsed time as well as the score. Spaces and punctuation affect accuracy.",
      ],
      tools: [{ slug: "typing-speed-test", label: "Try the one-minute typing speed test" }],
    },
    {
      id: "password-site-rules", title: "Generate a password that fits a site’s rules",
      paragraphs: [
        "Check the destination’s length and character requirements first. If it accepts a 24-character password but excludes symbols, choose that length and the uppercase, lowercase and number groups. Each selected group contributes a character. Save the new password in your password manager before leaving the page.",
      ],
      tools: [{ slug: "password-generator", label: "Generate a random password with selected character groups" }],
    },
  ],
  converters: [{
    id: "choose-the-unit", title: "Identify the gallon, cup or temperature scale first",
    paragraphs: [
        "A label reading “1 gallon” needs a unit system. Choose US liquid gallon for 3.785411784 litres or imperial gallon for 4.54609 litres. Choosing the US option for an imperial quantity understates the volume. For a recipe that defines its metric cup as 250 mL, enter 250 millilitres per cup instead of choosing the US customary cup.",
      "Temperature has an offset as well as a scale factor. For an absolute temperature, 20 °C converts to 68 °F; a 20-degree Celsius increase corresponds to a 36-degree Fahrenheit increase. Use this converter for the absolute readings. Keep the original precision through the calculation and round once for the final label.",
    ],
    tools: [{ slug: "unit-converter", label: "Convert litres, US gallons, distance and temperature" }],
    source: { url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9", label: "NIST conversion factors by unit" },
  }],
};
