# Cloud Scanner AI Pro V2

Public bilingual Thai/English browser app. No account or sign-up required. Scan history stays in the user's browser on the device and is not uploaded.

## Live site
https://lonelyx22.github.io/

## Available now
- Responsive public website for mobile and desktop.
- Camera capture with explicit browser permission, or upload an image.
- Thai / English interface.
- Local-only scan history, export to JSON and clear-history controls.
- Optional location-based current weather from Open-Meteo, kept separate from image classification.
- PWA shell and service-worker caching for app assets.
- Safe model gate: no cloud label is produced unless an ONNX model package is marked `validated` and contains held-out test metrics plus calibrated rejection thresholds.

## AI model status
The dedicated cloud-genus model is under experimental training using CCSN. A successful training run is not, by itself, evidence of production accuracy. The model must pass the held-out evaluation and conservative release gate before it can be copied to `models/cloud-classifier/` and enabled in the public site. Until then, the scanner correctly reports that no validated model is available rather than making up an answer.

## Taxonomy
The primary classifier targets the 10 WMO cloud genera: Ci, Cc, Cs, Ac, As, Ns, Sc, St, Cu, Cb. Contrails (Ct), clear sky/non-cloud and unknown/out-of-scope images are kept as separate auxiliary labels and are not falsely described as cloud genera.

## AI development
See [AI model development guide](ai/README.md) and [dataset source register](ai/datasets/SOURCES.md).

The CCSN downloader records source file IDs, sizes and SHA-256 hashes. The preparation script checks image integrity, exact duplicates, cross-label duplicate conflicts and deterministic splits. The experimental training workflow downloads, prepares, trains, evaluates and uploads research artifacts to GitHub Actions.

## Run locally
From the repository root:
```bash
python -m http.server 8000
```
Open http://localhost:8000. Camera access requires HTTPS or localhost. Weather lookup requires internet access and explicit location permission.

## Privacy and limitations
- No account, sign-in or server-side history is required.
- Scan history is stored in browser localStorage. Clearing browser site data can remove it.
- Location is requested only when the user presses the weather location button.
- Weather data is fetched from Open-Meteo and is not used as the cloud classifier's answer.
- An image classifier cannot reliably infer precipitation, storm severity or a forecast from one photograph.
- CCSN alone is a small research dataset and does not establish generalization to Thai locations, seasons, times or phone cameras. Additional licensed, expert-verified Thai images and external validation are required before claiming high accuracy.

## Deployment
GitHub Pages deploys the root static website. Python model training and the FastAPI source are research/development components; GitHub Pages does not host the Python API.
