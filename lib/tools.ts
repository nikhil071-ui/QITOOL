export const toolCategories = [
  { id: "all", label: "All Tools", href: "/tools" },
  { id: "calculators", label: "Calculators", href: "/tools/category/calculators" },
  { id: "text", label: "Text Tools", href: "/tools/category/text" },
  { id: "images", label: "Image Tools", href: "/tools/category/images" },
  { id: "productivity", label: "Productivity", href: "/tools/category/productivity" },
  { id: "converters", label: "Converters", href: "/tools/category/converters" },
] as const;

export type ToolCategoryId = Exclude<(typeof toolCategories)[number]["id"], "all">;

export type ToolInfo = {
  name: string;
  slug: string;
  category: ToolCategoryId;
  description: string;
  icon: "calendar" | "percent" | "heart" | "wallet" | "receipt" | "type" | "scan" | "key" | "ruler" | "image" | "keyboard" | "tag" | "clock" | "landmark";
};

export const tools: ToolInfo[] = [
  { name: "Age Calculator", slug: "age-calculator", category: "calculators", description: "Calculate your exact age in years, months, and days.", icon: "calendar" },
  { name: "Percentage Calculator", slug: "percentage-calculator", category: "calculators", description: "Find a percentage, compare proportions, or calculate a change.", icon: "percent" },
  { name: "BMI Calculator", slug: "bmi-calculator", category: "calculators", description: "Calculate body mass index using metric or imperial units.", icon: "heart" },
  { name: "EMI Calculator", slug: "emi-calculator", category: "calculators", description: "Calculate monthly EMI, total interest, and total payment.", icon: "wallet" },
  { name: "GST Calculator", slug: "gst-calculator", category: "calculators", description: "Add or remove a selectable GST rate from an amount.", icon: "receipt" },
  { name: "Date Calculator", slug: "date-calculator", category: "calculators", description: "Count days between dates or add and subtract calendar days.", icon: "clock" },
  { name: "Discount Calculator", slug: "discount-calculator", category: "calculators", description: "Calculate the savings and final price after a discount.", icon: "tag" },
  { name: "Loan Calculator", slug: "loan-calculator", category: "calculators", description: "Estimate a repayment plan and view its amortization schedule.", icon: "landmark" },
  { name: "Word Counter", slug: "word-counter", category: "text", description: "Count words, characters, sentences, and estimated reading time.", icon: "type" },
  { name: "Character Counter", slug: "character-counter", category: "text", description: "Count visible characters, whitespace, and line breaks accurately.", icon: "type" },
  { name: "QR Code Generator", slug: "qr-code-generator", category: "images", description: "Generate a downloadable QR code from text or a web address.", icon: "scan" },
  { name: "Password Generator", slug: "password-generator", category: "productivity", description: "Generate a random password with the character types you choose.", icon: "key" },
  { name: "Unit Converter", slug: "unit-converter", category: "converters", description: "Convert length, weight, temperature, and volume units.", icon: "ruler" },
  { name: "Image Compressor", slug: "image-compressor", category: "images", description: "Compress an image locally and download a JPEG, PNG, or WebP copy.", icon: "image" },
  { name: "Typing Speed Test", slug: "typing-speed-test", category: "productivity", description: "Measure typing speed and accuracy in a timed local test.", icon: "keyboard" },
];

export const categoryLabels: Record<ToolCategoryId, string> = {
  calculators: "Calculators",
  text: "Text Tools",
  images: "Image Tools",
  productivity: "Productivity",
  converters: "Converters",
};

export const categoryDescriptions: Record<ToolCategoryId, string> = {
  calculators: "Calculate dates, percentages, adult BMI and INR loan payments. Worked examples explain inclusive days, interest and GST.",
  text: "Count words and characters in a draft. Learn how paragraph breaks, whitespace and emoji affect writing limits.",
  images: "Compress JPEG, PNG and WebP images or create a QR code. Compare image dimensions, file size and scan quality.",
  productivity: "Practise typing with a one-minute WPM test or generate a password that meets a site’s length and character rules.",
  converters: "Convert length, mass, temperature and liquid volume. Use the guide to distinguish US and imperial measures.",
};

export const featuredToolSlugs = ["percentage-calculator", "age-calculator", "word-counter", "unit-converter"] as const;

export function filterTools(query: string, category: ToolCategoryId | "all" = "all"): ToolInfo[] {
  const normalizedQuery = query.trim().toLowerCase();
  return tools.filter((tool) => {
    const matchesCategory = category === "all" || tool.category === category;
    const matchesQuery = !normalizedQuery || `${tool.name} ${tool.description} ${categoryLabels[tool.category]}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}
