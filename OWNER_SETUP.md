# Brickwise business profile

Public business details are maintained in `company-profile.json`. Pages read this file through `assets/business-profile.js`; no build step is required.

## Confirmed details

- Company: Brickwise Ltd.
- Phone: +2349155500421
- Office: 31 Admiral Way, Lagos State
- CEO: Arinze Precious
- CTO: Kwame Azo
- Access flow: Request access by phone
- Pricing: Team US$49/month; Portfolio US$499/month; Enterprise custom. Annual billing is 20% below the equivalent monthly total (US$470.40/year and US$4,790.40/year). Team includes 12,000 images/month and 15 users; Portfolio includes 36,000 images/month and 15 users. Extra usage is quoted individually.

## Domain and email

The preferred domain is `brickwise.site`, pending registration. Keep `domainReady: false` until it is registered and configured. The published site remains at https://uniqkode.github.io/brickwise/. Do not add a CNAME or change canonical URLs before the domain is ready.

The intended email is `hello@brickwise.site`. The owner selected phone-only contact while the mailbox is unavailable. Keep `emailEnabled: false` until the mailbox receives enquiries. In this state the public site shows phone contact, hides email links and uses a call-led access flow. The email enquiry form and its name, work email, phone, company, role, portfolio-size and message fields remain ready for activation.

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
