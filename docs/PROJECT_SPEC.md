# Cloud Scanner AI Pro V2 — Project specification

- Public website; no registration or login.
- Thai and English interface.
- Camera and image upload.
- Local-only scan history; no cloud synchronization.
- Hybrid architecture may use browser inference and optional server inference.
- Dedicated cloud model trained from public datasets after license and label review.
- 10 WMO cloud genera plus non-cloud/unknown and poor-quality image handling.
- Weather context is separate from AI classification.
- Never claim measured accuracy before evaluation on a held-out test set.
- Preserve original V1 source and model references in backup.

## Privacy
Geolocation is opt-in. Scan history remains in local browser storage. Do not upload images or scan history without explicit consent.