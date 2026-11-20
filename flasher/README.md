# BOAT FLASHER

Browser-based ESP32 firmware flasher for the BOAT RC controller project.

## Open the flasher

After the repository's GitHub Pages deployment completes:

https://lonelyx22.github.io/flasher/

## Supported chips

- ESP32 classic (ESP32 DevKit V1 / WROOM)
- ESP32-C5

## Requirements

- Desktop Chrome or Microsoft Edge
- HTTPS page (GitHub Pages provides HTTPS)
- USB data cable and a USB-to-UART or native USB serial interface
- Board driver installed when required (for example CP210x or CH340)
- Board in download/bootloader mode if automatic reset does not work

## Flashing

1. Select the exact chip family.
2. Select a firmware .bin file built for that chip.
3. For a single application image, keep the address at 0x10000.
4. Click Connect USB Device and choose the board's serial port.
5. Click Start Flash Sequence and wait for completion.
6. Reset the board after flashing.

Do not flash an application-only image at address 0x0. A complete merged image must be flashed at 0x0 using a package prepared for the exact board and flash layout. Do not mix ESP32 and ESP32-C5 firmware.

## Firmware sources

The classic ESP32 sketch uses the project's ESP32 DevKit V1 pin map:

| Signal | ESP32 DevKit V1 |
| --- | ---: |
| ENA | GPIO25 |
| IN1 | GPIO26 |
| IN2 | GPIO27 |
| ENB | GPIO33 |
| IN3 | GPIO14 |
| IN4 | GPIO13 |

The ESP32-C5 sketch uses the separate C5 pin map in its source. Always confirm the pinout for the exact module/board revision before wiring.

## Important

This is an early release. The website's serial-flashing flow is implemented, but it has not yet been verified on physical ESP32 and ESP32-C5 hardware. Do not flash a board with an image unless the target chip, flash address, and image layout are confirmed.