# Brickwise

AI reviews building inspection images and notes, then drafts an evidence-linked repair list.

For facility managers and building maintenance teams. Brickwise groups repeated defects in photos, reads technician notes and suggests which issues need a qualified inspection first.

## Product workflow

- Buyer: Facility managers & building operators
- Input: Inspection photos, thermal images and technician notes
- AI output: A grouped defect list and draft work orders
- Human action: Create the reviewed work order

An image cannot certify structural or equipment safety. A qualified professional inspects the condition and approves the work.

## Design

**Building intelligence, made practical.** An architectural opening introduces the product, followed by an interactive inspection register, the human review workflow, a working evidence review, and answers to common questions. The shared navigation, footer, and visual system continue across the supporting pages.

Typography: Manrope with Georgia italic accents. Forest green, warm ivory, and soft sage. Styles are in `assets/redesign.css`; mobile navigation enhancements are in `assets/redesign.js`.

Logo: Offset masonry units build a B with an open service passage through the center.

The standalone site contains 24 routed pages (including home/technology aliases) plus its 404 page. Problem, solution, market and combined legal pages join the team, contact, roadmap and policy pages. Three industry photographs and one AI-generated inspection illustration are included locally. The inspection image is labelled as illustrative; its prompt and provenance are in `assets/inspection-ahu-v1.provenance.json`. Source, author, license and modification details are in `assets/image-sources.json`, `assets/editorial-sources.json` and Terms & credits. Font licenses are in `assets/FONT-LICENSES.txt`.

## Try the workspace

Run `npm run dev` (Node and Python 3), then open http://127.0.0.1:8080/. Alternatively, serve this folder with any static HTTP server. No dependency installation or build step is needed. Open Sign in and choose Continue to demo workspace. Sign up and Request access open the contact form. Demo entry does not collect an account password.

Choose a prepared case in the review desk, open its source tabs or image annotation, check each finding, add a reviewer note, and queue or download the brief. Case switching preserves checks and notes during the session. Queued reports remain in browser storage and appear in the workspace’s Reports view. Operational records support creation, notes, status changes, search, filters, sorting and CSV export. Prepared runs make no model request.

## GitHub Pages hosting

Website: [uniqkode.github.io/brickwise](https://uniqkode.github.io/brickwise/).

GitHub Pages publishes the repository root from `main`. Push changes to `main` to update the website. The `.nojekyll` file keeps this buildless static site intact. The optional AI service runs separately; see `deployment/README.md`.

## Azure architecture

- [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview): Keep inspection and follow-up images under a stable building and asset reference. **Planned integration.**
- [Azure Machine Learning](https://learn.microsoft.com/en-us/azure/machine-learning/concept-endpoints-batch?view=azureml-api-2): Run a trained inspection model over new images and group repeated candidate defects. **Planned integration.**
- [Azure OpenAI in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses): Combine image observations and technician notes into a draft repair list. **Connector implemented · configure Azure deployment.**
- [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions): Queue site inspections, track failures and avoid duplicate work orders for the same reviewed issue. **Planned integration.**

The repository includes the optional [server-side Azure OpenAI and OpenAI adapter](service/ai-service.mjs). Azure use requires a deployed compatible model, resource endpoint and server credentials. No Azure resource is connected by the public static site. GitHub Pages cannot execute the server or keep a secret.

## Development roadmap

- **01. Product foundation — Built:** Website, review workspace, source citations, report retention, operational register and downloads are implemented.
- **02. Azure model connection — Ready to configure:** Azure OpenAI connector code and configuration checks are implemented. A deployed model, endpoint and server-side credentials are still required.
- **03. Sector data integration — Planned:** Connect asset-labelled photo uploads and technician notes; evaluate defect grouping before creating operational work orders.
- **04. Reviewed field pilot — Planned:** Have qualified technicians review proposed defects and measure duplicate reports, missed defects and repair follow-ups.
- **05. Production operations — Planned:** Implement verified accounts, organization access, audit history, retention controls, monitoring and measured capacity limits before commercial operation.

## Workload and Azure build architecture

The Technology page describes source reading, asset context, structured findings and the request/batch boundary. The current adapter accepts 1–8 sources, up to four 2 MB images, and 90,000 combined text characters. A response contains 1–8 findings with cited sources.

The confirmed Team and Portfolio allowances are **12,000 and 36,000 inspection images per month**. A 30-day planning average is 400 and 1,200 images/day. These are plan allowances, not actual customer or processing-volume figures.

The build architecture maps Static Web Apps and Container Apps to app/API delivery; Blob Storage and SQL Database to evidence and records; Document Intelligence, Azure OpenAI and AI Search to extraction, analysis and retrieval; Service Bus to queued jobs; and Machine Learning / optional AKS GPU workers to specialist vision. Entra ID, managed identities, Key Vault, Private Link, Monitor, Application Insights and Defender for Cloud form the organizational security and operations design. Service descriptions link to Microsoft documentation on the Technology page.

The user requested this as an architecture to build toward. The site remains hosted on GitHub Pages. The broader Azure integrations, persistent tenant storage, organizational identity and trained vision models remain build milestones.

## Company and contact

Brickwise Ltd. is led by Arinze Precious (CEO) and Kwame Azo (CTO). The public phone number is +2349155500421 and the office address is 31 Admiral Way, Lagos State.

`company-profile.json` holds the company/contact fields, leadership, existing plan prices, optional reporting metrics and access links. `OWNER_SETUP.md` records confirmed values and fields still available for owner-supplied details.

The contact form posts to the owner-supplied Formspree endpoint, and the public phone number remains available. The preferred domain `brickwise.site` and intended `hello@brickwise.site` mailbox are pending, so public email links remain hidden and the site stays on its GitHub Pages address.

## Product walkthrough

The interactive tour introduces inspection review, work-order handling, evidence checks and report exports. Tour records are walkthrough material, and changes are stored on the visitor’s device. Customer workspace access is requested through Brickwise rather than a public password.

## Interactive product tools

The hero’s status counts filter and open the sample inspection register. Search the register by asset, building, reference, or owner, then select a finding to inspect its note. Feature links open the relevant evidence in the review desk.

The review desk includes two prepared cases, source tabs with arrow-key navigation, an illustrative image with a clickable annotation and zoom, source-linked findings, evidence checks, reviewer notes, a progress bar, queuing, and Markdown exports. Every cited source must be opened and checked before a brief can be queued for human review. Downloads include the actual checks, source references, note, and draft or queued status. A fresh check keeps the reviewer note.

Homepage entrances and section reveals use opacity and transforms, run once per section, and honor reduced motion. Keyboard controls respond immediately.

Run `npm test` for review-state, export, and saved-report compatibility checks. No external dependencies are required.

## Independent AI service and deployment

This kit includes its own `service/ai-service.mjs`, product definition and provider configuration. With Node 20+, run `npm run api` from this kit after configuring server-side provider credentials. The adapter accepts only Brickwise requests. See `deployment/README.md` for the Azure Static Web Apps workflow and custom-domain setup; the model service deploys separately.

Company, domain, contact and booking fields are controlled in the complete repository’s [OWNER_SETUP.md](OWNER_SETUP.md). Unverified values remain unpublished.

## Dedicated repository

Prepared destination: `Uniqkode/brickwise`. The homepage and assets are at the repository root. The optional Node model adapter is in `service/`; Azure deployment instructions are in `deployment/`.
