# CCSN baseline training report — 17 November 2026

## Latest completed experiment

[Latest GitHub Actions run](https://github.com/LonelyX22/lo9e.github.io/actions/runs/44044991214) completed all training and evaluation steps successfully.

- Architecture: torchvision EfficientNet-B0 with ImageNet pretrained weights
- Input: 192 × 192 RGB
- Training: 12 epochs, CPU
- Best validation macro F1: 0.3617
- Held-out test images: 349
- Held-out accuracy: **41.83%**
- Held-out macro F1: **38.93%**
- Validation calibration: no threshold met the 90% precision target at minimum 15% coverage
- Test selective coverage: **0%**
- Model status: `research_only`
- Public deployment: model copy and Pages deployment were intentionally skipped by the release gate

A successful workflow means the experiment completed; it does not mean the model passed the release gate.

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

The release gates remain:
- Macro F1 ≥ 0.70
- Selective precision ≥ 0.90
- Selective coverage ≥ 0.15
- At least 500 verified images per genus

## Data expansion candidates — rights not cleared

- [HuaYun-BJUT-MIP (HBMCD)](https://github.com/SadaharuZL/HuaYun-BJUT-MIP-Cloud-Dataset) reports 25,119 ground-based images, ten WMO genera and a no-cloud class, with professional labels. Its repository says the images originate from proprietary company equipment and does not establish a clear open licence. Written permission for model training and public deployment is required before use.
- [TJNU Ground-based Cloud Dataset](https://github.com/shuangliutjnu/TJNU-Ground-based-Cloud-Dataset) reports 19,000 expert-annotated images but groups several genera into seven sky-condition classes. Its GCD Agreement must be reviewed; grouped labels must not be relabelled as individual genera.
- [WEBCAM](https://github.com/MarcusCoteFIT/webcam-ground-based-cloud-image-dataset) reports more than 15,500 images across nine aviation-oriented categories. Its licence and rights for commercial/public training need confirmation; labels do not map one-to-one to the ten genera.

No candidate dataset above has been added to training. The source register records these restrictions.

## Engineering changes after this run

- The dataset preparation script now maps a source folder named `No` to the separate auxiliary `non_cloud` class when auxiliary labels are enabled. This does not itself add HBMCD images or clear their licence.
- The public scanner's pixel heuristic is now explicitly described as a simple bright/low-saturation pixel indicator, **not actual cloud coverage and not cloud-genus identification**.
- The frontend still refuses to load a model unless its metadata status is `validated`; the research ONNX file is not published to the live site.

## Next required work

1. Obtain written data rights for at least one suitable additional expert-labelled dataset.
2. Build a provenance manifest per image: source, licence, label, SHA-256, and capture site/date/session when available.
3. Review class mapping before mixing datasets; keep non-cloud, fog, precipitation, mixed and subtype labels separate from WMO genera unless the taxonomy explicitly supports them.
4. Use site/date/session-aware splits where possible and retain an untouched external test set.
5. Train and compare multiple architectures and augmentation strategies; tune only on train/validation data.
6. Calibrate rejection on validation data and measure it once on the untouched test set.
7. Collect expert-verified Thai sky images across seasons, times, camera devices and mixed/partial-sky scenes.
8. Add subtype labels such as Cumulus congestus only when the training set contains expert-annotated subtype labels.

Random splits on CCSN do not establish geographic, seasonal, camera or Thai-weather generalization.
