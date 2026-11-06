# Polish 144-tile set — 3D printing handoff

This folder contains the **designer variant** of a physical Polish word-game set, intended for a Bambu Lab A1 and PLA. Print all four different plates once to make 144 loose tiles. This independent project is inspired by Bananagrams; its original letter distribution is inspired by Polish Scrabble, not an official Bananagrams distribution.

**Status: models, not verified prints.** The four STL files contain 3D geometry, not printer-ready instructions. Slice them for your actual printer before printing. No 3MF slicer project or G-code is included. The image in the [main README](../README.md) is a rendering, not a photograph of a print.

## How to play with the physical tiles

These project rules are adapted for tabletop play from the [browser-game rules](../docs/README.md); they are not a claim about official Bananagrams rules.

1. For 1–4 players, mix the tiles face down in a shared pool and give each player 21. Everyone plays simultaneously, building their own crossword of Polish words horizontally and vertically. Players may rearrange their own tiles.
2. All tiles in a player's crossword must form one connected group, touching edge to edge. Agree in advance which words are valid; players must check them themselves.
3. When someone has used all their tiles in a connected crossword, they announce they are ready. If the pool has at least one tile per player, each player takes one and play continues.
4. If fewer tiles remain in the pool than there are players, the first player to use all their tiles in a connected crossword wins. In solo play, exhaust the pool and finish the crossword. This version has no tile exchange.

The physical game does not require a board. The browser implementation instead has a 15 × 15 grid, checks connectivity and an empty hand but **does not validate words**; its room/server details and limitations are in [the game documentation](../docs/README.md) and [logic source](../docs/logic.js).

## Files and design parameters

- [`plyta-1-designerska.stl`](plyta-1-designerska.stl), [`plyta-2-designerska.stl`](plyta-2-designerska.stl), [`plyta-3-designerska.stl`](plyta-3-designerska.stl), [`plyta-4-designerska.stl`](plyta-4-designerska.stl): four different arrangements, 36 separate tiles each. Import and print each once, separately.
- [`rozklad.json`](rozklad.json): authoritative count of each letter for this set. The layout in [`parametry.json`](parametry.json) totals 144 and agrees with it; rows are listed from the bottom of each plate. The browser's matching distribution is in [`docs/logic.js`](../docs/logic.js). Keep both in sync if changing the design.
- [`parametry.json`](parametry.json): recorded dimensions, font metrics and per-plate layouts. Units below are millimetres.

Letter counts, with no blank tiles:

A 13 · Ą 2 · B 3 · C 4 · Ć 2 · D 4 · E 10 · Ę 2 · F 2 · G 3 · H 3 · I 12 · J 3 · K 4 · L 4 · Ł 3 · M 4 · N 7 · Ń 2 · O 9 · Ó 2 · P 4 · R 6 · S 6 · Ś 2 · T 4 · U 3 · W 6 · Y 6 · Z 7 · Ź 1 · Ż 1.

Each tile is 20 × 20, with a 3.2 body and 0.6 raised letter, 3.8 total height. The 6 × 6 arrangement is approximately 130 × 130 with 2 between tiles. Recorded design details include 3 corner radius, 1 upper-edge radius, 0.4 bottom chamfer and 1.2 letter margin. The recorded font is Bahnschrift Bold (weight 700, width 100); scale, cap height and baseline are in the parameters file. The A1's nominal build volume is 256 × 256 × 256 mm ([Bambu Lab FAQ](https://wiki.bambulab.com/en/a1/manual/faq)); verify your usable area in the slicer.

## How the models were made and reproducibility

The matching designer-generation source was inspected outside this repository; it is **not included here**. The four repository STLs were SHA-256 compared with its output copies and matched. This establishes that the copies match, not that a fresh run would be byte-identical. The inspected source describes the following method:

1. Read the ordered letter counts, expand them into a sequence and distribute every fourth tile to each of four 6 × 6 plates, in rows from the bottom.
2. Extract Bahnschrift Bold vector glyph outlines with fontTools, flatten the curves, use non-zero fill, and apply a shared scale and baseline. Extrude the glyphs and union them into rounded tile bodies, with the letters overlapping the body to make connected solids.
3. Make the chamfered/rounded bodies and combine the separated tiles using Manifold; convert the result to a triangular mesh with trimesh and export each plate as STL. The source records parameters and plate layouts in JSON.

