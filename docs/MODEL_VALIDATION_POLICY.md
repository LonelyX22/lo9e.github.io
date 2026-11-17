# Model validation and release policy

1. Separate the 10 WMO genus labels from contrails and non-cloud/unknown labels.
2. Never convert broad cloud appearance categories into genus labels.
3. Preserve dataset source, license, attribution, original label and capture metadata for each image.
4. Remove exact duplicates before splitting. Where possible, split by camera/site/date/session to prevent leakage; random image splits alone are not evidence of geographic generalization.
5. Keep test data untouched until final evaluation.
6. Report accuracy, macro-F1, per-class precision/recall/F1, confusion matrix and class support.
7. Calibrate confidence/rejection threshold on validation data, then report coverage vs selective accuracy on test data.
8. Test out-of-distribution images (buildings, trees, sunsets, night, indoor images, heavily obstructed sky) and return "cannot classify" rather than a forced cloud label.
9. Test browser preprocessing parity against Python on the same images.
10. No public accuracy claim until independent evaluation is complete. No weather or precipitation forecast may be inferred from cloud-genus classification alone.
