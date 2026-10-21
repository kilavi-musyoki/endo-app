# Documentation index

These documents are a draft planning baseline derived from the project plan and discussion. A local interactive prototype now exists in `src/`; it uses browser `localStorage` and synthetic demo data and is not a production health-data system. Architecture, API, and deployment documents remain proposals. **TBD** means a decision or qualified review is still needed.

## Product planning

For a consolidated description of the interactive prototype’s current screens, fields, calculations, storage behavior, and limitations, see the [App guide](../APP_GUIDE.md).

1. [Product requirements](01-product-requirements.md)
2. [User stories and use cases](02-user-stories-use-cases.md)
3. [User flows and journey](03-user-flows-journey.md)
4. [Roadmap and milestones](04-roadmap-milestones.md)
5. [Business model and validation](05-business-validation.md)

## Design and system

6. [UI/UX specification](06-ui-ux-specification.md)
   - [As-built UI guide](21-ui-guide.md)
   - [UI/UX audit and redesign](22-ui-ux-audit-and-redesign.md)
   - [Implementation roadmap](23-implementation-roadmap.md)
7. [System architecture](07-system-architecture.md)
8. [Architecture decision records](08-architecture-decisions.md)
9. [Data schema and dictionary](09-data-schema-dictionary.md)
10. [API contract](10-api-contract.md)

## Safety, privacy, and AI

11. [Security, privacy, and compliance](11-security-privacy-compliance.md)
12. [Threat model and abuse cases](12-threat-model.md)
13. [AI/ML specification and evaluation](13-ai-ml-specification.md)

## Engineering and quality

14. [Development and implementation specification](14-development-specification.md)
15. [AI coding instructions](../AGENTS.md)
16. [Testing and quality assurance](16-testing-qa.md)
17. [Requirements traceability](17-requirements-traceability.md)

## Operations and project onboarding

18. [Deployment and environment guide](18-deployment-environment.md)
19. [Operations and incident runbook](19-operations-incident-runbook.md)
20. [Release and maintenance log](20-release-maintenance-log.md)
21. [Project overview and setup](../README.md)

## Review cadence

Update the relevant documents when product scope, clinical language, data handling, architecture, or release behavior changes. Add dated ADRs for consequential choices. Before user testing or a live pilot, resolve the clinical safety, privacy, consent, security, and research-ethics items that apply.
