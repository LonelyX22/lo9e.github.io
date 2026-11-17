# AI training workspace

Expected dataset layout after license review:

dataset/train/<class_name>/*.jpg
dataset/val/<class_name>/*.jpg
dataset/test/<class_name>/*.jpg

Suggested labels: cirrus, cirrocumulus, cirrostratus, altocumulus, altostratus, nimbostratus, stratocumulus, stratus, cumulus, cumulonimbus, clear_sky, fog_haze, contrail, smoke_dust, non_sky, unknown.

Do not merge labels solely by visual similarity. Require expert label review. Split by source, location, date and capture session to reduce leakage. The current source repository contains no labeled training images, so a valid trained model cannot be produced from the source alone.