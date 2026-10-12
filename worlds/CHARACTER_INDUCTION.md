# CHARACTER INDUCTION — The Whole 9 Yards

**Standing law (Que, 2026-10-11):** every character added to the universe gets ALL of it, no shortcuts:
1. Built as a production-ready character (identity block, key visual, production assets).
2. Added as art in the normal art tab on quescreations.github.io.
3. A Sketchbook Alive come-alive version — in place, per the Come-Alive Law.

## Step 1 — Production build
- Identity block in the character's folder: species, look (locked skin tone + features for family-based characters — zero drift), personality, powers/role, universe placement, merged-from/origin notes.
- Key visual (full body, finished).
- Clean pencil reference sheet (draw-from-ready, grayscale realism-pencil).
- Mascot/chibi treatment + 3D form queued per the mascot law.
- Originality check: "we create, not steal" — if it reads close to any existing IP, it does NOT ship until Que clears it with his own eyes.

## Step 2 — Art tab (this repo, `index.html` #sketchbook section)
- Copy the key visual to `assets/creature-<slug>.webp` (webp, q80).
- Add a card to the "Merged Creatures" grid (or the right group):
  ```html
  <div class="card"><div class="art"><img src="assets/creature-<slug>.webp" alt="<NAME> — original creature by Que" loading="lazy"></div>
  <div class="body"><span class="tag">Merged Creature · <Series/Placement></span><h3><NAME></h3><p><one-line lore from the identity block></p>[COME-ALIVE]</div></div>
  ```
- If the character is under IP/originality review: include the art entry but add `<p class="flag">⚠ Come-alive version held for Que's review.</p>` and NO video.

## Step 3 — Come-alive version (Come-Alive Law)
- Source: the character's PENCIL reference sheet.
- `media.generate_video` (image-to-video): the pencil sketch stirs to life IN PLACE on the paper, then color blooms/washes over the SAME artwork — same pose, same composition, no cut, no scene change. (Reference: Que's HOWL wolf video — moon glows, breath streams from the mouth.)
- Save as `assets/comealive-<slug>.mp4`. Verify visually: t=1s still pencil, late frames full color, same composition.
- Embed in the card:
  ```html
  <video class="cal-video" src="assets/comealive-<slug>.mp4" controls preload="metadata" playsinline poster="assets/creature-<slug>.webp"></video>
  <p class="cal-cap">▶ Watch it come alive — pencil to living creature.</p>
  ```
- NEVER the power-of-artist hard-cut format here — "come alive" never describes a hard cut.

## Step 4 — Ship
- `git add -A && git commit -m "Universe induction: <NAME>" && git push origin main`
- Verify live: https://quescreations.github.io — nav tab, art entry, video plays.
- Log the induction in the daily memory log.
