# Cloud Scanner AI Pro V2

Public bilingual Thai/English browser app. No account or sign-up required. Scan history stays in the user's browser on the device and is not uploaded.

## Live site
https://lonelyx22.github.io/

## Available now
- Responsive public website for mobile and desktop.
- Camera capture with explicit browser permission, or upload an image.
- Browser-side visual scan estimates the proportion of bright, low-saturation pixels in detected sky regions when no validated AI model is available. This is explicitly a heuristic estimate, not cloud-genus AI or a weather forecast.
- Thai / English interface.
- Local-only scan history, export to JSON and clear-history controls.
- Optional location-based current weather from Open-Meteo, kept separate from image classification.
- PWA shell and service-worker caching for app assets.
- Explicit model installation: users download the actual ONNX model into browser-local IndexedDB; image analysis is enabled only after the download and ONNX session initialization complete. A cached model is reused only when its version matches the published model.

## AI model status
The current 10-genus EfficientNet-B0 model is published as an explicitly labelled beta for public testing. Latest held-out test results: accuracy 42.12%, macro F1 40.11%. It has not passed the production release gate. Users must press Download AI Model; the ONNX file is fetched from the site, stored in browser-local IndexedDB, and loaded with ONNX Runtime Web before the Analyze button becomes available. The beta can make incorrect predictions and must not be used for safety or weather-warning decisions.

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
