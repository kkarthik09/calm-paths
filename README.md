# Calm Paths

An accessible reasoning-play prototype with short matching, pattern and counting
activities, a First → Then routine board, and persistent help/break/finished
controls. Designed to offer useful options for autistic children and others who
prefer predictable, low-stimulation activities. Different people have different
needs: suitability should be explored with the person using it.

## Run locally
```sh
python3 -m http.server 8000
# Open http://localhost:8000
node --test engine.test.mjs
```
No build process, package installation, API keys or online services are needed.
Serve the files over HTTP; browser module loading may not work from file:// URLs.

## What is actually built
- Three seeded activity generators with 2, 3 or 4 choices.
- Optional starting suggestions for ages 4–6, 7–10, and 11+/adults. These are
  interface presets, not validated developmental norms. Level remains adjustable.
- Short sessions of 3, 5 or 8 steps; unlimited retries and skippable questions.
- Explicit next-step button: answers never trigger an automatic screen change.
- Hints and explanations, no countdowns, no sounds, no score comparisons.
- Large controls, shape-and-text labels, keyboard focus, responsive layout,
  polite screen-reader announcements and native modal dialogs.
- Quieter palette and larger text options; no animation or flashing effects.
- A visual First → Then board with editable choices and completion indicators.
- “I need help”, “I need a break”, and “I'm finished” controls always available.
- Break modal preserves the exact current activity until the player returns.

## Purpose and boundaries
This is educational play, **not an IQ assessment, diagnostic tool, therapy or
validated intervention**. It does not claim to improve autism symptoms or measure
intelligence. Age presets do not rank a child's abilities. The communication
buttons supplement interaction; they do not replace a person's established AAC
system. No speech, gaze, emotion, or behavioral data is collected.

Try one brief activity together; ask what the player likes or wants changed.
Respect help, break and finished choices. Do not require completion to access
comfort, food, water, communication or a preferred activity. The routine board is
a shared plan, not a reward-withholding system.

## Privacy
No accounts, ads, analytics, network requests, external fonts or tracking scripts.
Only optional comfort settings are saved in localStorage. No names, ages,
diagnoses, answers, scores or routine selections are saved. Clear saved settings
from the settings dialog. A web host may maintain ordinary access logs separately.

## Validation
The engine suite checks 4,500 generated question configurations for deterministic
output, unique choices and correct answers, plus session limits and duplicate
answer protection. Browser interaction checks remain pending. Usability
with autistic participants, assistive technology/device testing, translations,
and clinical benefit have **not** been validated. Feedback should guide further
development with consent and appropriate caregiver involvement.

## Engineering discussion
Pure deterministic question generation is separate from DOM state. Semantic HTML
buttons support keyboard input. Rendering uses textContent and DOM elements, not
untrusted HTML. No third-party runtime dependencies are needed.
Possible next work: user-tested visual instructions, configurable vocabulary,
switch access testing, nonverbal activity variants and localized text.

New portfolio project developed with AI assistance. No research, adoption or
therapeutic impact claims are made.
