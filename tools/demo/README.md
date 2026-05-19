# seo-pro-max-demo

Remotion project that renders the `assets/demo.gif` shown at the top of the main README.

## Run the studio (preview + edit)

```bash
cd tools/demo
npm install
npm run dev
```

Studio opens at http://localhost:3000.

## Render

```bash
# MP4 (for Twitter / LinkedIn — autoplays with sound off)
npm run render:mp4
# -> tools/demo/out/demo.mp4

# GIF (for README banner — < 2 MB target)
npm run render:gif
# -> tools/demo/out/demo.gif
```

Both at once:

```bash
npm run render:all
```

After render, copy the result to the repo root and commit:

```bash
mkdir -p ../../assets
cp out/demo.gif ../../assets/demo.gif
cp out/demo.mp4 ../../assets/demo.mp4
```

Then in the README, the banner image at the top references `assets/demo.gif`.

## Composition specs

- ID: `SeoProMaxDemo`
- Size: 1280 × 720 (16:9)
- Duration: 240 frames @ 30fps = 8 seconds
- Scenes:
  - 0.0 – 3.0s — Terminal (npx command + auto-detect + install)
  - 3.0 – 4.0s — Transition (flash + slide)
  - 4.0 – 7.0s — IDE (Cursor with chat + animated head tags)
  - 7.0 – 8.0s — Outro (logo + tagline + install line)

## Not packaged

This folder is excluded from the npm tarball via the `files` whitelist in the
root `package.json`. It only ships in the GitHub repo for contributors who
want to re-render the demo.
