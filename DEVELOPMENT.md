# Development

The browser game is in `docs/`, the print models in `3d/`, and automated checks in `test/`. See `docs/README.md` for rules, architecture, local server and known limitations; see `3d/README.md` for geometry and printing guidance. The rooms service is a trusted-network prototype, not a hardened public service. GitHub Pages hosts static solo only.

Tests from the repository root:

```sh
node test/logic.test.js
node test/server.test.js
python test/browser_test.py
```

Browser tests require Python, Playwright and Chrome. Solo state uses localStorage; room credentials use sessionStorage. Multiplayer rooms are volatile and are lost on server restart.
