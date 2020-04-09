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
  const menuBar = 23;
  const cellWidth = Math.floor(screenWidth / columns);
  const cellHeight = Math.floor((screenHeight - menuBar) / rows);
  const offsetX = Math.floor((screenWidth - Math.floor((cellWidth / factor) * columns)) / 2);
  const offsetY = Math.floor((screenHeight - Math.floor((cellHeight / factor) * rows)) / 2);
  const BTTPresetSnapArea = JSON.parse(JSON.stringify(BTTPresetSnapAreaTemplate));
  BTTPresetSnapArea.BTTDisplayResolution = `{${screenWidth}, ${screenHeight}}`;
  BTTPresetSnapArea.BTTDisplayScreenFrame = `{{0, 0}, {${screenWidth}, ${screenHeight}}}`;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const BTTDisplayDragpoint = JSON.parse(JSON.stringify(BTTDisplayDragpointTemplate));
      BTTDisplayDragpoint.BTTSnapAreaFrame = `{{${offsetX + column * Math.floor(cellWidth / factor)}, ${offsetY + row * Math.floor(cellHeight / factor)}}, {${Math.floor(cellWidth / factor)}, ${Math.floor(cellHeight / factor)}}}`; // small one
      BTTDisplayDragpoint.BTTSnapAreaPreviewFrame = `{{${column * cellWidth}, ${row * cellHeight}}, {${cellWidth}, ${cellHeight}}}`;
      BTTDisplayDragpoint.BTTSnapAreaUUID = uuid().toUpperCase();
      BTTPresetSnapArea.BTTDisplaySnappedDragpoints.push(BTTDisplayDragpoint);
      BTTPresetSnapArea.BTTDisplayDisplayedDragpoints.push(BTTDisplayDragpoint);
    }
  }
  return BTTPresetSnapArea;
}

BTTPreset.BTTPresetSnapAreas.push(generate(3840, 2160, 4, 3));
BTTPreset.BTTPresetSnapAreas.push(generate(3360, 1890, 4, 2));
BTTPreset.BTTPresetSnapAreas.push(generate(3008, 1692, 3, 2));

fs.writeFileSync('Generated.bttpreset', JSON.stringify(BTTPreset, null, 2), 'utf8');
