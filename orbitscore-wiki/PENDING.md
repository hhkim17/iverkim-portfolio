# Orbit Score wiki — pending changes

Changes made to Orbit Score that the wiki (`index.html`) does not cover yet.
Written from the development conversation; the wiki is edited in another conversation.
Add new items under **Pending** with a date. The wiki conversation moves them to **Done** once they are in the wiki (EN and KO).

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
- 2026-11-28 · Device table: Box Y = height (Y, up), Box Z = depth (Z, front–back); a plane uses Length and Box Z. Motion numbers 0–7 confirmed.

## Question from the wiki conversation (2026-11-28)

- **Rot X · Tilt · Rotate on the Spatial Object device**: the wiki now says Rot X = RX (right axis), Tilt = RZ (front–back axis), Rotate = RY (up axis). Is that the right pairing with the editor's RX · RY · RZ? If not, write the correct one under Pending.
- **Orbit Link: who moves each object, and the loop guard** (06 Orbit Link, with the "In and Out together" subsection): Orbit In's viewer shows for every track "moved by Orbit Score" or "moved by Orbit Link" (new OSC `/orbit/n/steered 0|1`). Orbit Out's rows say "sends position" / "sends az el dist" / "settings only". Loop guard in Orbit Out: if the position wired in for an object is exactly Orbit In's own position for that object, it is not sent; the row says "loop: not sent" and Send Status says `loop, not sent: o2`. It is released as soon as the values differ. This replaces the old NOTE that such wiring "creates a feedback loop": it is now caught. Orbit In's new channels (active, vx…, sx…, rx…, room_*, morph_*) wired into Orbit Out are skipped quietly.
