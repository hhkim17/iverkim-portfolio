# Orbit Score wiki — pending changes

Changes made to Orbit Score that the wiki (`index.html`) does not cover yet.
Written from the development conversation; the wiki is edited in another conversation.
Remove an item once it is in the wiki (EN and KO).

## 2026-11-28

- **Orbit_Score component, File page** (01.2 TouchDesigner, parameter table): a third page beside About and OSC. *Project Folder* shows the folder of the `.toe` (read only); *Open Folder* opens it in Finder / Explorer. The table currently says "two pages".
- **Project folder** (01.3 Saving): keep the project in a folder of its own and move the whole folder, not the `.toe` alone. Orbit Score writes `spatialize_snapshots/` (on every save: settings and paths per Live set plus dated copies) and `spatialize_scenes/` (SCENES → EXPORT); TouchDesigner writes `Backup/`. Saved rooms and custom speaker layouts make no files (kept in the project and the Live set). The logo and the `hoa` script are now inside the component, so a `.toe` or `.tox` works without extra files.
- **Screenshot needed — SPACE tab** (FIG. 3.2, `media/ui-space.jpg`): the current picture has no DEPTH / HEIGHT row under REFLECTIONS and no SAVE PRESET / DELETE.
- **Screenshot (optional) — LOG tab**: OSC OUT section at the top (Send positions ON, host, PORT, rate, status line). The wiki text already describes it; there is no LOG picture yet.
