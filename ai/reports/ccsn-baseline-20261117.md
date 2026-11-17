# CCSN baseline training report — 17 November 2026

## Run
- GitHub Actions run: https://github.com/LonelyX22/lo9e.github.io/actions/runs/44034795328
- Dataset: Harvard Dataverse CCSN, DOI 10.7910/DVN/CADDPD, version 2
- Architecture: EfficientNet-B0 transfer learning
- Input: RGB 160×160, ImageNet normalization
- Held-out test set: 349 images
- Ten classes: Ac, As, Cb, Cc, Ci, Cs, Cu, Ns, Sc, St

## Measured held-out metrics
- Accuracy: **36.10%**
- Macro F1: **34.28%**
- Best validation macro F1: **28.61%**
- Validation calibration could not find a threshold meeting 90% precision at 15% minimum coverage.
- Accepted test coverage under the calibrated reject rule: **0%**.

## Dataset audit
| Class | Verified unique images |
|---|---:|
| Ci | 139 |
| Cc | 265 |
| Cs | 286 |
| Ac | 219 |
| As | 185 |
| Ns | 274 |
| Sc | 340 |
| St | 202 |
| Cu | 177 |
| Cb | 236 |

Three exact duplicate image groups had conflicting labels and were excluded. Fourteen same-class byte-identical duplicates were removed. No class meets the project's initial 500 verified-image target.

## Release decision
**RESEARCH ONLY — NOT APPROVED FOR PUBLIC PREDICTIONS.**

The model did not meet the configured release gates (macro F1 ≥ 0.70, selective precision ≥ 0.90, selective coverage ≥ 0.15). It was not copied to the live website. The website therefore continues to refuse unsupported predictions instead of presenting guesses.

## Known limitations
- CCSN is small and does not establish generalization to Thai weather, seasons, camera devices or locations.
- The split is randomized, not grouped by acquisition session/location/date.
- Perceptual near-duplicates and label ambiguity need further review.
- More licensed, expert-verified data and a separate out-of-scope detector are required.
