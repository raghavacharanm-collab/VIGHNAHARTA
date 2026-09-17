# A short code walkthrough

## What makes it different?
The player draws a route instead of directly steering the character. Gates, portals, collectible order and energy turn drawing into a planning puzzle. The final rangoli is made from the actual successful routes. The decorative reveal therefore records the player's decisions.

## How does Mushak move?
Pointer coordinates are converted from the displayed canvas size to a fixed 1000 × 600 world. Waypoints form the route. `Run.step()` travels along each segment at a consistent speed. Movement is split into very small steps, so long strokes and slower frames cannot jump through a wall.

## How do collisions work?
For a rectangular wall, find the nearest point on the rectangle to Mushak's center. A distance less than the character's radius means a collision. Gates use the same geometry but stop blocking after their matching switch is touched. Moving shadows use a circle-distance test and follow deterministic sine-wave motion.

## How are portals safe?
A portal is stored as a special jump waypoint. The engine checks that Mushak is at the entrance, the destination matches the exit, and the portal has not already been used. Only a validated jump bypasses the space between the pools. It uses no path energy.

## How do progress and score work?
The engine emits events when items, seals, gates, protection or results change. The screen reacts with audio, particles and UI updates. A successful chapter stores its best score, stars and path. Saved data is validated before use, and storage failures do not prevent play. Sprint scoring adds only completed rounds. It has no server or authenticated leaderboard, so local scores are not claimed to be tamper-proof.

## How is the rangoli made?
Each saved route is scaled into a radial section, reflected, and rotated by 60 degrees relative to the previous route. Six user-created paths become twelve balanced strands. Lamps and petals animate around this drawing as the view pulls back.

## Why this architecture?
The engine is separate from rendering and input. It can be tested without a browser, including mirrored layouts and low frame rates. The renderer is resolution independent. The production game has no runtime framework or remote network dependency. Vite and TypeScript are development/build tools.

## What should I demonstrate?
Show drawing and instant movement, opening a gate through a switch, passing through a portal, the durva shield, combo scoring, the saved route becoming rangoli, and replay. Explain the above in your own words; do not claim you wrote components without assistance. AI-assisted coding and generated art are disclosed in the credits.
