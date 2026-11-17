# Cloud Scanner AI — model development

This repository contains a reproducible training and evaluation pipeline. **It does not contain trained weights yet.** A model is only deployable after dataset checks, training, held-out evaluation, calibration and browser parity tests pass.

## 1. Download the primary dataset
The agreed primary source is CCSN: 2,543 ground-based images and 11 labels. The 10 WMO genera are Ci, Cc, Cs, Ac, As, Ns, Sc, St, Cu, Cb. Ct (contrail) is not a WMO genus.
```bash
python -m venv .venv
# activate the environment
pip install -r ai/requirements.txt
python ai/scripts/download_ccsn.py
```
The downloader records Dataverse file IDs and SHA-256 hashes. CCSN is identified as CC0 1.0 by a published survey; preserve its DOI/citation and verify live Dataverse terms before reuse.

## 2. Inspect and prepare
Organize extracted images as `ai/dataset/raw/<class_code>/`. Validate images and create deterministic train/validation/test splits:
```bash
python ai/scripts/prepare_dataset.py --input ai/dataset/raw --output ai/dataset/processed --seed 42
```
Default labels are the 10 WMO genera. Auxiliary labels are not silently merged into the genus classes. The agreed target is 500+ verified images per genus initially and 1,000+ long-term.

## 3. Train and evaluate
Use Python 3.11 or 3.12:
```bash
python ai/scripts/train.py --data ai/dataset/processed --output ai/artifacts --epochs 20 --image-size 224 --freeze-epochs 3
python ai/scripts/evaluate.py --data ai/dataset/processed --checkpoint ai/artifacts/best.pt --output ai/artifacts/evaluation
```

## 4. Release gate
Do not publish weights unless held-out accuracy, macro-F1, per-class precision/recall/F1, confusion matrix, class support, calibration and rejection results are documented. Random image splits do not prove geographic or temporal generalization; group by site/date/session when metadata is available. The frontend enables inference only for a package explicitly marked `validated` with test metrics and calibrated rejection thresholds.

## Baseline results (17 Nov 2026)

The latest 20-epoch EfficientNet-B0 experiment completed, but it is **not production-ready**: held-out accuracy 42.41%, macro-F1 38.34%, and the validation-only rejection calibration could not meet 90% precision at 15% coverage. The workflow correctly left the model as `research_only` and skipped public deployment. See [the measured report](reports/ccsn-baseline-20261117.md).

CCSN has only 139–340 verified unique images per genus in this run (2,323 total after duplicate/conflict filtering), below the initial target of 500 per genus. Additional licensed and expert-verified data is the main blocker; simply increasing epochs cannot solve this data limitation.

## Important limitation
CCSN alone is smaller than the 500+ images per class target. Do not claim high accuracy or robust Thai-weather performance from this benchmark alone. Additional correctly licensed, expert-verified images are required.
