import fs from "fs";
import { v4 as uuid } from "uuid";
import defaults from "./btt-preset.json";

type BTTPreset = Omit<typeof defaults, "BTTPresetSnapAreas"> & {
  BTTPresetSnapAreas: BTTDisplay[];
};

type BTTDisplay = {
  BTTDisplayDisplayedDragpoints: BTTSnapArea[];
  BTTDisplayID: number;
  BTTDisplayIsMain: number;
  BTTDisplayModel: number;
  BTTDisplayResolution: string;
  BTTDisplayScreenFrame: string;
  BTTDisplayScreenSize: string;
  BTTDisplaySerialNumber: string;
  BTTDisplaySnappedDragpoints: BTTSnapArea[];
  BTTDisplayVendorID: number;
};

type BTTSnapArea = {
  BTTSnapAreaAnimationDuration: number;
  BTTSnapAreaPreviewBorderColor: string;
  BTTSnapAreaColor: string;
  BTTSnapAreaFrame: string;
  BTTSnapAreaHighlightColor: string;
  BTTSnapAreaModifierCMD?: number;
  BTTSnapAreaModifierCTRL?: number;
  BTTSnapAreaModifierOPT?: number;
  BTTSnapAreaModifierSHIFT?: number;
  BTTSnapAreaPictogramDistanceFromLeft: number;
  BTTSnapAreaPictogramDistanceFromBottom: number;
  BTTSnapAreaPictogramSize: number;
  BTTSnapAreaPreviewFrame: string;
  BTTSnapAreaBorderWidth: number;
  BTTSnapAreaCornerRadius: number;
  BTTSnapAreaUUID: string;
  BTTSnapAreaShowsForApps: never[];
};

const btt: BTTPreset = defaults;

btt.BTTPresetName = "Generated";
btt.BTTPresetUUID = uuid();

const FACTOR = 2;
const MENU_BAR = 24;

const generateSnapAreas = (bttDisplay: BTTDisplay): BTTSnapArea[] => {
  const resolution = bttDisplay.BTTDisplayResolution.match(/\d+/g);
  if (!resolution || resolution.length !== 2) {
    throw new Error("Invalid resolution");
  }
  const screenWidth = parseInt(resolution[0]);
  const screenHeight = parseInt(resolution[1]) - MENU_BAR;
  const bttSnapAreas: BTTSnapArea[] = [];
  for (let columns = 3; columns <= 5; columns++) {
    for (let rows = 2; rows <= 3; rows++) {
      const cellWidth = Math.floor(screenWidth / columns);
      const cellHeight = Math.floor(screenHeight / rows);
      const offsetX = Math.floor(
        (screenWidth - Math.floor((cellWidth / FACTOR) * columns)) / 2
      );
      const offsetY =
        MENU_BAR +
        Math.floor(
          (screenHeight - Math.floor((cellHeight / FACTOR) * rows)) / 2
        );
      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          const bttSnapArea: BTTSnapArea = {
            ...bttDisplay.BTTDisplayDisplayedDragpoints[0],
            BTTSnapAreaPreviewFrame: `{{${column * cellWidth}, ${
              row * cellHeight
            }}, {${cellWidth}, ${cellHeight}}}`,
            BTTSnapAreaFrame: `{{${
              offsetX + column * Math.floor(cellWidth / FACTOR)
            }, ${
              offsetY + row * Math.floor(cellHeight / FACTOR)
            }}, {${Math.floor(cellWidth / FACTOR)}, ${Math.floor(
              cellHeight / FACTOR
            )}}}`,
            BTTSnapAreaUUID: uuid().toUpperCase(),
          };
          switch (columns) {
            case 3:
              bttSnapArea.BTTSnapAreaModifierCTRL = 1;
              break;
            case 4:
              bttSnapArea.BTTSnapAreaModifierOPT = 1;
              break;
            case 5:
              bttSnapArea.BTTSnapAreaModifierCMD = 1;
              break;
          }
          if (rows === 3) {
            bttSnapArea.BTTSnapAreaModifierSHIFT = 1;
          }
          bttSnapAreas.push(bttSnapArea);
        }
      }
    }
  }
  return bttSnapAreas;
};

let bttPresetSnapAreas = [];
for (const bttDisplay of btt.BTTPresetSnapAreas) {
  const snapAreas = generateSnapAreas(bttDisplay);
  bttPresetSnapAreas.push({
    ...bttDisplay,
    BTTDisplayDisplayedDragpoints: snapAreas,
    BTTDisplaySnappedDragpoints: snapAreas,
  });
}

fs.writeFileSync(
  "Generated.bttpreset",
  JSON.stringify(
    {
      ...btt,
      BTTPresetSnapAreas: bttPresetSnapAreas,
    },
    null,
    2
  ),
  "utf8"
);
