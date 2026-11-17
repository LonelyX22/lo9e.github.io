# Dataset source register — reviewed 17 Nov 2026

## Primary: CCSN (Cirrus Cumulus Stratus Nimbus)
- DOI: https://doi.org/10.7910/DVN/CADDPD
- Harvard Dataverse dataset; 2,543 ground-based images, 11 labels: Ac, As, Cb, Cc, Ci, Cs, Ct, Cu, Ns, Sc, St.
- The 10 cloud genera correspond to WMO genera; Ct (contrail) is an extra non-genus label and must be excluded from the 10-genus head or treated separately.
- The dataset is identified as CC0 1.0 by a published survey of open-source sky datasets. Preserve DOI/citation and verify current Dataverse terms before reuse.
- Reference: Zhang et al. (2018), CloudNet: Ground-based cloud classification with deep convolutional neural network, https://doi.org/10.1029/2018GL077787
- Downloader: `python ai/scripts/download_ccsn.py`. It records file IDs, sizes and SHA-256 hashes.

## Secondary: SWIMCAT — not used as genus-labelled training data
- Project page: https://malea.winkler.site/swimcat.html
- 784 image patches, five visual-appearance categories: clear sky, patterned, thick dark, thick white, veil.
- CC BY-NC 4.0 is reported by the dataset resource; non-commercial restriction means do not use for a public/commercial service unless permission is obtained.
- Not a WMO genus dataset. Never map its appearance labels to the 10 genera.

## Segmentation research: SWIMSEG — separate future task
- 1,013 images with binary cloud masks (cloud vs non-cloud), not cloud genus labels.
- Use only for a future segmentation component after checking license and download terms. Do not treat masks as genus labels.


## Candidate: HuaYun-BJUT-MIP Cloud Dataset (HBMCD) — permission required

- Project: https://github.com/SadaharuZL/HuaYun-BJUT-MIP-Cloud-Dataset
- The repository describes 25,119 ground-based images in 11 labels: ten WMO genera plus No Cloud, with labels reviewed by company professional staff.
- The repository states that the images originate from proprietary HUAYUN SOUDING equipment and links a download. No explicit open licence or commercial reuse permission was established during this review.
- **Status: NOT CLEARED.** Do not download into the public training pipeline, redistribute images, or use the dataset to train a publicly deployed model until the owner confirms written permission and permitted model-training/deployment rights.
- If permission is obtained, map the source `No` folder to the separate `non_cloud` auxiliary label. Do not merge it into any cloud genus.
- Reference paper: Zhang et al. (2020), “Cloud Recognition Based on Lightweight Neural Network,” APSIPA ASC.

## Candidate: TJNU Ground-based Cloud Dataset — agreement required

- Project: https://github.com/shuangliutjnu/TJNU-Ground-based-Cloud-Dataset
- The repository describes 19,000 expert-annotated images collected across nine provinces, but its seven labels merge several WMO genera (for example, Ac+Cc and Cb+Ns).
- The repository requires users to read and accept its GCD Agreement before download/use. Its merged categories cannot be silently relabelled as individual genera.
- **Status: NOT CLEARED.** Review and accept the agreement, then decide whether the seven grouped classes are useful for a separate coarse-classification task. Do not mix them into the ten-genus classifier without a defensible relabelling protocol.

## Candidate: WEBCAM — terms review required

- Project: https://github.com/MarcusCoteFIT/webcam-ground-based-cloud-image-dataset
- Describes more than 15,500 labelled images across nine aviation-oriented categories, including towering cumulus, clear sky, fog/obscuration and precipitation.
- **Status: NOT CLEARED.** Confirm licence and rights for commercial/public model training before using. Its labels do not map one-to-one to all ten WMO genera.

## Data sufficiency
CCSN has only 139–340 images per genus and cannot meet the agreed 500+ images per genus initial target by itself. Long-term target is 1,000+ per genus. Additional correctly licensed, expert-verified images are required, especially from Thailand and diverse seasons, times, locations and camera devices. No weights or accuracy claims should be published until the data target, label review and held-out evaluation are complete.
