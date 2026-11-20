# BOAT FLASHER

Browser-based USB firmware installer for ESP32 DevKit V1 and ESP32-C5.

## Public flasher

https://lonelyx22.github.io/lo9e.github.io/flasher/

## Firmware admin

https://lonelyx22.github.io/lo9e.github.io/flasher/admin.html

The admin page is public, but publishing requires a GitHub fine-grained personal access token belonging to the repository owner. Create a token limited to this repository with:
- Contents: Read and write
- Metadata: Read-only

The token is held in page memory only and is not saved in localStorage. Never share it. Do not add a token to source code, GitHub Pages, or commits.

## Publishing a firmware release

1. Build a firmware image for the exact target chip.
2. Prefer the complete merged image produced by the board's build system. For Arduino CLI this is usually the `.merged.bin` file.
3. Open the admin page and verify owner access.
4. Select the board, enter a new semantic version (for example `v1.0.1`), add release notes and select the .bin file.
5. Choose Complete merged image (address `0x0`) or Application image (address `0x10000`) to match the selected file.
6. Publish. The binary is committed under `firmware/releases/<board>/<version>/` and the public catalog is updated.
7. The public flasher reads `firmware/manifest.json` and displays available versions. The new latest version is available after GitHub Pages deploys.

Old versions remain available. Publish a new version instead of overwriting an old release.

## Requirements

- Desktop Chrome or Microsoft Edge
- HTTPS (GitHub Pages)
- USB data cable and suitable USB serial driver
- Select the correct chip family before flashing
- Hold BOOT if the board does not enter download mode automatically

## Safety

Do not mix ESP32 and ESP32-C5 images. Complete merged images are written at `0x0`; application-only images are written at `0x10000`. Confirm the image type and board flash layout before publishing. Flashing over USB is not OTA; the user must connect the board to the computer.

The flashing flow and catalog still require physical hardware verification on each supported board before being considered production-ready.
