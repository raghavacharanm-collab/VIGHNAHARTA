# VIGHNAHARTA: Path of Beginnings — Festival Edition

A Ganesh Chaturthi path-drawing puzzle. Guide Mushak through six courtyards; each successful route becomes part of the final rangoli. Includes a three-route, 90-second daily Festival Sprint.

## Play in seconds

Open **PLAY-VIGHNAHARTA-FESTIVAL.html** in a modern browser. Everything is embedded, including the artwork; no installation or connection is required. For a phone, use the hosted version or serve `dist` from any static web host. Landscape gives more drawing space.

Drag from Mushak to the shrine and release to run. Or tap connected waypoints and choose **Guide Mushak**. Collect offerings and light every lotus seal. Switches open gates; portals connect two pools; green durva protects against one moving shadow. Stone walls always block movement. When a portal connects, lift your finger and continue drawing from the OUT pool.

Use Undo, Clear, Retry, or Pause whenever needed. A guide or saved best-route overlay is available; assisted runs are capped at two stars. Settings include sound, volume and reduced motion. The game requests no player identity or account.

Keyboard: Tab to the canvas, arrows to move the pen, Shift + arrows for precision, Enter to place a waypoint, Space to run, Backspace to undo, Escape to pause/resume.

## Scoring and replay

Each offering is worth 200 points plus a combo bonus of up to 200. Collect within 2.5 seconds of the previous offering to continue a combo. Completion adds 1,000, unused path energy adds up to 1,200, and quicker planning/movement adds up to 500. Every lotus seal is mandatory. All offerings without guidance earns three stars; at least half earns two; otherwise one.

Campaign records keep the best score and highest stars for each chapter. Replays do not duplicate scores. The ending transforms the player's routes into a radial rangoli; **Save your rangoli** exports a PNG. The Festival Sprint uses a real 90-second clock that continues through pauses, menus, and backgrounding. Only completed-round points count. Daily variations are deterministic; the personal best is local, not an online leaderboard. No scores are submitted automatically.

Saved progress belongs to the current browser/origin. Moving the local HTML file, switching browsers, private browsing, or clearing browser storage can separate or erase progress. The game remains playable if storage is unavailable.

## Run or modify the source

Node.js 22.18+ and npm:

```sh
npm ci
npm run dev
npm test
npm run standalone
```

`src/engine.ts` contains deterministic gameplay, levels, collisions, gates, portals, shields, combos and score rules. `src/art.ts` draws the board and transforms routes into rangoli. `src/main.ts` handles screens, input, progression and the sprint clock. `src/audio.ts` synthesizes the soundtrack. `tests/game.test.mjs` validates complete runs and failure cases.

`demo-studio.html` records a 106-second scripted gameplay demonstration from the real engine without saving or submitting any scores. It is a demonstration, not a recording of a human's competitive run. Start the development server, open `/demo-studio.html`, select Record and keep that tab active until the download is ready.

## Competition context

Recovered from the complete **Bro Reaction** ChatGPT discussion of 13 September 2026. Development target: September 17 night. Organizer submission deadline in that discussion: September 20, 2026, 5:00 PM. The plan specifies mobile and laptop play, a live cross-campus game link, source, brief controls, a 1–3 minute demo, tools/assets, and team details. See `SUBMISSION.md`, `ASSETS.md`, and `CODE-GUIDE.md`.
