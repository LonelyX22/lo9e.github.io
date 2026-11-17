# Dataset source register — license gate required

## Primary: CCSN (Cirrus Cumulus Stratus Nimbus)
- DOI: https://doi.org/10.7910/DVN/CADDPD
- 2,543 ground-based images, 11 labels: Ac, As, Cb, Cc, Ci, Cs, Ct, Cu, Ns, Sc, St.
- 10 WMO genera plus Ct (contrail). Exclude Ct from the WMO 10-class head or model it as a separate auxiliary label.
- Research reference: https://doi.org/10.1029/2018GL077787
- **License/download terms must be checked in the Dataverse record before redistribution or training for a commercial/public service.** A paper describing a dataset is not itself a dataset license.

## Secondary: SWIMCAT
- Project page: https://malea.winkler.site/swimcat.html
- 784 image patches, five visual-appearance categories: clear sky, patterned, thick dark, thick white, veil.
- CC BY-NC terms are reported by the dataset resource; non-commercial restriction means do not use for commercial training/deployment unless permission is obtained.
- Not a WMO genus dataset. Do not map its cloud appearance labels to the 10 genera.
- Reference: Dev, Lee & Winkler, ICIP 2015.

## Segmentation research: SWIMSEG
- 1,013 images with binary cloud masks (cloud vs non-cloud), not cloud genus labels.
- Use only for a future cloud-region segmentation component after checking original license and download terms.

## Additional data requirement
The agreed target is 500+ verified images per WMO genus initially, 1,000+ per genus long-term, with Thai regional, seasonal, time-of-day, location and camera diversity. CCSN alone is too small to meet that target. No model weights should be claimed as trained until data rights, provenance, label quality and held-out evaluation are recorded.
