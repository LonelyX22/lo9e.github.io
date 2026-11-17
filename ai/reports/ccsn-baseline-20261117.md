# CCSN baseline training report — 17 November 2026

## Completed automated experiments
Two training/evaluation runs completed successfully on GitHub Actions. Both were research experiments and neither passed the production release gate.

| Run | Input | Training | Held-out accuracy | Macro F1 | Decision |
|---|---:|---:|---:|---:|---|
| [Initial baseline](https://github.com/LonelyX22/lo9e.github.io/actions/runs/44034795328) | 160×160 | 7 epochs | 36.10% | 34.28% | Research only |
| [Fast follow-up](https://github.com/LonelyX22/lo9e.github.io/actions/runs/44037963105) | 128×128 | 2 epochs | 15.47% | 14.34% | Research only |

Latest run used 349 held-out test images. Validation calibration could not find a threshold achieving the target 90% precision at 15% minimum coverage; accepted test coverage was 0%.

## Dataset audit
Source: Harvard Dataverse CCSN, DOI 10.7910/DVN/CADDPD, version 2.

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

Three exact duplicate image groups had conflicting labels and were excluded. Fourteen same-class byte-identical duplicates were removed. No class reaches the project's 500-image minimum target.

## Release decision
**RESEARCH ONLY — NOT APPROVED FOR PUBLIC PREDICTIONS.**

The production release gates remain macro F1 ≥ 0.70, selective precision ≥ 0.90, and selective coverage ≥ 0.15. The model was not copied to the live website. The public scanner remains available, but it must not invent cloud classifications without a validated model.

## What must improve next
1. Expand the training data, especially underrepresented genera.
2. Review disputed and ambiguous expert labels.
3. Create location/date/session-aware splits to test generalization rather than relying only on random image splits.
4. Add licensed Thai sky imagery across seasons, camera types, lighting and weather.
5. Add a separate non-cloud / unknown detector and validate calibration on independent field data.
