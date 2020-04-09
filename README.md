# btt-snap-area-generator
Utility to generate [BetterTouchTool](https://folivora.ai/) Snap Areas

## Pre-requisites
Create at least a single Snap Area using BTT and export the Triggers & Settings configuration as ```Default.bttpreset``` to the application root folder.

Modify the following ```index.js``` lines...

```javascript
BTTPreset.BTTPresetSnapAreas.push(generate(3840, 2160, 4, 3));
BTTPreset.BTTPresetSnapAreas.push(generate(3360, 1890, 4, 2));
BTTPreset.BTTPresetSnapAreas.push(generate(3008, 1692, 3, 2));
```

Match the monitor sizes and layouts you'd like to use:

```generate(width, height, rows, columns)```

Run with:

```
npm start
```

Output is written to ```Generated.bttpreset``` - import to BTT replacing the existing preset. Done!