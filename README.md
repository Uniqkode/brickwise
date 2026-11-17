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

**Building intelligence, made practical.** An architectural opening introduces the product, followed by a live sample inspection register, the human review workflow, a working evidence review, and answers to common questions. The shared navigation, footer, and visual system continue across the supporting pages.

Typography: Manrope with Georgia italic accents. Forest green, warm ivory, and soft sage. Styles are in `assets/redesign.css`; mobile navigation enhancements are in `assets/redesign.js`.

Logo: Offset masonry units build a B with an open service passage through the center.

The standalone site contains 24 routed pages (including home/technology aliases) plus its 404 page. Problem, solution, market and combined legal pages join the team, contact, roadmap and policy pages. Three industry photographs and one AI-generated sample inspection image are included locally. The sample image is labelled as illustrative; its prompt and provenance are in `assets/inspection-ahu-v1.provenance.json`. Source, author, license and modification details are in `assets/image-sources.json`, `assets/editorial-sources.json` and Terms & credits. Font licenses are in `assets/FONT-LICENSES.txt`.

## Try the workspace

Run `npm run dev` (Node and Python 3), then open http://127.0.0.1:8080/. Alternatively, serve this folder with any static HTTP server. No dependency installation or build step is needed. Use `demo@brickwise.example` and `MVPdemo2026!`, or the one-click sample workspace. This is public demo access, not production authentication.

Choose a prepared case in the review desk, open its source tabs or image annotation, check each finding, add a reviewer note, and queue or download the brief. Case switching preserves checks and notes during the session. Queued reports remain in browser storage and appear in the workspace’s Reports view. Operational records support creation, notes, status changes, search, filters, sorting and CSV export. Prepared runs make no model request.

## GitHub Pages hosting

Website: [uniqkode.github.io/brickwise](https://uniqkode.github.io/brickwise/).

GitHub Pages publishes the repository root from `main`. Push changes to `main` to update the website. The `.nojekyll` file keeps this buildless static site intact. The optional AI service runs separately; see `deployment/README.md`.

## Azure architecture

- [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview): Keep inspection and follow-up images under a stable building and asset reference. **Planned integration.**
- [Azure Machine Learning](https://learn.microsoft.com/en-us/azure/machine-learning/concept-endpoints-batch?view=azureml-api-2): Run a trained inspection model over new images and group repeated candidate defects. **Planned integration.**
- [Azure OpenAI in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses): Combine image observations and technician notes into a draft repair list. **Connector implemented · configure Azure deployment.**
- [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions): Queue site inspections, track failures and avoid duplicate work orders for the same reviewed issue. **Planned integration.**

The repository includes the optional [server-side Azure OpenAI and OpenAI adapter](https://github.com/Uniqkode/b2b-product-studio/blob/main/server/README.md). Azure use requires a deployed compatible model, resource endpoint and server credentials. No Azure resource is connected by the public static site. GitHub Pages cannot execute the server or keep a secret.

## Development roadmap

- **01. Product foundation — Built:** Website, review workspace, source citations, report retention, operational register and downloads are implemented.
- **02. Azure model connection — Ready to configure:** Azure OpenAI connector code and configuration checks are implemented. A deployed model, endpoint and server-side credentials are still required.
- **03. Sector data integration — Planned:** Connect asset-labelled photo uploads and technician notes; evaluate defect grouping before creating operational work orders.
- **04. Reviewed field pilot — Planned:** Have qualified technicians review proposed defects and measure duplicate reports, missed defects and repair follow-ups.
- **05. Production operations — Planned:** Implement verified accounts, organization access, audit history, retention controls, monitoring and measured capacity limits before commercial operation.

## Workload planning

65 hypothetical organizations × 12 buildings per operator × 2 surveys per building / month × 180 images per survey = **280,800 inspection images per month**.

The model reviews fresh inspection imagery across a property portfolio and compares follow-up photos with the original defect record.

These assumptions do not establish actual customers, Azure consumption or model accuracy.

## Company details and contact

The team page identifies the public repository maintainer, Precious Arinze / Uniqkode, with a short implementation bio. The enquiry form prepares a message for review and final submission on GitHub, or through a verified email when configured. A separate local project brief can be saved and downloaded.

Legal names and RC numbers are managed in `src/company-profiles.json` in the complete repository. Registration is unpublished unless the record has `registrationVerified: true`, a genuine legal name and RC number, and an evidence reference. Do not use placeholder registrations in applications.

## Current scope

Prepared operational cases use sample data. Browser-local edits and reports are not shared between users. Connected analysis sends entered material only when explicitly run. Shared accounts, sector ingestion, OCR, trained vision/forecast models, retention and production monitoring remain work described by the roadmap.

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
