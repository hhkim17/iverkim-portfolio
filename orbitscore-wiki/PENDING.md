# Orbit Score wiki — pending changes

Changes made to Orbit Score that the wiki (`index.html`) does not cover yet.
Written from the development conversation; the wiki is edited in another conversation.
Add new items under **Pending** with a date. The wiki conversation moves them to **Done** once they are in the wiki (EN and KO).

## Pending

(nothing)

- 2026-11-28 · **`steered` renamed to `orblink_out`** (06 Orbit Link, OSC "Sent" table and OrbitLink_In outputs, EN and KO): the OSC address is now `/orbit/n/orblink_out 0|1` (1 = the object's position is set by an Orbit Out / an outside stream, 0 = by Orbit Score itself). `/orbit/n/steered` no longer exists. OrbitLink_In has a matching channel `o1_orblink_out`, output together with the position (Out: Position x y z). It is per object because some objects can be moved from outside while others keep Orbit Score's motion (e.g. Orbit Out with Objects `1-2`).
- 2026-11-28 · **Read channels by name** (06 Orbit Link, OrbitLink_In outputs): add one line: read `op('orbit_in')['o1_x']`, not by number; the Out: toggles change the channel order and count.

- 2026-11-28 · **OrbitLink_In parameters** (06 Orbit Link, OrbitLink_In): "Select Object (0 = all)" is now **Select Objects**, a text field with a list: `*` = all objects, pick one track from the list (shown by name), or type several — numbers and ranges (`1 3`, `1-4 7`) or track names (`pad drum*`). One single object: its channels come without the `o<n>_` prefix; several: only those objects, with their own numbers. **Max Objects** is 1–16 (Orbit Score's limit). **Help** opens the instructions in a window (it used to print to the textport).

## Pending (screenshots only)

- **SPACE tab** (FIG. 3.2, `media/ui-space.jpg`): the current picture has no DEPTH / HEIGHT row under REFLECTIONS and no SAVE PRESET / DELETE.
- **SCENES tab** (FIG. 5.1, `media/ui-scenes.jpg`): now has the EDITING section, the morph pad note and the greyed pad.
- **Spatial Object device** (FIG. 8.1, `media/dev-object.jpg`): new layout, the POSITION / CENTER OF THE MOTION label, the "now" readout, "Orbit Score · © 2026 Iver Kim".
- **Orbit Link viewer** (FIG. 6.1–6.3, `media/link-*.jpg`): they show the old viewer (x y z per object).
- **LOG tab** (optional, no picture yet): OSC OUT section at the top.

## Done

- 2026-11-28 · Component parameter pages (About / OSC / File): not described in the wiki, by the user's decision.
- 2026-11-28 · Project folder (01.3 Saving).
- 2026-11-28 · Morph pad: always shown, greyed while OFF, the note under MORPH PAD, edits switch it off ("turned off: you edited an object"), the editor notice with TURN PAD OFF (02 and 05).
- 2026-11-28 · Modulator drop fix: no wiki change needed.
- 2026-11-28 · Spatial Object: POSITION / CENTER OF THE MOTION / PATH label and the "now" readout (08). Layout and credit: screenshot only.
- 2026-11-28 · Orbit Link: shape 3 = plane, /size, /rot, /vel, /mute, /active, /motion, /room, /morph sent; /set/n/mute, /set/morph, /set/room/<key>, rx rxmod bd bh received; OrbitLink_In channels per Out toggle; new viewer and scroll; About page with Open Wiki (06).
- 2026-11-28 · Orbit Link: /orbit/set/group/<g>/pos steers a group's centre (06, received table). Marked in the wiki as needing the Spatial Object script of 28 Nov or later.
- 2026-11-28 · Orbit Link: "Using In and Out together" (06, before Examples), one owner per value, with a neutral example.
- 2026-11-28 · Orbit Link: "moved by Orbit Score / Orbit Link" rows, /orbit/n/steered, Out row labels, loop guard (replaces the feedback-loop note).
- 2026-11-28 · Device table: Box Y = height (Y, up), Box Z = depth (Z, front–back); a plane uses Length and Box Z. Motion numbers 0–7 confirmed.
- 2026-11-28 · Orbit In viewer wording: "position: Orbit Score / position: Orbit Out" (06).
- 2026-11-28 · Rotation dials confirmed: Rot X = RX, Rotate = RY, Tilt = RZ; the device table now lists them in the device's order (08).
