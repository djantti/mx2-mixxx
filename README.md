# Traktor MX2 Mixxx mapping

This repository contains an improved Native Instruments **Traktor MX2** mapping for [Mixxx](https://www.mixxx.org) (version 2.6 or higher). New features include expanded effect controls, sampler pads, user configurable settings and customizable LED color themes.

## Controller overview

![Traktor MX2 (schematic view)](traktor_mx2.png)

## Mapping description

Most knobs and buttons function as they are labeled and follow the manufacturer's original mapping where applicable. Mixxx's [standard controls](https://manual.mixxx.org/2.6/en/chapters/effects#controller-effects-mapping) are used for the top row effect knobs (**2**), the effect focus buttons (**3**) and for the effect toggle (**4**) buttons.

### Decks (1–29)

| No. | Element | Primary function | Secondary function |
| --- | --- | --- | --- |
| 1 | FX main knob | Control FX chain dry / wet balance ||
| 2 | FX param knob | <p>**Normal mode:** Control FX meta parameter</p><p>**Focus mode:** Adjust focused effect parameter</p> ||
| 3 | FX focus button | <p>**Press** to toggle FX parameter panel</p><p>**Hold** to enter effect focus select mode ||
| 4 | FX toggle button | <p>**Normal mode:** Toggle effect on / off</p><p>**Focus select mode:** Choose focused effect</p><p>**Focus mode:** Toggle focused effect parameter on / off</p> | Cycle through effects |
| 5 | FAV button | Use next color for selected track | Use previous color for selected track |
| 6 | Star button | Add track to Auto DJ queue (bottom) | Add track to Auto DJ queue (top) |
| 7 | Browse encoder | <p>**Press** to load selected track</p><p>**Turn** to scroll through items in tracks listing</p> | <p>**Press** to enter to select the active sidebar item</p><p>**Turn** to scroll through items in library sidebar</p> |
| 8 | Preview button | Load and play / pause track in preview deck ||
| 9 | VIEW button | Toggle big library mode ||
| 10 | REV button | **Hold** to play track in reverse | **Hold** for reverse play with slip mode |
| 11 | FLX button | Toggle slip mode on / off ||
| 12 | TT button | Set jogwheel to turntable mode ||
| 13 | JOG button | Set jogwheel to jog mode ||
| 14 | Jog wheel | <p>**Touch** the top of the jog wheel and turn it to scratch</p><p>**Move** the jog wheel from the edge to nudge the track</p> | Turn the jog wheel to seek quickly while stopped |
| 15 | SHIFT button | Activates secondary functions when held ||
| 16 | PLAY button | Toggle track playback ||
| 17 | CUE button | Set default cue point | Jump to cue point and stop |
| 18 | Move encoder | <p>**Press** and *hold* to activate a rolling loop of the defined number of beats. Once released, playback will resume from the original position.</p><p>**Turn** to beatjump backwards / forwards</p><p>**Stems mode:** *Turn* to control stem track volume while pad 5–8 is held</p> | **Press** to activate and jump to current loop while stopping playback |
| 19 | Keylock button | <p>**Press** to toggle keylock</p><p>**Hold** and turn loop encoder (**20**) to change track pitch</p> ||
| 20 | Loop encoder | <p>**Press** to set and enable a loop of the defined number of beats</p><p>**Turn** to halve or double loop size</p><p>**Turn** while *holding* keylock (**19**) to adjust track pitch</p><p>**Stems mode:** While *holding* pad 5–8 (**26**) *turn* to adjust stem track FX super knob</p> | <p>**Press** to toggle current loop on / off</p><p>**Stems mode:** While *holding* pad 5–8 (**26**) *turn* to select a stem Quick FX preset</p> |
| 21 | Hotcues button | Activate **hotcues** pad mode ||
| 22 | Stems button | Activate **stems** pad mode ||
| 23 | Samples button | Activate **samples** pad mode ||
| 24 | Loops button | Activate **loops** pad mode ||
| 25 | Pad buttons 1–4 | <p>**Hotcues mode:** Seek to a set hotcue position. Otherwise set hotcue at the current position.</p><p>**Stems mode:** Toggle stem track mute</p><p>**Samples mode:** Play loaded sampler track. If the sampler is empty, load the selected track.</p><p>**Loops mode:** *Hold* to enable a rolling loop of 1/16, 1/8, 1/4 or 1/2 beats</p>| <p>**Hotcues mode:** Clear a set hotcue</p><p>**Samples mode:** Eject the currently loaded track</p><p>**Loops mode:** *Hold* to enable a default loop</p> |
| 26 | Pad buttons 5–8 | <p>**Hotcues mode:** Same as for pads 1–4 (**25**)</p><p>**Stems mode:** *Hold* to use as function modifiers for move (**18**) and loop (**20**) encoders.</p><p>**Samples mode:** Same as for pads 1–4 (**25**)</p><p>**Loops mode:** *Hold* to enable a rolling loop of 1, 2, 4 or 8 beats</p> | <p>**Hotcues mode:** Same as for pads 1–4 (**25**)</p><p>**Samples mode:** Same as for pads 1–4 (**25**)</p><p>**Loops mode:** *Hold* to enable a default loop</p> |
| 27 | SNC button | <p>**Press** to sync tempo and phase (if quantize is active)</p><p>**Hold** to activate sync lock and **press** again to disable it</p> | Sync phase to the other deck |
| 28 | MST button | Set deck as the sync leader ||
| 29 | Tempo fader | Adjust playback speed ||

### Mixer deck columns (30–39)

| No. | Element | Function |
| --- | --- | --- |
| 30 | GAIN knob | Adjust deck pre-fader gain |
| 31 | Left FX button | Send deck output to FX unit 1 |
| 32 | Right FX button | Send deck output to FX unit 2 |
| 33 | HI knob | Adjust high frequency filter |
| 34 | MID knob | Adjust middle frequency filter |
| 35 | LOW knob | Adjust low frequency filter |
| 36 | Quick FX knob | Control Quick FX meta parameter |
| 37 | Quick FX button | Toggle Quick FX on / off |
| 38 | Headphone button | Toggle headphone cueing |
| 39 | Volume fader | Adjust deck volume |

### Center mixer column (40–46)

| No. | Element | Function |
| --- | --- | --- |
| 40 | MAIN knob | Adjust main output volume (hardware control) |
| 41 | Level meters | Show the current instantaneous deck volume |
| 42 | Headphone MIX knob | Adjust headphone cue / main mix |
| 43 | Headphone VOL knob | Adjust headphone output volume |
| 44 | Quick FX preset button | <p>**Press** to load configured Quick FX preset to both decks</p><p>**Hold** and *press* a Quick FX toggle button (**37**) to load for a single deck only</p> |
| 45 | MIC button | <p>**Press** to toggle microphone talkover</p><p>**Hold** for momentary microphone activation |
| 46 | Crossfader | Adjust crossfader between decks |
