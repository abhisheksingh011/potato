# Potato — README visuals

This folder holds the images the main [README](../README.md) embeds. They ship today as
**labeled SVG placeholders** so the README renders cleanly. Replace each one with a real
capture when you record it.

## How to swap a placeholder

Each placeholder is an `.svg`. Your real captures will be `.gif` (hero) or `.png` (stills).
So for each visual you do **two tiny things**:

1. Drop your capture into this folder using the filename in the table below.
2. In [`README.md`](../README.md), change that image's extension once (`…/hero.svg` → `…/hero.gif`).
   Each `<img>` is on its own line — search the README for `assets/` to find all four.

(You can delete the matching `.svg` placeholder once the real file is in.)

## What to capture

| File to add | Replaces | What to show | Specs |
|---|---|---|---|
| `hero.gif` | `hero.svg` | **The money loop:** 🤖 AI Import → paste reply → diagram appears → ▶ Play animates → 💰 Cost opens | ~1200px wide, **< 5 MB**, 6–10 s loop, trim dead frames |
| `cost-estimator.png` | `cost-estimator.svg` | The 💰 Cost panel open on a rich diagram, per-service breakdown + monthly total visible | ~1000px wide, PNG, optimized |
| `service-tooltip.png` | `service-tooltip.svg` | A node tooltip (e.g. Lambda or DynamoDB) showing SLA · limits · when-to-use · pitfalls | ~1000px wide, PNG, optimized |
| `saved-viewer.png` | `saved-viewer.svg` | A saved `.potato.html` open in the browser, mid ▶ Play, narration caption visible | ~1000px wide, PNG, optimized |

## Tools

- **GIF:** [ScreenToGif](https://www.screentogif.com/) (Windows, free) — record, trim, export. Ideal here.
- **Stills:** Windows `Win + Shift + S` (Snipping Tool) or the browser devtools screenshot.
- **Optimize:** [tinypng.com](https://tinypng.com/) for PNGs; in ScreenToGif use the built-in size reducer for the GIF.

## Rules of thumb

- One hero GIF beats five competing GIFs — keep the rest static.
- Keep total folder size lean; Potato's whole pitch is "one lightweight file."
- Capture on the **dark theme** for the hero (highest contrast); a light-theme still is a nice optional extra (`themes.png`).

## Also worth doing (outside this folder)

- **Social preview image** (1280×640): GitHub → Settings → General → Social preview. This is what
  shows when the repo link is shared on X / HN / Reddit / Slack — high ROI for launch day.
