# Development

The browser game is in `docs/`, the print models in `3d/`, and automated checks in `test/`. See `docs/README.md` for rules, architecture, local server and known limitations; see `3d/README.md` for geometry and printing guidance. The rooms service is a trusted-network prototype, not a hardened public service. GitHub Pages hosts static solo only.

## Continuation guide

- `docs/logic.js` is the shared mutable rules engine, exported to Node and the browser. A game has a bag, players with hands and sparse `x,y` boards, and a winner index or `null`. Solo calls it directly; the room server applies online actions to its copy.
- `docs/ui.js` renders only the current player's board and hand, saves solo to `localStorage`, and polls room state once a second. Room credentials are in `sessionStorage`; leaving clears the tab's credentials but does not free the server-side slot.
- `docs/server.js` serves the site and `/api/` room endpoints. The first member hosts; rooms and games disappear on restart. State responses include every player's hands and boards and the bag, so the UI is not a privacy boundary. Tokens appear in state-request query strings. HTTPS, access controls, retention, rate limiting and room lifecycle need consideration before any public deployment.
- `docs/tutorial.js` scripts its own illustrative scenes rather than running the rules engine. Keep its step text and scenes synchronized with actual rules; its visual claim that only the player sees their letters does not imply network secrecy.

The implemented game is simultaneous, with 21 initial tiles per player and a fixed 15×15 board. A claim requires an empty hand and a nonempty orthogonally connected board; it does **not** validate words or their shapes. If fewer tiles remain than players, the claimant wins; otherwise everyone draws one. There is no tile exchange or opponent-board view. Solo uses the same draw rule and wins only when the bag is empty. Update tests, tutorial and Polish user-facing rules together if these decisions change.

Tests from the repository root:

```sh
node test/logic.test.js
node test/server.test.js
python test/browser_test.py
```

Browser tests require Python, Playwright and Chrome. Solo state uses localStorage; room credentials use sessionStorage. Multiplayer rooms are volatile and are lost on server restart.
