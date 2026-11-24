# Parts Counter

A truck parts counter idle game for phone and PC.

- `src/` the game. `src/index.html` loads each script; `node build.js` inlines them into `parts-counter.html`.
- `parts-counter.html` the single file the Android APK and Windows .exe are built from.
- `tests/bot.js` plays the whole game on fast-forward and fails if prices drop, income stalls, a wait gets too long,
  or a milestone misses the target pace in `tests/pace.json`. Run: `node tests/bot.js`
- `tests/saves.js` loads every save in `tests/saves/` (saves from older versions) and checks they still work.
  When the save format changes, add a new save there and keep the old ones.
- `tests/looks.js` opens all 28 looks on every tab (needs Playwright).

GitHub runs all three on every push (`.github/workflows/test.yml`). The APK and .exe builds run the bot and save
checks first, so a broken version is never built.
