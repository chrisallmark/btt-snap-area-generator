# btt-snap-area-generator

Utility to generate [BetterTouchTool](https://folivora.ai/) Snap Areas

## Pre-requisites

Create at least a single Snap Area using BTT and export the Triggers & Settings configuration as `Default.bttpreset` to the application root folder.

Modify the following `index.js` lines...

```javascript
snapAreas(1280, 720);
snapAreas(1920, 1080);
snapAreas(2560, 1440);
snapAreas(3200, 1800);
snapAreas(3840, 2160);
```

Match your monitor resolutions you'd like to use (check Display Preferences) :

`snapAreas(width, height)`

Run with:

```
npm start
```

Output is written to `Generated.bttpreset` - import to BTT replacing the existing preset.

Use modifier keys to adjust the snap area layout

- Control - 4 x 2 Grid
- Option - 5 x 3 Grid
- Command - 6 x 4 Grid

> Using the modifier key in conjuntion with SHIFT will switch to column-only mode.

Done!
