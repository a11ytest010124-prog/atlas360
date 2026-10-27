# ATLAS360 — self-hosted production assets (React 18)

This repository is prepared from the supplied ATLAS360 October 26 backup.

## Runtime network requirements

- React **18.3.1** and ReactDOM **18.3.1** are bundled into Vite's compiled JavaScript.
- Lucide React **0.468.0** icons are bundled into the compiled JavaScript.
- Tailwind CSS **4** is compiled into a local CSS asset.
- The deployed page does **not** request React, Lucide, or Tailwind from a CDN.
- Images are included as local assets.
- The **build** needs npm registry access on the build machine or GitHub Actions; end-user browsers do not.

## Deploy on GitHub Pages

1. Extract this ZIP and commit its contents to the **root** of a GitHub repository, on the `main` branch.
2. In repository **Settings → Pages**, select **GitHub Actions** as the build and deployment source.
3. Push to `main` or run **Actions → Build and deploy ATLAS360 → Run workflow**.
4. Open the GitHub Pages URL after the workflow succeeds.

The workflow installs dependencies in GitHub Actions, builds the production site, and deploys the `dist/` folder. No browser CDN is needed. Do **not** serve the repository's source `index.html` directly; it references TSX source and requires compilation.

## Build locally (if Node/npm access is available)

```bash
npm install
npm run build
```

Upload **the contents of `dist/`** to any static host, keeping `index.html` and `assets/` together. Use a local web server rather than opening the file with `file://` because browser security policies may block module scripts from local files.

## Office network caveats

A CDN-free bundle removes third-party JavaScript/CSS CDN dependencies, but corporate policies may still block `github.io`, JavaScript execution, browser storage, or external application links. GitHub Pages itself must be reachable from the office network. The application currently uses browser localStorage for some data; it does not synchronize that data across computers.

## Verification

After deploying, open browser DevTools → Network and reload. React, Lucide and Tailwind should load from local `/assets/` paths on the same origin, not from `unpkg.com`, `esm.sh`, `cdn.jsdelivr.net`, or `cdn.tailwindcss.com`.

**Build status:** This package is configured for a reproducible build, but the compiled production `dist/` has not been generated or tested in this environment because npm dependencies could not be downloaded here. GitHub Actions will perform the build and report errors if any.
