# CCSN baseline training report — 17 November 2026

## Latest completed experiment

[GitHub Actions run](https://github.com/LonelyX22/lo9e.github.io/actions/runs/44040877468) completed successfully as a workflow. Workflow success means training and evaluation scripts ran; it does **not** mean the model passed production validation.

- Architecture: torchvision EfficientNet-B0, ImageNet pretrained weights
- Input: 192 × 192 RGB
- Training: 12 epochs (CPU)
- Best validation macro F1: 0.3617
- Held-out test images: 349
- Held-out accuracy: **41.83%**
- Held-out macro F1: **38.93%**
- Validation calibration: no threshold met 90% precision at minimum 15% coverage
- Test selective coverage: **0%**
- Model status: `research_only`
- Deployment: skipped intentionally; no model weights were published to GitHub Pages

## Dataset audit

Source: Harvard Dataverse CCSN, DOI [10.7910/DVN/CADDPD](https://doi.org/10.7910/DVN/CADDPD).

| WMO genus | Verified unique images |
|---|---:|
| Ci — Cirrus | 139 |
| Cc — Cirrocumulus | 265 |
| Cs — Cirrostratus | 286 |
| Ac — Altocumulus | 219 |
| As — Altostratus | 185 |
| Ns — Nimbostratus | 274 |
| Sc — Stratocumulus | 340 |
| St — Stratus | 202 |
| Cu — Cumulus | 177 |
| Cb — Cumulonimbus | 236 |
| **Total** | **2,323** |

Three exact-duplicate groups had conflicting class labels and were excluded. Fourteen byte-identical same-class duplicates were removed. No genus reaches the project's initial target of 500 verified images.

## Per-class held-out results

| Class | Precision | Recall | F1 | Test images |
|---|---:|---:|---:|---:|
| Ac | 31.25% | 15.15% | 20.41% | 33 |
| As | 42.42% | 50.00% | 45.90% | 28 |
| Cb | 42.86% | 51.43% | 46.75% | 35 |
| Cc | 70.83% | 42.50% | 53.13% | 40 |
| Ci | 35.14% | 61.90% | 44.83% | 21 |
| Cs | 36.84% | 16.28% | 22.58% | 43 |
| Cu | 32.50% | 48.15% | 38.81% | 27 |
| Ns | 51.61% | 39.02% | 44.44% | 41 |
| Sc | 41.05% | 76.47% | 53.42% | 51 |
| St | 33.33% | 13.33% | 19.05% | 30 |

## Release decision

**RESEARCH ONLY — NOT APPROVED FOR PUBLIC CLOUD-GENUS PREDICTIONS.**

The existing conservative gates remain:
- Macro F1 ≥ 0.70
- Selective precision ≥ 0.90
- Selective coverage ≥ 0.15
- At least 500 verified images per genus

## Data expansion candidates (not yet approved for training)

- [HuaYun/BJUT-MIP (HBMCD)](https://github.com/SadaharuZL/HuaYun-BJUT-MIP-Cloud-Dataset) reports 25,119 ground-based images and expert-labelled WMO genera plus a no-cloud class. Its README says the images originate from proprietary company equipment; a clear reuse licence was not established in this review. **Do not download into training or redistribute until permission/licence is confirmed.**
- [WEBCAM dataset](https://github.com/MarcusCoteFIT/webcam-ground-based-cloud-image-dataset) reports more than 15,500 labelled images across nine categories, including towering cumulus. Its non-commercial/no-derivatives terms must be reviewed against model training and public deployment before use. **Do not mix into the public-service training set without rights clearance.**

## Next engineering work

1. Obtain explicit reuse permission or a compatible licence for additional expert-labelled data.
2. Add a provenance manifest for every image (source, licence, label, capture site/date where available, SHA-256).
3. Split by capture session/site/date where metadata permits; keep a truly untouched external test set.
4. Train and compare multiple architectures and augmentation strategies; retain the best validation checkpoint only.
5. Calibrate rejection on validation data, then measure it once on the untouched test set.
6. Build a separate unknown/non-cloud detector and evaluate real phone photos, including partial sky, roofs, trees, haze and mixed cloud scenes.
7. Add subtype labels such as Cumulus congestus only when expert-annotated subtype data exists. A genus-only CCSN label cannot supervise subtype predictions.

Random splits of this small dataset do not prove geographic, seasonal, camera or Thai-weather generalization.
