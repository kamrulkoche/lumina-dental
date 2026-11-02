# Reference analysis — "Lumina Dental" reel

**Source:** Facebook Reel `facebook.com/reel/1292965033904944` (from the share link
`facebook.com/share/r/1F27MbYT9c`), posted by *Umair Web app developer* and labelled **"AI content"**.
Caption: *"This isn't just a website — it's a LIVE DENTAL LAB."*

**Format:** 10.0 s, 720×1280 portrait. An AI-generated (not screen-recorded) shot of a laptop on a wooden
desk in a sunlit room. The site is shown on the laptop screen. Overlay text: *"What if your websites felt like this?"*

## How it was inspected — and the limits

The reel was opened in the user's logged-in Chrome. Frames were pulled from the `<video>` element at native
resolution and viewed at **0, 1, 2, 3, 4, 5, 6 and 7 s**, plus the reel's poster frame (the closing light-theme layout).

- Chrome refused screenshots of the Facebook tab after the first few captures, and the tab kept leaving the
  automation tab group, so **frames 7–10 s were not inspected individually**. The poster frame stands in for the ending.
- The bundled frame export (`lumina-reel-frames.json`) never reached disk, so **no reference frames are saved
  in this folder**. `extract-frames.js` here regenerates them from DevTools if they're wanted for comparison.
- The laptop screen fills only about 40% of each frame and is seen at an angle, so small text (utility-bar
  links, card captions) is **not legible**. Where the reel is unreadable, the copy below is written to fit the
  layout, not transcribed.

## Timeline (what each moment shows)

| t | Screen content |
|---|---|
| 0 s | Dark navy hero. Centred headline **"WHAT IF YOUR DENTAL WEBSITE WAS A LIVE LAB?"** with "LIVE LAB?" in cyan. A small tooth sits on a faint grid floor. The nav is over the hero. Cyan chat bubble bottom-right. |
| 1 s | Vertical cyan **scan beam** hits the tooth, which now stands on **concentric glowing rings**. Callout tags: **3D SCAN, ENAMEL (×2), ALIGNMENT**, joined to the tooth by thin lines. White band along the bottom: **"SCAN COMPLETE"**. |
| 2 s | Transition: the lab scene wipes in over the hero (panel/door wipe). The tooth becomes photoreal and the background turns steel-grey. |
| 3–4 s | **Robot lab.** Round ceiling light, white articulated **robot arms** working on the tooth, wall panels/monitors. Top-left: **"PRECISION DESIGN"** + small CTA. Right: **"MICRON"** + caption. A holo ring under the tooth. |
| 5–6 s | **"PRECISION FINISH"** bottom-left. A drill descends onto the tooth on a dark pedestal, with **cyan polish glow and sparks**. Pill group below the tooth: **READY** (cyan, filled) + **CONSULTATION →** (outline). |
| 7 s | **Glowing smile** (lips + teeth, cyan outline) replaces the tooth. **"SMILE COMPLETE"** bottom-left. Same pills. Vertical **ruler/scale** on the right edge. |
| end (poster) | **Light theme.** A frosted white card on a pale backdrop: smile image left; right, **"YOUR SMILE. ENGINEERED WITH [PRECISION]"** with PRECISION reversed out of a dark box; dark pill **"BOOK YOUR CONSULTATION →"**; slide dots below; a small tag top-right. Under the card, a row of white treatment cards (legible: *"Precision Smile Restoration"*, *"Next Smile Design…"*). Chat bubble bottom-right. |

## Persistent chrome

- **Nav (every frame):** tooth-outline logo + **LUMINA** (bold) **DENTAL** (light), letter-spaced. Links:
  **Home** (active, underlined), **Plans**, **Dentists ▾**, **Treatments**, **About Us**. Cyan pill **Book Now**
  far right. A slim utility row of tiny links sits above (unreadable).
- **Floating chat button**, cyan rounded square, bottom-right.
- **Bottom status band** (white) during the lab sequence.

## Design system extracted

**Colour**
| Token | Hex | Use |
|---|---|---|
| abyss / navy-950 / navy-900 | `#050d18` `#071423` `#0b1c30` | hero background, footer |
| steel-700 / steel-500 / steel-300 | `#3d5568` `#6b8599` `#a9bccb` | robot-lab room gradient, muted text |
| cyan-glow / cyan-soft / cyan-deep | `#4fd8ff` `#9beaff` `#12a8d6` | accent, glow, "LIVE LAB?", CTAs, rings |
| mist / cloud | `#eef2f5` `#f7f9fb` | closing light theme backgrounds |
| ink / ink-soft | `#0d1726` `#4a5868` | light-theme text, dark pill CTA |

**Type:** heavy geometric sans, uppercase, tight leading for headlines (→ **Montserrat 800**). Clean sans for
body and nav (→ **Inter**). Eyebrows are tiny, uppercase, and tracked about 0.3em.

**Shape and effects:** full-pill buttons; 24–32 px card radii; frosted glass (`backdrop-blur`, 1 px light
border); cyan outer glow (`0 0 24px / 64px`); fine grid lines on the dark hero; soft drop shadows on light cards.

**Motion observed:** headline reveal; scan beam + rotating rings; callouts fade in one after another; scene wipe
into the lab; robot arms articulating; drill descent + sparks; tooth → smile morph; status label changes per stage.

## Blueprint (as implemented)

**Pages:** `/` · `/plans` · `/dentists` (with `#restorative` `#cosmetic` `#orthodontics` from the dropdown) ·
`/treatments` · `/about` · `/book` · 404. The reel only shows the home page. The other routes exist because the
reel's nav links and CTAs have to go somewhere. They reuse the reel's two themes: a dark lab-grid banner over
light content.

**Home, top to bottom**
1. `LiveLab`: a pinned, 440-svh scroll sequence with four stages, mirroring the reel's 0–7 s:
   Scan → Precision Design → Precision Finish → Smile Complete. It has the status band, stage dots (clickable),
   the right-edge ruler, and the Ready/Consultation pills.
2. `PrecisionHero`: the poster frame's frosted card carousel: three slides, autoplay with a progress dot,
   arrows, dots and swipe, plus a parallax visual.
3. `TreatmentsRow`: the white card row under the card.
4. `StatsBand` and `BookingCta`: **added**, not in the reel.

**Components:** `Navbar` (hover/click/keyboard dropdown, full-screen mobile menu), `Footer`, `ChatWidget`,
`IntroLoader`, `PageHero`, `Button`/`ButtonLink`, `Reveal`/`Stagger`/`RevealText`; SVG visuals `Tooth`,
`Smile`, `RobotArm`, `Drill`, `HoloPlatform`.

**Animation spec:** easing `cubic-bezier(0.22,1,0.36,1)`; masked text reveals at 0.75–0.8 s with a 60–100 ms
stagger; stage crossfades at 0.5–0.9 s; ring spins at 18 s and 26 s; `prefers-reduced-motion` turns all of it off.

**Responsive:** below 1024 px the nav collapses to a hamburger. Below 640 px the Book Now pill moves into the
menu. On phones and tablets the lab stage titles move above the visual so they never collide with the pills.

## Known differences from the reel

- The reel's tooth, lab and smile are **photoreal AI renders**. Here they're hand-built SVG/CSS illustrations:
  crisp, light, animatable, no image requests, but stylised rather than photographic.
- The reel's 2 s "wipe into the lab" is approximated by a crossfade from the navy background to the steel lab.
- Small copy (utility links, card captions, slide tag) was unreadable and has been written to fit.
- Subpages, booking flow, plans pricing, dentist names and stats are **invented to make the site complete**.
  Replace them with real clinic data before any public use.
