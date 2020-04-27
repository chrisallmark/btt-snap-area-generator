import fs from 'fs';
import { v4 as uuid } from 'uuid';

const BTTPreset: any = JSON.parse(fs.readFileSync('Default.bttpreset', 'utf8'));

const BTTPresetSnapAreaTemplate = {
  ...BTTPreset.BTTPresetSnapAreas[0],
};
BTTPresetSnapAreaTemplate.BTTDisplaySnappedDragpoints = [];
BTTPresetSnapAreaTemplate.BTTDisplayDisplayedDragpoints = [];

const BTTDisplayDragpointTemplate = {
  ...BTTPreset.BTTPresetSnapAreas[0].BTTDisplaySnappedDragpoints[0],
};

BTTPreset.BTTPresetSnapAreas = [];

function generate(screenWidth: number, screenHeight: number, columns: number, rows: number) {
  const factor = 4;
  const menuBar = 0; // 23
  const cellWidth = Math.floor(screenWidth / columns);
  const cellHeight = Math.floor((screenHeight - menuBar) / rows);
  const offsetX = Math.floor((screenWidth - Math.floor((cellWidth / factor) * columns)) / 2);
  const offsetY = Math.floor((screenHeight - Math.floor((cellHeight / factor) * rows)) / 2);
  const BTTPresetSnapArea = JSON.parse(JSON.stringify(BTTPresetSnapAreaTemplate));
  BTTPresetSnapArea.BTTDisplayResolution = `{${screenWidth}, ${screenHeight}}`;
  BTTPresetSnapArea.BTTDisplayScreenFrame = `{{0, 0}, {${screenWidth}, ${screenHeight}}}`;

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const BTTDisplayDragpoint = JSON.parse(JSON.stringify(BTTDisplayDragpointTemplate));
      BTTDisplayDragpoint.BTTSnapAreaFrame = `{{${offsetX + column * Math.floor(cellWidth / factor)}, ${offsetY + (row * Math.floor(cellHeight / factor))}}, {${Math.floor(cellWidth / factor)}, ${Math.floor(cellHeight / factor)}}}`;
      switch (columns) {
        case 4:
          BTTDisplayDragpoint.BTTSnapAreaModifierCTRL = 1;
          break;
        case 5:
          BTTDisplayDragpoint.BTTSnapAreaModifierOPT = 1;
          break;
        case 6:
          BTTDisplayDragpoint.BTTSnapAreaModifierCMD = 1;
          break;
        default:
      }
      BTTDisplayDragpoint.BTTSnapAreaPreviewFrame = `{{${column * cellWidth}, ${(row * cellHeight)}}, {${cellWidth}, ${cellHeight}}}`;
      BTTDisplayDragpoint.BTTSnapAreaUUID = uuid().toUpperCase();
      BTTPresetSnapArea.BTTDisplaySnappedDragpoints.push(BTTDisplayDragpoint);
      BTTPresetSnapArea.BTTDisplayDisplayedDragpoints.push(BTTDisplayDragpoint);
    }
  }
  for (let column = 0; column < columns; column += 1) {
    const BTTDisplayDragpoint = JSON.parse(JSON.stringify(BTTDisplayDragpointTemplate));
    BTTDisplayDragpoint.BTTSnapAreaFrame = `{{${offsetX + column * Math.floor(cellWidth / factor)}, ${offsetY}}, {${Math.floor(cellWidth / factor)}, ${Math.floor(screenHeight / factor)}}}`; // small one
    switch (columns) {
      case 4:
        BTTDisplayDragpoint.BTTSnapAreaModifierCTRL = 1;
        break;
      case 5:
        BTTDisplayDragpoint.BTTSnapAreaModifierOPT = 1;
        break;
      case 6:
        BTTDisplayDragpoint.BTTSnapAreaModifierCMD = 1;
        break;
      default:
    }
    BTTDisplayDragpoint.BTTSnapAreaModifierSHIFT = 1;
    BTTDisplayDragpoint.BTTSnapAreaPreviewFrame = `{{${column * cellWidth}, 0}, {${cellWidth}, ${screenHeight}}}`;
    BTTDisplayDragpoint.BTTSnapAreaUUID = uuid().toUpperCase();
    BTTPresetSnapArea.BTTDisplaySnappedDragpoints.push(BTTDisplayDragpoint);
    BTTPresetSnapArea.BTTDisplayDisplayedDragpoints.push(BTTDisplayDragpoint);
  }
  return BTTPresetSnapArea;
}

function snapAreas(screenWidth: number, screenHeight: number) {
  for (let columns = 4; columns <= 6; columns += 1) {
    switch (columns) {
      case 4:
        BTTPreset.BTTPresetSnapAreas.push(generate(screenWidth, screenHeight, columns, 2));
        break;
      case 5:
        BTTPreset.BTTPresetSnapAreas.push(generate(screenWidth, screenHeight, columns, 3));
        break;
      case 6:
        BTTPreset.BTTPresetSnapAreas.push(generate(screenWidth, screenHeight, columns, 4));
        break;
      default:
    }
  }
}

snapAreas(1280, 720);
snapAreas(1920, 1080);
snapAreas(2560, 1440);
snapAreas(3200, 1800);
snapAreas(3840, 2160);

fs.writeFileSync('Generated.bttpreset', JSON.stringify(BTTPreset, null, 2), 'utf8');
