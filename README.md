# QITOOL

A responsive collection of free browser-based calculators, text tools, converters, and utilities built with Next.js App Router.

## Start locally

1. Use Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS production origin before publishing. The default public inbox is `contact@qitool.tech`.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL printed by Next.js.

## Project map

- `app/` - App Router pages, tool routes, metadata, sitemap, and robots rules.
- `components/` - shared navigation, footer, tool catalog, article content, and tool interfaces.
- `lib/` - typed tool catalog, calculation functions, password generation, and local image processing.
- `tests/` - Node test suites for calculations and utility validation.
- `public/` - supplied QITOOL logos, browser icons, and social sharing artwork.

The supplied QITOOL logos are used in the header, homepage, and footer. Browser icons are served from the public assets and referenced by App Router metadata.

## Tools

The site includes age, percentage, BMI, EMI, GST, date, discount, and loan calculators; word and character counters; a typing speed test; local QR and secure password generators; a unit converter; and an image compressor.

Each tool route provides its own title and description, instructions, example, explanation, FAQs, related links, validation, and reset action. Text, passwords, QR content, and uploaded images are processed in the browser; there is no account or tool-processing backend.

Every public route has unique title and description metadata, Open Graph/Twitter metadata, and a canonical URL when `NEXT_PUBLIC_SITE_URL` is configured. `app/sitemap.ts` builds the XML sitemap from the tool catalog and public routes. `app/robots.ts` allows public crawling and points crawlers to the sitemap when the production origin is configured. Without a real origin, canonical tags are omitted and the sitemap has no URL entries rather than publishing a fabricated host. The 404 route is intentionally marked noindex; public pages are indexable.

The homepage publishes `WebSite` and `Organization` JSON-LD; pages with visible breadcrumbs publish matching `BreadcrumbList` data. JSON-LD is omitted until a canonical production origin is configured. Each free browser tool publishes a WebApplication entity with its visible name and introduction, linked to the site and publisher. The five category pages contain worked guides with links to the relevant tools.

The application sets a restrictive Content Security Policy and baseline browser security headers. The policy allows inline scripts needed by the statically rendered Next.js application, while limiting executable code and connections to the same origin. Update the policy deliberately before adding external analytics or advertising code.

## Checks

- `npm run typecheck` - TypeScript validation.
- `npm run lint` - ESLint.
- `npm test` - calculation and utility tests.
- `npm run build` - production build.

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the chosen domain; it supplies canonical metadata, sitemap URLs, and the robots sitemap reference.
- About and Contact use `contact@qitool.tech` by default. To change the published inbox, set `NEXT_PUBLIC_CONTACT_EMAIL`, rebuild and check both mail links.
- About and Terms identify Nikhil Chaudhary as publisher. To change this name, set `NEXT_PUBLIC_PUBLISHER_NAME` and rebuild.
- Identify the production hosting/CDN provider and update the privacy policy with its actual request-log, retention, and cookie practices.
- Review legal copy for the operating jurisdiction and final services/data flows.
- Review the privacy policy and consent behavior before enabling the optional analytics integration or adding any other third-party service. The GA4 tag remains blocked until an explicit opt-in.
- Optional GA4 integration: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the real measurement ID. The Google tag is not downloaded until a visitor opts in through the analytics notice. The choice is stored in browser local storage and can be changed from the footer. Review consent and privacy requirements for the deployment’s jurisdictions before enabling it.
- Verify browser-based image compression in the browsers you plan to support.
- Add advertisements only after the site has been approved by the advertising provider.

## Google Search Console

1. Deploy to the real HTTPS domain after setting `NEXT_PUBLIC_SITE_URL` in the hosting environment, then rebuild and redeploy so canonical URLs, JSON-LD, and sitemap entries use that origin.
2. Add the site in Google Search Console. A Domain property can be verified with the DNS record Search Console provides; a URL-prefix property offers other verification methods.
3. Submit the deployed `/sitemap.xml` URL in Search Console’s Sitemaps report.
4. Use URL Inspection on the homepage and a few tool pages to check crawl access, canonical selection, and rendered content. Request indexing if appropriate. Google decides whether and when pages are indexed; deployment and sitemap submission do not guarantee indexing.
