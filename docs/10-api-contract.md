# API Contract Specification

**Status:** Proposed REST outline; no API exists. Paths and payloads must be finalized with the chosen stack and threat model.

## General conventions

- Base path proposal: `/api/v1` over HTTPS.
- JSON request/response; ISO 8601 timestamps and `YYYY-MM-DD` dates where date-only values are intended.
- Authenticate using the selected secure session/token approach (TBD); authorize every record by owner.
- Validate input on server; use generic errors that do not reveal account existence.
- Never log request bodies containing health data.
- Rate limits and retention for logs are TBD before public pilot.

## Candidate endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/me` | Current profile and preferences |
| GET/POST | `/cycles` | List or create cycle records |
| PATCH/DELETE | `/cycles/{id}` | Correct or remove an owned cycle record |
| GET/POST | `/symptoms` | List or create symptom entries |
| PATCH/DELETE | `/symptoms/{id}` | Correct or remove an owned symptom entry |
| POST | `/reports/preview` | Build a preview for a requested date range |
| POST | `/reports/export` | Generate user-initiated export after confirmation |
| GET | `/education` | Retrieve published, versioned content |
| GET/POST | `/consents` | Read or record versioned consent choices |
| POST | `/account/deletion-request` | Begin verified deletion workflow |

## Example symptom input (illustrative)

```json
{
  "occurred_on": "2026-10-16",
  "symptom_type": "pelvic_pain",
  "pain_score": 6,
  "location": ["lower_abdomen"],
  "cycle_relation": "during_period",
  "impact": ["sleep"]
}
```

All fields except the date and symptom type should remain optional until the final product and clinical review specifies otherwise. This example is synthetic.

## Error envelope proposal

```json
{"error":{"code":"VALIDATION_ERROR","message":"Check the highlighted fields.","field_errors":{"occurred_on":"Invalid date."}}}
```

Candidate statuses: `400` invalid input, `401` unauthenticated, `403` unauthorized, `404` missing or inaccessible record, `409` conflict, `429` rate limited, `500` unexpected failure. Avoid distinguishing inaccessible records in ways that enable enumeration.

## Open contract decisions

Authentication/session model, pagination, idempotency, offline synchronization/conflict resolution, report format/limits, API versioning policy, rate-limit values, and error localization.
