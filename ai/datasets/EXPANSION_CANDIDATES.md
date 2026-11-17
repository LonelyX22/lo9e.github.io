# Additional cloud datasets and license gate

This register identifies sources that could expand beyond CCSN's 2,543-image baseline. **Do not download into training or publish their images until reuse rights are confirmed.**

## HBMCD / GBCID — best label match, permission required
- Repository: https://github.com/SadaharuZL/HuaYun-BJUT-MIP-Cloud-Dataset
- Paper: Zhang et al., *Cloud Recognition Based on Lightweight Neural Network* (APSIPA ASC 2020), https://ieeexplore.ieee.org/document/9306413
- Reported size: 25,119 images, ten WMO genera plus No Cloud; expert-confirmed labels. Reported class counts range from 1,236 (Ns) to 3,804 (No).
- Download is linked through Baidu Pan (password-protected). The repository does not provide an explicit open license. Images are sourced from proprietary Huayun equipment.
- **Decision:** high-priority candidate, but not approved for training, redistribution or commercial deployment until the rights holder provides written permission and terms.

## WEBCAM — useful partial overlap, permission check required
- Repository: https://github.com/MarcusCoteFIT/webcam-ground-based-cloud-image-dataset
- Paper: Cote et al. (2025), *Ground-Based Cloud Type Classification for Aviation Weather Hazard Detection Using Deep Learning*, https://doi.org/10.1109/ACCESS.2025.3634057
- Reported size: 15,500+ ground-based images in nine classes: Ac, Cb, Ci, Clear, Cu, Obscuration, Precipitation, Stratus and Towering Cumulus.
- Only Ac, Cb, Ci, Cu and St map directly to the 10-genus task. Obscuration, precipitation, clear and towering cumulus are separate auxiliary conditions; do not relabel them as WMO genera.
- Repository README does not state an explicit reuse license.
- **Decision:** candidate for matching genera and auxiliary rejection classes only after permission/license verification.

## Other grouped datasets
- TJNU GCD and MGCD contain useful ground-based images, but their published categories merge multiple WMO genera (for example Ci+Cs, Ac+Cc, and Cb+Ns) and include mixed-cloud classes. They cannot be used as exact 10-genus labels without expert relabeling.
- SWIMCAT has five appearance categories, not genus labels, and its reported non-commercial license is not suitable for commercial use without permission.

## Collection plan
1. Obtain written permission and attribution/license terms.
2. Preserve original labels, source, location, camera, capture time and session identifiers.
3. Keep ambiguous/mixed images in an auxiliary class; never force them into a genus.
4. Remove duplicate and near-duplicate frames, then split by capture session/site/date where metadata allows.
5. Build a balanced 500+ expert-reviewed image minimum per genus, then test on geographically separate Thai images.
