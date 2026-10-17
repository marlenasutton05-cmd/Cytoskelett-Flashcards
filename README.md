# Cytoskeleton flashcards (Bio 112, lecture 4)

Study site for *Das Cytoskelett* (Damian Brunner, Bio 112, Alberts ch. 16).
Plain HTML, CSS and JavaScript – no build step, no dependencies.

## Study modes
- **Cards** – flip cards for terms, "why?" questions, numbers and processes. Rate each one *Again* / *Got it*; cards you miss come back later in the round. Progress is saved in your browser.
- **Quiz** – 10 multiple-choice questions per round (written questions plus "which term is this?").
- **Fill the gap** – type the missing words; Greek letters can be written as alpha/beta/gamma.
- **Processes** – put the steps of a process in the right order (actin polymerisation, dynamic instability, IF assembly, kinesin/dynein/myosin cycles, progerin …).
- **Compare** – actin vs. microtubules vs. IFs, the three motors, and regulators. Test mode hides cells until you tap them.

Everything is available in **German and English** (toggle top right), plus dark mode.

Keyboard (cards): `Space` flip · `←` `→` browse · `1` again · `2` got it. Quiz: `1`–`4` to answer.

## Deploy
1. Create a new GitHub repository and upload the contents of this folder (so `index.html` is at the repo root).
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
3. Leave the build command empty and the publish directory as `.` (already set in `netlify.toml`). Deploy.

Or drag the unzipped folder onto <https://app.netlify.com/drop> for an instant deploy.

## Editing the content
All cards live in `js/data.js` (`CARDS`, `PROCESSES`, `CLOZE`, `QUIZ`, `TABLES`). Each entry has a `de` and an `en` version.
