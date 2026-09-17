# Validation — 14 September 2026

- TypeScript and production build passed.
- 22 automated engine tests passed: all six chapters, mirrored routes, collisions at low frame rates, closed gates, portal validation and energy, durva protection, missing seals, retry resets, scoring, assisted runs, corrupt saves and 15 daily seeds.
- Browser campaign completed all six chapters with every offering and seal: 18/18 stars. Final score in this run: 17,816. Actual routes appeared in the rangoli ending.
- Saved progress survived page reloads. Failure for missing seals and Start fresh recovery checked.
- Sprint reached its final result after the 90-second clock; settings did not stop the timer. Incomplete round points were excluded.
- Layout inspected at laptop sizes, 390 × 844 portrait and 844 × 390 landscape. Landscape controls were enlarged and placed beside the board. These are simulated browser sizes, not physical-phone testing.
- No browser console errors in the responsive test view.
- Standalone HTML checked for embedded scripts, styles and both images. Direct local-file browser opening was blocked by the automation browser URL policy, so file:// execution was not verified by automation.
- Demo recording: 105.999 seconds, 1280 × 800 with audio. A gameplay frame was inspected. The demonstration uses scripted paths through the real engine and does not save or submit scores.

These checks are evidence of tested behavior, not a guarantee that every browser or device is bug-free.