The generator, its dependency specification, the exact font file/version and a locked environment are not shipped in this repository. There is therefore **no self-contained regeneration command here**. A future maintainer should locate and review the source and font rights, make dependencies and inputs available with appropriate permission, and verify regenerated geometry and distribution before replacing the STLs. Do not assume a different font or library version gives identical results. Font and asset redistribution rights need separate verification; an open licence is not assumed.

## Printing: starting points, not a validated profile

The original preparation suggested the settings below; **neither slicing nor a physical test print has been performed**. Choose profiles appropriate to your own printer, plate and filament and follow their safety instructions.

1. In Bambu Studio select **Bambu Lab A1**, a **0.4 mm nozzle**, your actual build plate and PLA profile. Do not use an A1 mini profile for an A1. Keep temperatures and cooling appropriate to the filament and plate; Bambu's [A1 manual](https://wiki.bambulab.com/en/a1/manual/intro-a1) gives PLA nozzle guidance of approximately 210–220 °C, subject to the filament manufacturer's range.
2. Import one STL in millimetres without scaling or rotating it: flat bottoms on the bed, letters up. Keep all 36 tiles in their arrangement and centre the plate in the usable area. Print the whole plate layer by layer rather than by object if sequential printing would collide.
3. The prior proposed starting point was **0.20 mm layers and first layer, 100% infill and supports off**. This is not a tested profile or a guarantee. Use the applicable printer/filament profile for other settings.
4. Slice and inspect the entire layer preview, especially the first layer, raised glyphs, accents and dots. Resolve warnings about collisions, print area or missing features before exporting printer-specific G-code or sending the job.
5. First make a small test in a separate slicer project: use **Split → To Objects** or the equivalent and retain an Ą and an Ś tile. Do not overwrite the STLs. Check adhesion, legibility and strength before printing all four full plates.

### Adhesion, supports and colour

The tiles are separate, not a connected grid: every tile must adhere. Watch the first layer and stop if any tile comes loose. Start without a brim; if adhesion is poor, check bed cleanliness and first-layer settings. If adding a brim, preview it: neighbouring brims may join across the 2 mm gaps. Remove them afterwards, or print fewer tiles farther apart.

Previous mesh checks reported 36 watertight, connected solids per plate, no downward-facing overhangs steeper than 45° apart from the bottom, and letter cross-sections supported by the body. Visually separate accents are connected through the tile body rather than floating as separate solids. This motivates a **no-support test**, but mesh analysis cannot prove adhesion, strength, or a successful print.

For optional two-colour printing, the raised letters begin at Z=3.2 mm. With constant 0.20 mm layers, the first letter layer should end at Z=3.40 mm. After slicing, locate that layer in preview and set a filament change or pause **before it starts**, following the slicer and printer instructions. Confirm that the body is complete and the whole first letter layer uses the new colour. A pause alone does not change filament. If actual layer heights differ, use the preview rather than a layer number. Alternatively, paint the raised letters after printing.

**Safety:** Small tiles are a choking hazard and are not intended for young children.

## Verification and open work

- Previous preparation reported checks of dimensions, watertightness, connectivity, overhangs, letter support and geometry-derived letter counts. The checks were performed outside this repository; their scripts and results are not included here. The repository copies match the checked designer STL copies by SHA-256. The JSON layouts and distribution also match when counted; this does not independently identify the letters in the meshes.
- No slicer preview, printer trial, print time, filament use, adhesion, real-world legibility or durability has been verified. In particular, inspect small diacritics and dots and test the two-colour pause on the actual setup.
- The distribution is a proposal; playtesting and the choice of acceptable words remain open. Rules may evolve.
- The complete source, dependency versions, exact font provenance and permissions need a portable, reviewable solution. Do not describe regeneration as verified until it has actually been run and compared.

## Guide for the next agent

Start with this file, the two JSON files, the [game rules](../docs/README.md), and the [browser logic](../docs/logic.js). Preserve the distinction between physical play, browser implementation, 3D model, slicer project and tested print. Before changing a distribution, reconcile the JSON, plate geometry/layout and browser logic; document any intentional divergence. Before changing models, establish their source and licensing, save reproducible inputs and versions, and check each plate's geometry and actual letter counts. For print validation, record the slicer and version, printer, nozzle, filament, plate, settings, preview and observed result; report failures and untested items rather than implying success. Do not commit machine-specific paths, secrets, or generated printer files without an explicit reason.