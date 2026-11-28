# Orbit Score wiki — pending changes

Changes made to Orbit Score that the wiki (`index.html`) does not cover yet.
Written from the development conversation; the wiki is edited in another conversation.
Remove an item once it is in the wiki (EN and KO).

## 2026-11-28

- **Screenshot needed — SPACE tab** (FIG. 3.2, `media/ui-space.jpg`): the current picture has no DEPTH / HEIGHT row under REFLECTIONS and no SAVE PRESET / DELETE.
- **Screenshot (optional) — LOG tab**: OSC OUT section at the top (Send positions ON, host, PORT, rate, status line). The wiki text already describes it; there is no LOG picture yet.

## Done / decided

- 2026-11-28 · Orbit_Score component parameter pages (About / OSC / File): the user decided the wiki does not describe them; the note and table were removed from 01.2. No need to add the File page.
- 2026-11-28 · Project folder (01.3 Saving): in the wiki, EN and KO.
- **Morph pad notice in the editor** (05 Scenes, morph pad paragraph; 02 Object editor): while the pad is on, the editor shows "MORPH PAD IS ON — It sets motion, shape, position." with a TURN PAD OFF button above MOTION. With the pad on, a motion or shape chosen in the editor goes back to the scene's within about 2 s; this was always so, the notice is new.
- **Modulators** (02 Object editor): no text change. Fixed: a wave dropped on a slider now lands on the slider under the mouse (it could miss by one row).
- **Morph pad, off state** (05 Scenes, morph pad paragraph): the pad is always shown on the SCENES tab; while OFF it is dimmed and grey and nothing on it reacts (corners are chosen after turning it ON). A note under MORPH PAD explains it before it is switched on: it takes over motion, shape and position, AUTO SCENE pauses, editor changes do not hold; turn it OFF to edit.
- **Screenshot needed — SCENES tab** (FIG. 5.1, `media/ui-scenes.jpg`): now has the EDITING section, the morph pad note and the greyed pad.
- **Morph pad turns off on an edit** (05 Scenes, morph pad paragraph; replaces "turn it OFF to edit" in the item above): changing a setting, a path or a modulator of an object in the editor switches the pad off (it glides back to the scene) and the edit is applied; the MORPH PAD line shows "turned off: you edited an object" for a few seconds. The note under MORPH PAD now starts "The morph pad blends the corner scenes by hand…" and sits directly under the MORPH PAD line.
- **Spatial Object device layout** (01.1 Live devices / 08 Device reference): sections realigned on one grid; top right of the device now reads "Orbit Score · © 2026 Iver Kim". No function changed. **Screenshot needed** if the wiki shows the Spatial Object device.
- **Spatial Object: centre and "now"** (08 Device reference / 01.1): the Azimuth · Elevation · Distance dials are the centre of the motion (the position itself when Static). A label above them says POSITION (Static), CENTER OF THE MOTION (patterns, chaos) or "PATH · dials not used" (Path: the dials are greyed out). Under the dials "now +42° −4° 1.18" shows where the object is at this moment. Screenshot of the device needed.
