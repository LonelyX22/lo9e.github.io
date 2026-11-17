# Cloud Scanner AI Pro V2 — Foundation

Public bilingual Thai/English browser application. No account required. Scan history is stored locally in the user's browser only.

## Implemented
- Responsive public website, camera permission flow and image selection.
- Thai/English interface.
- Local-only history controls and JSON export.
- Optional geolocation weather lookup through Open-Meteo.
- PWA shell and offline caching for local app assets.
- Does not invent cloud predictions while the dedicated model is not trained and installed.

## Model status
The original repository used a remote Teachable Machine model. It is preserved in the local V2 backup folders; it is not treated as the new validated model. No accuracy claim is made until training and held-out evaluation are complete.

## Next AI steps
1. Review dataset licenses and labels.
2. Build dataset manifest, deduplication and leakage-resistant splits.
3. Train cloud-genus classifier and non-cloud/unknown detector.
4. Evaluate macro-F1, per-class precision/recall, confusion matrix, calibration and rejection performance.
5. Export browser-compatible model to frontend/models/cloud-classifier/.

## Run locally
Run: python -m http.server 8000 --directory frontend
Open http://localhost:8000. Camera requires HTTPS or localhost. Weather lookup requires internet and location permission.

## Deployment
This repository is configured as a GitHub user site candidate. The frontend files are at the repository root. The backend and training workspace are source-only and require a separate Python hosting service / training environment.