# Cloud Scanner AI — model development

This repository now contains the reproducible training and evaluation pipeline. **It does not contain trained weights yet.** A model is only deployable after the dataset checks, training, held-out evaluation, calibration and browser parity tests pass.

## Label policy
The target is the 10 WMO cloud genera: Ci, Cc, Cs, Ac, As, Ns, Sc, St, Cu, Cb. CCSN's extra Ct (contrail) is not a WMO genus; keep it as a separate auxiliary class or exclude it from the 10-genus head. Do not map SWIMCAT's appearance labels (veil/patterned/thick dark/thick white) into WMO genera. SWIMCAT clear-sky may support a separate non-cloud/rejection head only if its license permits the intended use. SWIMSEG provides segmentation masks, not genus labels; reserve it for a later localization task.

## Data layout
Place images in `ai/dataset/raw/<class_code>/` where class_code is one of:
`Ci Cc Cs Ac As Ns Sc St Cu Cb Ct non_cloud unknown`.
Only include classes for which the source's labels actually support the target. Keep a source-level manifest and the original dataset license/attribution files. Never relabel a broad appearance class as a specific genus.

## Reproducible run
Use Python 3.11 or 3.12 in a clean environment:
```bash
python -m venv .venv
# activate the environment
pip install -r ai/requirements.txt
python ai/scripts/prepare_dataset.py --input ai/dataset/raw --output ai/dataset/processed --seed 42
python ai/scripts/train.py --data ai/dataset/processed --output ai/artifacts --epochs 30
python ai/scripts/evaluate.py --data ai/dataset/processed --checkpoint ai/artifacts/best.pt --output ai/artifacts/evaluation
```
The preparation script removes byte-identical duplicates and makes deterministic stratified train/validation/test splits. It reports per-class counts and stops if classes are missing or too small. Near-duplicate and capture-session grouping must be added when source metadata becomes available; the report explicitly notes this limitation.

## Acceptance gate
Do not publish weights unless the report contains held-out test metrics: accuracy, macro-F1, per-class precision/recall/F1, confusion matrix, class counts, and calibration/rejection results. The current small CCSN dataset alone cannot substantiate a robust 500+ images per class target. Collect additional correctly licensed, expert-verified images, particularly from Thailand and different cameras, seasons, times and locations. Do not claim 90%/95% accuracy without a reproducible held-out result.

## Browser export
Training exports `model.onnx` and `model_metadata.json`. Copy both to `models/cloud-classifier/` at the site root only after evaluation passes. Browser inference uses ONNX Runtime Web and verifies the model metadata. The UI must show "model unavailable" rather than fake predictions when artifacts are absent.
