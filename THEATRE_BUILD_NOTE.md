# THE THEATRE — build note (2026-11-03)

Page added: `theatre.html` → live route `https://quescreations.github.io/theatre.html`.
Built under Que's THEATRE RULE (2026-11-03): a film that is FINISHED + FULL-SIZE +
GLITCH-FREE + PERFECT SCRIPT true to its scenes = a COMPLETE MOVIE, and complete
movies live together in one film room — this website page (the safety net) plus the
public YouTube version (the "THE THEATRE — Complete Films" playlist lane, owned by
the Rated M room, not this build).

## Structure (mirrors music.html skeleton + house tokens; no redesign)
- Marquee hero: THE THEATRE — Complete Films of QOrigin Studios, hero image
  assets/brand/qyro.webp (same as homepage), with the house rule stated verbatim on
  the page: "A film enters this room only when it is finished, glitch-free, and
  true to its script."
- NOW SHOWING (complete films): honest empty state — no verified complete movie
  has passed the bar yet, so the screen is presented dark with the standing line
  "Films are added as they complete." No placeholder film was invented.
- SERIES SHELF (episodes, clearly separate from films) — only items verified
  public in house records, each URL copied from its record:
  - EVERYBODY EATS Ep. 1 "Down 2, No Time Left — One Free Throw for Everything" —
    YouTube embed + link https://youtu.be/PwWY6b6mxt8 (public 2026-10-27,
    @AfroAnimeQC, crowned V2 master). Record: memory/2026-10-29.md release entry;
    memory/2026-10-27.md.
  - HOOD REAPER Ep. 1 v2 "First Night on the Block" — YouTube embed + link
    https://www.youtube.com/watch?v=llUIjpPdZxk (LIVE/PUBLIC per
    memory/2026-10-18.md; v2 supersedes the v1 premiere i87P_6lnDyc, which is
    UNLISTED — deliberately not linked anywhere on the page).
  - THE WHOLE NINE Chapters 1–3 — chapter links copied verbatim from
    ~/workspace/que-story/drop-state.json (posted + verified entries):
    Ch.1 "Small Town" IG reel/DekkgyUjx4I + TikTok 7697057258642918686;
    Ch.2 "The Mound" IG reel/De0S2SwDGra + TikTok 7699663536011660574;
    Ch.3 "The Move" IG reel/DfGSKwcDjWk (TikTok leg failed 2026-10-29 — no
    TikTok link shown for Ch.3, because there isn't one).
- COMING ATTRACTIONS (marked "not yet showing"):
  - THE ARTIST vs TJ — the war film: in production (Versus room). No date stated;
    none is on record.
- THE KIDS THEATRE (added same day, Que 2026-11-03 12:00 CST: "we can do the
  same for the kids channel") — a clearly separate room on the same page
  (#kids-theatre, gold-ruled, own nav link). It is a WINDOW onto the kids
  YouTube channel (THE BOY CREW, UCZDOfSyvZLWzyFS3ckAghOA, handle
  @ghostshift-quescreations) — never a second host; the page states the sealed
  lane on its face (kids channel only — never main channel, IG, or TikTok).
  Founding seat: BOY CREW Adventure #1 sits in the kids room's Coming
  Attractions (premieres Sat Nov 7, 12:00 PM on the boys' channel) — NO
  embed/link to any video until its live kids-channel URL verifies after the
  premiere; the only link is the channel itself. Kids Now Showing is an honest
  empty state ("Kids films are added as they complete") under the same bar.
  The Boy Crew card was MOVED out of the main Coming Attractions into this
  room — kids premieres are announced in the kids room only.

## Deliberately left off (and why)
- AFTER THE LIE (film + episodes): excluded by the rule itself — its fix program
  is still open, it has not passed the bar; Movie V1 also carries a DO NOT POST
  history. Listing it would break the rule the page states.
- MADUKES movie cut: v1 FAILED (do not post); episode rebuilds have no verified
  public URL in the records.
- GRIND animated episodes: presented elsewhere on this site already, but the
  series' posting line is on HOLD and episodes carry a known opening flaw — they
  do not meet the Theatre bar.
- GOLDBLOOD pilot / TIDEBOUND films / SHINOBI episodes: no verified public
  full-film URL in the house records (SHINOBI anime posting hold stands).
- Versus drops: public, but they are short fight films already homed on
  versus.html — not Theatre (complete movie / series episode) material.
- "MEET THE BOY CREW" (kids channel, youtube.com/watch?v=Pbt2xuvq02E): the one
  kids-channel video with a URL in the records — EXCLUDED from the Kids
  Theatre because the house record carries an explicit correction that the
  published version is not an acceptable final (bad framing/faces cut, DJ
  placeholder mix). It fails the bar; when a corrected, passed version is the
  live one, it can take a kids seat.
- Ghost Shift episodes on the kids channel: an Oct 2026 snapshot shows episodes
  on the channel, but no individual finished episode has a verified public URL
  + passed state in the records — not seated. Seating rule going forward: a
  kids film enters only with a verified live kids-channel URL and a passed
  finish on record, same as the main room.

## Site wiring
- index.html: "Theatre" added to the top nav (after Music) and to the footer
  link run. Other pages' navs (versus.html, treasure.html, worlds/) were NOT
  swept in this pass — follow-up if Que wants the link everywhere.
- theatre.html carries its own nav (Home / Now Showing / Series Shelf / Coming
  Attractions / Versus / Music / Store) and the standard footer with a Theatre
  link, matching music.html conventions.

## Deploy — BLOCKED ON GITHUB AUTH (as of 2026-11-03, this build)
Repo: ~/workspace/site-fix/repo (remote: github.com/quescreations/
quescreations.github.io). Pages serves from main; local `universe` and `main`
both sat at 9b31745 (= origin/main) before this build. The Theatre commit is
made locally on branch `universe` (parent = 9b31745, fast-forward) but is NOT
pushed — every route was tried and failed on auth, 2026-11-03:
1. `git push origin universe:main` → "fatal: could not read Username for
   'https://github.com'" (no credential in this shell).
2. SSH (git@github.com) → connection reset by the environment proxy.
3. GitHub API via the house legacy-github connector (gh-api.py, stored
   custom.github credential attached) → 401 "Bad credentials" — consistent
   with the stored PAT being the spent one Que already has slated to revoke.
   Per that connector's doc, the next step is a credential RECONNECT
   (credentials.request_api_access), which is a user/parent step.
UNBLOCK (one step for Que/parent): reconnect the GitHub credential (or run
Que's secure token entry), then from this repo:
`git push origin universe:main`
and verify https://quescreations.github.io/theatre.html loads with the
Theatre content present. Nothing about the page itself is pending — content,
links, homepage wiring, and this note are complete in the local commit.

## Addendum — 2026-11-07: Adventure #1 seated (Kids NOW SHOWING)
- The premiere fired Sat Nov 7, 12:00 PM Chicago and the film verified PUBLIC:
  "The Boy Crew — The Great Doodle Tangle!" at https://youtu.be/pHuSwO6cuk4
  (THE BOY CREW, UCZDOfSyvZLWzyFS3ckAghOA); also seated in the YouTube playlist
  "THE THEATRE — Complete Films" (PLQWuDTY1VPEw).
- Per this note's own seating rule, theatre.html's Kids Theatre room was updated:
  Adventure #1 moved from Kids Coming Attractions to Kids NOW SHOWING with the
  youtube-nocookie embed (pHuSwO6cuk4) + watch link + channel link; the kids
  screen dark empty-state was retired; Kids Coming Attractions now holds an
  honest open-seat notice. Committed locally on `universe`; rides the same
  pending push (`git push origin universe:main`) once GitHub auth unblocks.

## Addendum — 2026-11-07: AFTER THE LIE seated (main NOW SHOWING, founding film)
- Q's seat order (via Media Lab, 2026-11-07 12:50): build the AFTER THE LIE seat
  into the same pending push so the main room doesn't open empty.
- This SUPERSEDES the 2026-11-03 build note's "Deliberately left off" entry for
  AFTER THE LIE: Q ruled Movie V2 a COMPLETE MOVIE / Theatre entry on
  2026-11-04 (Secret Sauce + Archive room), and it has been PUBLIC since then —
  the website seat was the only open leg.
- Verified public record (Archive room drop state, memory/2026-11-04.md +
  2026-11-05.md): "AFTER THE LIE — The Complete Movie",
  https://www.youtube.com/watch?v=mrr7Y7vb_Rw (@AfroAnimeQC), seated in the
  playlist "THE THEATRE — Complete Films" (PLTuOJZD4qlkQ).
- theatre.html main NOW SHOWING updated: the dark-screen empty state is retired;
  AFTER THE LIE takes the founding-film seat with the youtube-nocookie embed
  (mrr7Y7vb_Rw) + watch link. Nothing else on the page changed. Committed
  locally on `universe`; rides the same pending push (universe:main).
