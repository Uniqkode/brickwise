# Brickwise business profile

Public business details are maintained in `company-profile.json`. Pages read this file through `assets/business-profile.js`; no build step is required.

## Confirmed details

- Company: Brickwise Ltd.
- Phone: +2349155500421
- Office: 31 Admiral Way, Lagos State
- CEO: Arinze Precious
- CTO: Kwame Azo
- Access flow: Sign in opens the email/password screen with a prefilled public demo account. Sign up and Request access open Contact us; the phone number remains available alongside the Formspree contact form.
- Pricing: Team US$49/month; Portfolio US$499/month; Enterprise custom. Annual billing is 20% below the equivalent monthly total (US$470.40/year and US$4,790.40/year). Team includes 12,000 images/month and 15 users; Portfolio includes 36,000 images/month and 15 users. Extra usage is quoted individually.

## Domain and email

The preferred domain is `brickwise.site`, pending registration. Keep `domainReady: false` until it is registered and configured. The published site remains at https://uniqkode.github.io/brickwise/. Do not add a CNAME or change canonical URLs before the domain is ready.

The intended email is `hello@brickwise.site`. The owner selected phone-only contact while the mailbox is unavailable. Keep `emailEnabled: false` until the mailbox receives enquiries. In this state the public site shows phone contact and hides email links. The contact form uses Formspree independently of this mailbox.

## Contact form

The form is connected to the owner-supplied endpoint `https://formspree.io/f/mwlobrkb`. `contactFormEndpoint` and the static `action` on `contact/index.html` use the same URL. The submit button also works without JavaScript. The form posts directly to Formspree using native HTML validation; no enquiry is saved to browser storage. If the configured endpoint is removed or invalid, JavaScript disables submission and displays the phone contact instead. Update both the JSON and the static form action together when changing providers or form IDs.

## Additional fields ready for actual values

- `rcNumber`: company registration number, if it should be published.
- `bookingUrl`: the actual HTTPS appointment link, if used.
- `workspaceUrl` / `signupUrl`: the real customer access destinations. Until supplied, access requests go to the contact page.
- `operatingHours`: public office hours.
- `team[].bio`, `team[].profileUrl`, `team[].portrait`: actual biographies, professional links and portraits. The CTO currently uses initials rather than a fabricated portrait.
- `usage`: actual organization/building/processed-record counts with a reporting date and source. No usage block is published without reporting information.
- `testimonials`, `customerLogos`, `inspectionCases`: approved customer material and publicly shareable inspections. Do not publish invented customer endorsements or treat product-tour inspections as customer work.

The homepage’s company/leadership and pricing sections, contact details, request-access page and public business fields are restored. Missing optional values remain hidden.

## Running and checking

- `npm run dev`: local website at http://127.0.0.1:8080/
- `npm test`: review-state and export checks
- Push changes to `main` to publish through GitHub Pages.

The product tour remains clearly identified as a walkthrough. It does not authenticate customer accounts. Node analysis-service configuration remains in `service/` and `deployment/`; provider credentials belong on the server.

## Demo sign-in

The sign-in screen checks its prefilled public demo credentials locally and opens the demo workspace. Credentials are not sent to Formspree, an AI service or an identity provider, and are not retained in the session. Organizational authentication remains part of the Entra ID build plan. The card has one Sign in button and one Sign up link to Contact us.

## Website content and workload architecture

The owner supplied Master prompt.docx as a content brief and asked to preserve the current UI. Its example customer counts, throughput, uptime, prices, founder biographies and appointment URLs are not confirmed Brickwise facts. The owner requested Azure services suited to the idea as the architecture to build toward.

The homepage links to the AI workload; Technology covers image/document inputs, structured findings, batch boundaries, confirmed plan allowances, Azure service roles and source documentation. Product capabilities, security controls and the build roadmap use existing site components. The workload content update reused existing styles, scripts and artwork. The later sign-in update adds local demo credential checks; approved business, pricing and contact values remain unchanged.

Keep the wider Azure stack identified as the build architecture until the deployed services are verified. Publish usage only after supplying a measured count, reporting date and source in `company-profile.json`. Current plan allowances describe included images, not completed processing volume.
