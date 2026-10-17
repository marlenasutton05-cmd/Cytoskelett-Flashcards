/* =========================================================
   Cytoskeleton flashcards — app logic (no build step, no deps)
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- UI strings ---------------- */
  const UI = {
    de: {
      title: "Das Cytoskelett", subtitle: "Bio 112, Vorlesung 4",
      modes: { cards: "Karten", quiz: "Quiz", cloze: "Lückentext", seq: "Abläufe", cmp: "Vergleich" },
      all: "Alle", onlyOpen: "Nur offene Karten", shuffle: "Mischen",
      types: { term: "Begriff", why: "Warum?", number: "Zahl", process: "Ablauf" },
      card: "Karte", of: "von", tapFlip: "Tippen oder Leertaste zum Umdrehen",
      again: "Nochmal", know: "Gewusst", prev: "Vorherige Karte", next: "Nächste Karte",
      known: "gewusst", learning: "noch unsicher", unseen: "neu",
      roundDone: "Runde geschafft", roundText: (k, a) => `${k} gewusst, ${a} noch unsicher in dieser Runde.`,
      repeatOpen: "Unsichere wiederholen", restart: "Neue Runde",
      emptyTitle: "Keine Karten in dieser Auswahl",
      emptyText: "Wähle andere Themen oder schalte „Nur offene Karten“ aus.",
      resetFilters: "Filter zurücksetzen",
      processFront: (n) => `Ablauf in ${n} Schritten – kannst du ihn aufsagen?`,
      processKind: "Ablauf",
      quizGenQ: "Welcher Begriff wird hier beschrieben?",
      question: "Frage", correct: "Richtig.", wrong: "Nicht ganz.", answerIs: "Richtig wäre:",
      nextQ: "Nächste Frage", showResult: "Ergebnis anzeigen",
      quizDone: "Quiz beendet", quizText: (s, n) => `${s} von ${n} richtig.`, newQuiz: "Neues Quiz",
      check: "Prüfen", reveal: "Lösung zeigen", nextSentence: "Nächster Satz",
      clozeHint: "Fülle die Lücken aus. Gross-/Kleinschreibung egal.",
      clozeAll: (c, n) => `${c} von ${n} Lücken richtig.`,
      seqPool: "Schritte (antippen in der richtigen Reihenfolge)", seqYours: "Deine Reihenfolge",
      seqEmpty: "Tippe links den ersten Schritt an.", seqDone: "Alle Schritte platziert.",
      seqUndo: "Platzierten Schritt antippen, um ihn zurückzulegen.",
      seqCheck: "Reihenfolge prüfen", seqRetry: "Nochmal versuchen", seqNext: "Nächster Ablauf", seqSolution: "Lösung zeigen",
      seqResult: (c, n) => `${c} von ${n} Schritten an der richtigen Stelle.`,
      seqPerfect: "Perfekt – alles in der richtigen Reihenfolge.",
      cmpTest: "Abfragemodus", cmpRevealAll: "Alle aufdecken", cmpHideAll: "Alle verdecken",
      cmpTap: "antippen", cmpHint: "Im Abfragemodus sind die Zellen verdeckt – erst überlegen, dann antippen.",
      keys: "Tastatur", keyFlip: "umdrehen", keyNav: "blättern", keyRate: "bewerten",
      reset: "Lernstand zurücksetzen", resetConfirm: "Lernstand wirklich löschen?",
      source: "Basierend auf den Folien von Damian Brunner, Bio 112 (Kapitel 16, Alberts)."
    },
    en: {
      title: "The cytoskeleton", subtitle: "Bio 112, lecture 4",
      modes: { cards: "Cards", quiz: "Quiz", cloze: "Fill the gap", seq: "Processes", cmp: "Compare" },
      all: "All", onlyOpen: "Only open cards", shuffle: "Shuffle",
      types: { term: "Term", why: "Why?", number: "Number", process: "Process" },
      card: "Card", of: "of", tapFlip: "Tap or press space to flip",
      again: "Again", know: "Got it", prev: "Previous card", next: "Next card",
      known: "got it", learning: "still learning", unseen: "new",
      roundDone: "Round complete", roundText: (k, a) => `${k} got it, ${a} still learning this round.`,
      repeatOpen: "Repeat the shaky ones", restart: "New round",
      emptyTitle: "No cards in this selection",
      emptyText: "Pick other topics or turn off “Only open cards”.",
      resetFilters: "Reset filters",
      processFront: (n) => `A ${n}-step process – can you walk through it?`,
      processKind: "Process",
      quizGenQ: "Which term is described here?",
      question: "Question", correct: "Correct.", wrong: "Not quite.", answerIs: "The answer is:",
      nextQ: "Next question", showResult: "Show result",
      quizDone: "Quiz finished", quizText: (s, n) => `${s} of ${n} correct.`, newQuiz: "New quiz",
      check: "Check", reveal: "Show answer", nextSentence: "Next sentence",
      clozeHint: "Fill in the blanks. Case doesn't matter.",
      clozeAll: (c, n) => `${c} of ${n} blanks correct.`,
      seqPool: "Steps (tap them in the right order)", seqYours: "Your order",
      seqEmpty: "Tap the first step on the left.", seqDone: "All steps placed.",
      seqUndo: "Tap a placed step to put it back.",
      seqCheck: "Check order", seqRetry: "Try again", seqNext: "Next process", seqSolution: "Show answer",
      seqResult: (c, n) => `${c} of ${n} steps in the right place.`,
      seqPerfect: "Perfect – everything in the right order.",
      cmpTest: "Test mode", cmpRevealAll: "Reveal all", cmpHideAll: "Hide all",
      cmpTap: "tap", cmpHint: "In test mode the cells are covered – think first, then tap.",
      keys: "Keys", keyFlip: "flip", keyNav: "browse", keyRate: "rate",
      reset: "Reset progress", resetConfirm: "Really delete your progress?",
      source: "Based on Damian Brunner's slides, Bio 112 (chapter 16, Alberts)."
    }
  };

  const MODE_ICONS = {
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>',
    cloze: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h5M3 12h3M14 12h7M3 17h9"/><path d="M11 5h10v4H11z"/></svg>',
    seq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><path d="M10 6h11M10 18h11M5 8v8"/></svg>',
    cmp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 4v16"/></svg>'
  };

  /* ---------------- storage (best effort) ---------------- */
  const KEY = "cyto-v04";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        lang: S.lang, theme: S.theme, mode: S.mode, onlyOpen: S.onlyOpen,
        topics: [...S.topics], types: [...S.types], known: P.known, learning: P.learning
      }));
    } catch (e) {}
  }

  /* ---------------- helpers ---------------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const strip = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent || ""; };
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const topicOf = (id) => TOPICS.find((t) => t.id === id) || TOPICS[0];
  const tc = (id) => `var(--${id})`;
  const t = () => UI[S.lang];
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/α/g, "alpha").replace(/β/g, "beta").replace(/γ/g, "gamma")
      .replace(/[−–—]/g, "-").replace(/ß/g, "ss")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[\s\-_.,;:'"’()]/g, "");
  }

  /* ---------------- state ---------------- */
  const saved = load();
  const browserLang = (navigator.language || "en").toLowerCase().startsWith("de") ? "de" : "en";
  const S = {
    lang: saved.lang || browserLang,
    theme: saved.theme || null,
    mode: saved.mode || "cards",
    topics: new Set(saved.topics || []),
    types: new Set(saved.types || []),
    onlyOpen: !!saved.onlyOpen
  };
  const P = { known: saved.known || {}, learning: saved.learning || {} };

  // all flashcards = authored cards + process cards
  const ALL = CARDS.concat(PROCESSES.map((p) => ({ id: p.id, topic: p.topic, type: "process", proc: p })));

  /* ---------------- filament motifs (card strip) ---------------- */
  function strand(motif) {
    const W = 840, H = 22; let s = "";
    if (motif === "actin") {
      for (let i = 0; i < 120; i++) {
        const x = i * 7 + 4, ph = i * 0.42;
        const y1 = 11 + 4.2 * Math.sin(ph), y2 = 11 - 4.2 * Math.sin(ph);
        const o1 = 0.55 + 0.45 * Math.cos(ph), o2 = 0.55 - 0.45 * Math.cos(ph);
        s += `<circle cx="${x}" cy="${y1.toFixed(1)}" r="3.4" opacity="${(0.25 + o1 * 0.75).toFixed(2)}"/>`;
        s += `<circle cx="${x + 3.5}" cy="${y2.toFixed(1)}" r="3.4" opacity="${(0.25 + o2 * 0.75).toFixed(2)}"/>`;
      }
    } else if (motif === "mt") {
      for (let r = 0; r < 3; r++) for (let i = 0; i < 112; i++) {
        const x = i * 7.6 + (r % 2 ? 3.8 : 0) + 3, y = 4 + r * 7;
        s += `<circle cx="${x}" cy="${y}" r="3.1" opacity="${(i + r) % 2 ? 1 : 0.4}"/>`;
      }
    } else if (motif === "rope") {
      const path = (ph, amp) => { let d = ""; for (let x = 0; x <= W; x += 6) { const y = 11 + amp * Math.sin(x / 18 + ph); d += (x ? "L" : "M") + x + " " + y.toFixed(1); } return d; };
      s += `<path d="${path(0, 6)}" fill="none" stroke="currentColor" stroke-width="2.6" opacity=".95"/>`;
      s += `<path d="${path(2.1, 6)}" fill="none" stroke="currentColor" stroke-width="2.6" opacity=".6"/>`;
      s += `<path d="${path(4.2, 6)}" fill="none" stroke="currentColor" stroke-width="2.6" opacity=".35"/>`;
    } else if (motif === "branch") {
      s += `<rect x="0" y="15" width="${W}" height="3" rx="1.5"/>`;
      for (let x = 30; x < W; x += 74) s += `<path d="M${x} 16 L${x + 14} 3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity=".7"/><circle cx="${x}" cy="16.5" r="3.3"/>`;
    } else if (motif === "steps") {
      s += `<rect x="0" y="16" width="${W}" height="3" rx="1.5" opacity=".45"/>`;
      for (let x = 14; x < W; x += 34) s += `<ellipse cx="${x}" cy="9" rx="4.2" ry="3.4"/><ellipse cx="${x + 13}" cy="9" rx="4.2" ry="3.4" opacity=".5"/>`;
    } else {
      for (let i = 0; i < 106; i++) s += `<circle cx="${i * 8 + 4}" cy="11" r="3" opacity="${i % 3 ? 0.45 : 1}"/>`;
    }
    return `<svg class="strand" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid slice" fill="currentColor" aria-hidden="true">${s}</svg>`;
  }

  /* ---------------- chrome: header, modes, filters, footer ---------------- */
  function applyTheme() {
    if (S.theme) document.documentElement.setAttribute("data-theme", S.theme);
    else document.documentElement.removeAttribute("data-theme");
  }
  function renderChrome() {
    document.documentElement.lang = S.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t()[el.dataset.i18n]; });
    document.querySelectorAll('[data-action="lang"]').forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === S.lang)));
    $("#modes").setAttribute("role", "tablist");
    $("#modes").innerHTML = Object.keys(t().modes).map((m) =>
      `<button type="button" role="tab" class="mode-tab" data-action="mode" data-value="${m}" aria-selected="${S.mode === m}">${MODE_ICONS[m]}${t().modes[m]}</button>`).join("");
    renderFilters();
    renderFoot();
  }

  function topicCounts() {
    const c = {};
    if (S.mode === "cards") ALL.forEach((x) => { if (!S.types.size || S.types.has(x.type)) c[x.topic] = (c[x.topic] || 0) + 1; });
    else if (S.mode === "quiz") QUIZ.forEach((x) => { c[x.topic] = (c[x.topic] || 0) + 1; });
    else if (S.mode === "cloze") CLOZE.forEach((x) => { c[x.topic] = (c[x.topic] || 0) + 1; });
    else if (S.mode === "seq") PROCESSES.forEach((x) => { c[x.topic] = (c[x.topic] || 0) + 1; });
    return c;
  }

  function renderFilters() {
    const f = $("#filters");
    if (S.mode === "cmp") {
      f.innerHTML = `<div class="chip-row">${TABLES.map((tb, i) =>
        `<button type="button" class="chip" data-action="table" data-value="${i}" aria-pressed="${CMP.i === i}">${esc(tb[S.lang].title)}</button>`).join("")}</div>`;
      return;
    }
    const counts = topicCounts();
    const topics = TOPICS.filter((tp) => counts[tp.id]);
    let h = `<div class="chip-row scroll" role="group" aria-label="Topics">
      <button type="button" class="chip" data-action="topic" data-value="" aria-pressed="${S.topics.size === 0}">${t().all}</button>
      ${topics.map((tp) => `<button type="button" class="chip" style="--c:${tc(tp.id)}" data-action="topic" data-value="${tp.id}" aria-pressed="${S.topics.has(tp.id)}"><span class="dot"></span>${esc(tp[S.lang])}<span class="n">${counts[tp.id]}</span></button>`).join("")}
    </div>`;
    if (S.mode === "cards") {
      h += `<div class="row2"><div class="chip-row scroll" role="group" aria-label="Card types">
        ${Object.keys(t().types).map((ty) => `<button type="button" class="chip" data-action="type" data-value="${ty}" aria-pressed="${S.types.has(ty)}">${t().types[ty]}</button>`).join("")}
        </div><div class="tools">
        <button type="button" class="toggle" data-action="onlyOpen" aria-pressed="${S.onlyOpen}"><span class="sw"></span>${t().onlyOpen}</button>
        <button type="button" class="chip" data-action="shuffle">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>${t().shuffle}</button>
      </div></div>`;
    }
    f.innerHTML = h;
  }

  function renderFoot() {
    const k = Object.keys(P.known).length;
    $("#foot").innerHTML = `
      <span class="keys">${t().keys}: <kbd>Space</kbd> ${t().keyFlip} · <kbd>←</kbd><kbd>→</kbd> ${t().keyNav} · <kbd>1</kbd><kbd>2</kbd> ${t().keyRate}</span>
      <span>${esc(t().source)} ${k || Object.keys(P.learning).length ? `<button type="button" class="linkish" data-action="reset">${t().reset}</button>` : ""}</span>`;
  }

  const inTopics = (x) => !S.topics.size || S.topics.has(x.topic);

  /* =========================================================
     MODE: CARDS
     ========================================================= */
  const D = { queue: [], i: 0, flipped: false, roundKnown: 0, roundAgain: 0, done: false };

  function buildDeck(onlyIds) {
    let pool = ALL.filter((x) => inTopics(x) && (!S.types.size || S.types.has(x.type)));
    if (S.onlyOpen) pool = pool.filter((x) => !P.known[x.id]);
    if (onlyIds) pool = pool.filter((x) => onlyIds.includes(x.id));
    D.queue = shuffle(pool.map((x) => x.id));
    D.i = 0; D.flipped = false; D.roundKnown = 0; D.roundAgain = 0; D.done = false; D.againIds = [];
  }

  function cardFaces(c) {
    const tp = topicOf(c.topic), L = S.lang;
    const kind = c.type === "process" ? t().types.process : t().types[c.type];
    let front, back;
    if (c.type === "process") {
      const p = c.proc[L];
      front = `<p class="front-text">${p.title}</p><p class="front-sub">${t().processFront(p.steps.length)}</p>`;
      back = `<p class="back-title">${p.title}</p><ol class="steps">${p.steps.map((s) => `<li><span>${s}</span></li>`).join("")}</ol>`;
    } else {
      const isQ = c.type !== "term" || /\?|–/.test(strip(c[L].front));
      const sub = L === "en" && c.type === "term" && norm(strip(c.de.front)) !== norm(strip(c.en.front))
        ? `<p class="front-sub" lang="de">${c.de.front}</p>` : "";
      front = `<p class="front-text ${isQ ? "is-question" : ""}">${c[L].front}</p>${sub}`;
      back = `<p class="back-title">${c[L].front}</p><div class="back-text">${c[L].back}</div>`;
    }
    const head = `<div class="face-head"><span class="tag">${esc(tp[L])}</span><span class="kind">${kind}</span></div>`;
    return `
      <div class="face front">${strand(tp.motif)}${head}<div class="face-body">${front}</div><div class="face-foot">${t().tapFlip}</div></div>
      <div class="face back">${strand(tp.motif)}${head}<div class="face-body">${back}</div></div>`;
  }

  function renderCards() {
    const st = $("#stage");
    const totalPool = ALL.filter((x) => inTopics(x) && (!S.types.size || S.types.has(x.type)));
    if (!D.queue.length) {
      st.innerHTML = `<div class="panel"><div class="empty"><h2>${t().emptyTitle}</h2><p>${t().emptyText}</p>
        <button type="button" class="btn btn-ink" data-action="resetFilters">${t().resetFilters}</button></div></div>`;
      return;
    }
    if (D.done) {
      const uniq = new Set(D.queue).size, okN = uniq - D.againIds.length;
      st.innerHTML = `<div class="panel">${strand("beads").replace('class="strand"', 'class="strand" style="color:var(--good)"')}<div class="panel-body">
        <p class="score-big">${okN}/${uniq}</p>
        <p class="q-text" style="margin-bottom:6px">${t().roundDone}</p>
        <p class="done-text">${t().roundText(okN, D.againIds.length)}</p>
        <div class="row-end">
          ${D.againIds.length ? `<button type="button" class="btn" data-action="repeatAgain">${t().repeatOpen}</button>` : ""}
          <button type="button" class="btn btn-ink" data-action="restart">${t().restart}</button>
        </div></div></div>` + progressBar(totalPool);
      return;
    }
    const c = ALL.find((x) => x.id === D.queue[D.i]);
    const tp = topicOf(c.topic);
    const status = P.known[c.id] ? t().known : P.learning[c.id] ? t().learning : t().unseen;
    st.innerHTML = `
      <div class="deck-meta"><span>${t().card} <strong>${D.i + 1}</strong> ${t().of} ${D.queue.length}</span><span>${status}</span></div>
      <div class="card-wrap">
        <button type="button" class="card ${D.flipped ? "is-flipped" : ""}" style="--c:${tc(tp.id)}" data-action="flip" aria-label="${esc(strip(c.type === "process" ? c.proc[S.lang].title : c[S.lang].front))}. ${t().tapFlip}">
          ${cardFaces(c)}
        </button>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-sq" data-action="prev" aria-label="${t().prev}" ${D.i === 0 ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button type="button" class="btn btn-again" data-action="again">${t().again} <span class="key">1</span></button>
        <button type="button" class="btn btn-know" data-action="know">${t().know} <span class="key">2</span></button>
        <button type="button" class="btn btn-sq" data-action="next" aria-label="${t().next}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>` + progressBar(totalPool);
  }

  function progressBar(pool) {
    const n = pool.length || 1;
    const k = pool.filter((x) => P.known[x.id]).length;
    const l = pool.filter((x) => !P.known[x.id] && P.learning[x.id]).length;
    return `<div class="progress" role="img" aria-label="${k} ${t().known}, ${l} ${t().learning}, ${n - k - l} ${t().unseen}">
        <span class="p-know" style="width:${(k / n) * 100}%"></span><span class="p-learn" style="width:${(l / n) * 100}%"></span></div>
      <div class="legend"><span><i style="background:var(--good)"></i>${k} ${t().known}</span><span><i style="background:var(--if)"></i>${l} ${t().learning}</span><span><i style="background:var(--line-strong)"></i>${n - k - l} ${t().unseen}</span></div>`;
  }

  function flip() {
    D.flipped = !D.flipped;
    const card = $(".card");
    if (card) card.classList.toggle("is-flipped", D.flipped);
  }
  function go(delta) {
    const ni = D.i + delta;
    if (ni < 0) return;
    if (ni >= D.queue.length) { D.done = true; renderCards(); return; }
    D.i = ni; D.flipped = false; renderCards();
  }
  function rate(knew) {
    if (D.done || !D.queue.length) return;
    const id = D.queue[D.i];
    if (knew) { P.known[id] = 1; delete P.learning[id]; D.roundKnown++; }
    else {
      P.learning[id] = 1; delete P.known[id]; D.roundAgain++;
      if (!D.againIds.includes(id)) D.againIds.push(id);
      // re-insert a few cards later so it comes back this round
      const pos = Math.min(D.queue.length, D.i + 4);
      const later = D.queue.slice(D.i + 1, pos);
      if (!later.includes(id)) D.queue.splice(pos, 0, id);
    }
    if (knew) D.againIds = D.againIds.filter((x) => x !== id);
    save(); renderFoot(); go(1);
  }

  /* =========================================================
     MODE: QUIZ
     ========================================================= */
  const Q = { qs: [], i: 0, score: 0, picked: null };

  function genQuestions() {
    const L = S.lang;
    const terms = CARDS.filter((c) => c.type === "term" && strip(c[L].front).length < 44 && !/\?/.test(c[L].front));
    return terms.filter(inTopics).map((c) => {
      const name = strip(c[L].front);
      let desc = strip(c[L].back);
      // mask the term itself in the description
      name.split(/[\s/()\-]+/).filter((w) => w.length > 3).forEach((w) => {
        desc = desc.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "▢▢▢");
      });
      const same = shuffle(terms.filter((x) => x.id !== c.id && x.topic === c.topic));
      const other = shuffle(terms.filter((x) => x.id !== c.id && x.topic !== c.topic));
      const distract = same.concat(other).slice(0, 3).map((x) => strip(x[L].front));
      return { topic: c.topic, gen: true, q: t().quizGenQ, desc, opts: shuffle([name].concat(distract)), answer: name, x: "" };
    });
  }
  function buildQuiz() {
    const L = S.lang;
    const authored = QUIZ.filter(inTopics).map((q) => {
      const opts = q[L].o.slice();
      return { topic: q.topic, q: q[L].q, opts: shuffle(opts), answer: opts[q.a], x: q[L].x };
    });
    const gen = shuffle(genQuestions()).slice(0, Math.max(3, 10 - authored.length));
    Q.qs = shuffle(shuffle(authored).slice(0, 7).concat(gen)).slice(0, 10);
    Q.i = 0; Q.score = 0; Q.picked = null;
  }
  function renderQuiz() {
    const st = $("#stage");
    if (!Q.qs.length) {
      st.innerHTML = `<div class="panel"><div class="empty"><h2>${t().emptyTitle}</h2><p>${t().emptyText}</p>
        <button type="button" class="btn btn-ink" data-action="resetFilters">${t().resetFilters}</button></div></div>`;
      return;
    }
    if (Q.i >= Q.qs.length) {
      st.innerHTML = `<div class="panel">${strand("beads").replace('class="strand"', 'class="strand" style="color:var(--good)"')}<div class="panel-body">
        <p class="score-big">${Q.score}/${Q.qs.length}</p><p class="q-text" style="margin-bottom:6px">${t().quizDone}</p>
        <p class="done-text">${t().quizText(Q.score, Q.qs.length)}</p>
        <div class="row-end"><button type="button" class="btn btn-ink" data-action="newQuiz">${t().newQuiz}</button></div></div></div>`;
      return;
    }
    const q = Q.qs[Q.i], tp = topicOf(q.topic), answered = Q.picked !== null;
    const right = answered && q.opts[Q.picked] === q.answer;
    st.innerHTML = `
      <div class="deck-meta"><span>${t().question} <strong>${Q.i + 1}</strong> ${t().of} ${Q.qs.length}</span><span>${Q.score} ✓</span></div>
      <div class="panel" style="--c:${tc(tp.id)}">${strand(tp.motif)}
        <div class="face-head"><span class="tag">${esc(tp[S.lang])}</span></div>
        <div class="panel-body">
          <p class="q-text">${esc(q.q)}</p>
          ${q.desc ? `<div class="q-desc">${esc(q.desc)}</div>` : ""}
          <div class="options">${q.opts.map((o, i) => {
            let cls = "";
            if (answered && o === q.answer) cls = "is-right";
            else if (answered && i === Q.picked) cls = "is-wrong";
            return `<button type="button" class="opt ${cls}" data-action="pick" data-value="${i}" ${answered ? "disabled" : ""}><span class="letter">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`;
          }).join("")}</div>
          ${answered ? `<div class="feedback" role="status">${right ? `<b class="ok">${t().correct}</b>` : `<b class="no">${t().wrong}</b> ${t().answerIs} <b>${esc(q.answer)}</b>.`} ${esc(q.x || "")}</div>
          <div class="row-end"><button type="button" class="btn btn-ink" data-action="nextQ">${Q.i + 1 < Q.qs.length ? t().nextQ : t().showResult}</button></div>` : ""}
        </div>
      </div>`;
    if (answered) { const b = $('[data-action="nextQ"]'); if (b) b.focus(); }
  }

  /* =========================================================
     MODE: CLOZE
     ========================================================= */
  const Z = { list: [], i: 0, checked: false, revealed: false };
  function buildCloze() { Z.list = shuffle(CLOZE.filter(inTopics)); Z.i = 0; Z.checked = false; Z.revealed = false; }
  function parseCloze(s) {
    const parts = []; let last = 0; const re = /\[\[(.+?)\]\]/g; let m;
    while ((m = re.exec(s))) { parts.push({ text: s.slice(last, m.index) }); parts.push({ blank: m[1].split("|") }); last = re.lastIndex; }
    parts.push({ text: s.slice(last) });
    return parts;
  }
  function renderCloze() {
    const st = $("#stage");
    if (!Z.list.length) {
      st.innerHTML = `<div class="panel"><div class="empty"><h2>${t().emptyTitle}</h2><p>${t().emptyText}</p>
        <button type="button" class="btn btn-ink" data-action="resetFilters">${t().resetFilters}</button></div></div>`;
      return;
    }
    const item = Z.list[Z.i % Z.list.length], tp = topicOf(item.topic);
    const parts = parseCloze(item[S.lang]);
    let bi = 0;
    const html = parts.map((p) => {
      if (p.text !== undefined) return esc(p.text);
      const w = Math.max(5, Math.min(18, p.blank[0].length + 2));
      const idx = bi++;
      return `<input class="blank" style="--w:${w}ch" data-blank="${idx}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Blank ${idx + 1}">`;
    }).join("");
    st.innerHTML = `
      <div class="deck-meta"><span><strong>${(Z.i % Z.list.length) + 1}</strong> ${t().of} ${Z.list.length}</span><span>${t().clozeHint}</span></div>
      <div class="panel" style="--c:${tc(tp.id)}">${strand(tp.motif)}
        <div class="face-head"><span class="tag">${esc(tp[S.lang])}</span></div>
        <div class="panel-body">
          <form id="clozeForm" class="cloze" autocomplete="off">${html}</form>
          <div id="clozeFb"></div>
          <div class="row-between">
            <button type="button" class="btn" data-action="clozeReveal">${t().reveal}</button>
            <span style="display:flex;gap:8px">
              <button type="button" class="btn" data-action="clozeCheck">${t().check}</button>
              <button type="button" class="btn btn-ink" data-action="clozeNext">${t().nextSentence}</button>
            </span>
          </div>
        </div>
      </div>`;
    const first = $(".blank"); if (first && !matchMedia("(pointer: coarse)").matches) first.focus();
  }
  function clozeCheck(reveal) {
    const item = Z.list[Z.i % Z.list.length];
    const blanks = parseCloze(item[S.lang]).filter((p) => p.blank);
    let correct = 0;
    document.querySelectorAll(".blank").forEach((inp) => {
      const ans = blanks[+inp.dataset.blank].blank;
      const ok = ans.some((a) => norm(a) === norm(inp.value));
      inp.classList.remove("ok", "no");
      const prev = inp.previousElementSibling;
      if (prev && prev.classList.contains("solution")) prev.remove();
      if (ok) { correct++; inp.classList.add("ok"); }
      else if (reveal) {
        inp.classList.add("no");
        inp.insertAdjacentHTML("beforebegin", `<span class="solution">${esc(ans[0])}</span>`);
      } else if (inp.value.trim()) inp.classList.add("no");
    });
    $("#clozeFb").innerHTML = `<div class="feedback" role="status">${correct === blanks.length ? `<b class="ok">${t().correct}</b> ` : ""}${t().clozeAll(correct, blanks.length)}</div>`;
  }

  /* =========================================================
     MODE: SEQUENCE
     ========================================================= */
  const Q2 = { list: [], i: 0, pool: [], placed: [], checked: false, solved: false };
  function buildSeq() { Q2.list = shuffle(PROCESSES.filter(inTopics)); Q2.i = 0; resetSeq(); }
  function resetSeq() {
    const p = Q2.list[Q2.i % (Q2.list.length || 1)];
    if (!p) return;
    const idx = p.de.steps.map((_, i) => i);
    let sh = shuffle(idx);
    if (sh.every((v, i) => v === i) && sh.length > 1) sh = sh.reverse();
    Q2.pool = sh; Q2.placed = []; Q2.checked = false; Q2.solved = false;
  }
  function renderSeq() {
    const st = $("#stage");
    if (!Q2.list.length) {
      st.innerHTML = `<div class="panel"><div class="empty"><h2>${t().emptyTitle}</h2><p>${t().emptyText}</p>
        <button type="button" class="btn btn-ink" data-action="resetFilters">${t().resetFilters}</button></div></div>`;
      return;
    }
    const p = Q2.list[Q2.i % Q2.list.length], tp = topicOf(p.topic), steps = p[S.lang].steps;
    const correctCount = Q2.placed.filter((v, i) => v === i).length;
    const item = (si, n, cls, action) =>
      `<li><button type="button" class="seq-item ${cls}" data-action="${action}" data-value="${si}"><span class="num">${n}</span><span>${steps[si]}</span></button></li>`;
    st.innerHTML = `
      <div class="deck-meta"><span><strong>${(Q2.i % Q2.list.length) + 1}</strong> ${t().of} ${Q2.list.length}</span><span>${steps.length} ${t().types.process === "Ablauf" ? "Schritte" : "steps"}</span></div>
      <div class="panel" style="--c:${tc(tp.id)}">${strand(tp.motif)}
        <div class="face-head"><span class="tag">${esc(tp[S.lang])}</span></div>
        <div class="panel-body">
          <p class="q-text">${p[S.lang].title}</p>
          <div class="seq-cols">
            <div><p class="seq-label">${t().seqPool}</p>
              <ul class="seq-list">${Q2.pool.length ? Q2.pool.map((si) => item(si, "", "", "seqPlace")).join("") : `<li class="seq-empty">${t().seqDone}</li>`}</ul></div>
            <div class="placed"><p class="seq-label">${t().seqYours}</p>
              <ul class="seq-list">${Q2.placed.length ? Q2.placed.map((si, i) => item(si, i + 1, Q2.checked ? (si === i ? "ok" : "no") : "", Q2.checked ? "noop" : "seqUnplace")).join("") : `<li class="seq-empty">${t().seqEmpty}</li>`}</ul>
              ${Q2.placed.length && !Q2.checked ? `<p class="seq-hint">${t().seqUndo}</p>` : ""}</div>
          </div>
          ${Q2.checked ? `<div class="feedback" role="status">${correctCount === steps.length ? `<b class="ok">${t().seqPerfect}</b>` : `<b class="no">${t().seqResult(correctCount, steps.length)}</b>`}</div>` : ""}
          <div class="row-between">
            <button type="button" class="btn" data-action="seqSolve">${t().seqSolution}</button>
            <span style="display:flex;gap:8px;flex-wrap:wrap">
              ${Q2.checked ? `<button type="button" class="btn" data-action="seqRetry">${t().seqRetry}</button>` :
                `<button type="button" class="btn" data-action="seqCheck" ${Q2.pool.length ? "disabled" : ""}>${t().seqCheck}</button>`}
              <button type="button" class="btn btn-ink" data-action="seqNext">${t().seqNext}</button>
            </span>
          </div>
        </div>
      </div>`;
  }

  /* =========================================================
     MODE: COMPARE
     ========================================================= */
  const CMP = { i: 0, test: true, shown: {} };
  function renderCmp() {
    const tb = TABLES[CMP.i], L = S.lang;
    const cols = tb[L].cols;
    const head = `<thead><tr><th></th>${cols.map((c, i) => `<th scope="col" style="--c:${tc(tb.colTopics[i])}">${esc(c)}</th>`).join("")}</tr></thead>`;
    const body = tb.rows.map((r, ri) => {
      const cells = r[L];
      return `<tr><th scope="row">${esc(cells[0])}</th>${cells.slice(1).map((v, ci) => {
        const key = `${ri}-${ci}`, hidden = CMP.test && !CMP.shown[key];
        return `<td style="--c:${tc(tb.colTopics[ci])}"><span class="cell-col">${esc(cols[ci])}</span>
          <button type="button" class="cell-btn ${hidden ? "hidden-cell" : ""}" data-action="cell" data-value="${key}" ${hidden ? `aria-label="${esc(cols[ci])}: ${esc(cells[0])} – ${t().cmpTap}"` : ""}>${hidden ? t().cmpTap : esc(v)}</button></td>`;
      }).join("")}</tr>`;
    }).join("");
    $("#stage").innerHTML = `
      <div class="panel">
        <div class="cmp-head">
          <h2 class="cmp-title">${esc(tb[L].title)}</h2>
          <span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <button type="button" class="toggle" data-action="cmpTest" aria-pressed="${CMP.test}"><span class="sw"></span>${t().cmpTest}</button>
            ${CMP.test ? `<button type="button" class="chip" data-action="cmpAll">${Object.keys(CMP.shown).length ? t().cmpHideAll : t().cmpRevealAll}</button>` : ""}
          </span>
        </div>
        ${CMP.test ? `<p class="seq-hint" style="padding:0 24px;margin:4px 0 8px">${t().cmpHint}</p>` : ""}
        <table class="cmp">${head}<tbody>${body}</tbody></table>
      </div>`;
  }

  /* ---------------- render dispatcher ---------------- */
  function render() {
    ({ cards: renderCards, quiz: renderQuiz, cloze: renderCloze, seq: renderSeq, cmp: renderCmp })[S.mode]();
  }
  function rebuild() {
    if (S.mode === "cards") buildDeck();
    else if (S.mode === "quiz") buildQuiz();
    else if (S.mode === "cloze") buildCloze();
    else if (S.mode === "seq") buildSeq();
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action, v = el.dataset.value;
    switch (a) {
      case "lang": S.lang = v; save(); renderChrome(); if (S.mode === "quiz") buildQuiz(); render(); break;
      case "theme": {
        const dark = S.theme ? S.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
        S.theme = dark ? "light" : "dark"; applyTheme(); save(); break;
      }
      case "mode": {
        S.mode = v; save(); renderChrome(); rebuild(); render(); $("#stage").focus({ preventScroll: true });
        const tab = document.querySelector('.mode-tab[aria-selected="true"]'); if (tab) tab.scrollIntoView({ inline: "nearest", block: "nearest" });
        break;
      }
      case "topic":
        if (!v) S.topics.clear();
        else if (S.topics.has(v)) S.topics.delete(v); else S.topics.add(v);
        save(); renderFilters(); rebuild(); render(); break;
      case "type":
        if (S.types.has(v)) S.types.delete(v); else S.types.add(v);
        save(); renderFilters(); rebuild(); render(); break;
      case "onlyOpen": S.onlyOpen = !S.onlyOpen; save(); renderFilters(); rebuild(); render(); break;
      case "shuffle": buildDeck(); render(); break;
      case "resetFilters": S.topics.clear(); S.types.clear(); S.onlyOpen = false; save(); renderFilters(); rebuild(); render(); break;
      case "reset":
        if (confirm(t().resetConfirm)) { P.known = {}; P.learning = {}; save(); renderFoot(); rebuild(); render(); }
        break;
      // cards
      case "flip": flip(); break;
      case "prev": go(-1); break;
      case "next": go(1); break;
      case "again": rate(false); break;
      case "know": rate(true); break;
      case "restart": buildDeck(); render(); break;
      case "repeatAgain": buildDeck(D.againIds.slice()); render(); break;
      // quiz
      case "pick": if (Q.picked === null) { Q.picked = +v; if (Q.qs[Q.i].opts[+v] === Q.qs[Q.i].answer) Q.score++; renderQuiz(); } break;
      case "nextQ": Q.i++; Q.picked = null; renderQuiz(); break;
      case "newQuiz": buildQuiz(); renderQuiz(); break;
      // cloze
      case "clozeCheck": clozeCheck(false); break;
      case "clozeReveal": clozeCheck(true); break;
      case "clozeNext": Z.i++; if (Z.i % Z.list.length === 0) Z.list = shuffle(Z.list); renderCloze(); break;
      // sequence
      case "seqPlace": Q2.pool = Q2.pool.filter((x) => x !== +v); Q2.placed.push(+v); renderSeq(); break;
      case "seqUnplace": Q2.placed = Q2.placed.filter((x) => x !== +v); Q2.pool.push(+v); renderSeq(); break;
      case "seqCheck": Q2.checked = true; renderSeq(); break;
      case "seqRetry": resetSeq(); renderSeq(); break;
      case "seqSolve": { const n = Q2.list[Q2.i % Q2.list.length].de.steps.length; Q2.pool = []; Q2.placed = [...Array(n).keys()]; Q2.checked = true; renderSeq(); break; }
      case "seqNext": Q2.i++; if (Q2.i % Q2.list.length === 0) Q2.list = shuffle(Q2.list); resetSeq(); renderSeq(); break;
      // compare
      case "table": CMP.i = +v; CMP.shown = {}; renderFilters(); renderCmp(); break;
      case "cmpTest": CMP.test = !CMP.test; CMP.shown = {}; renderCmp(); break;
      case "cell": if (CMP.test) { if (CMP.shown[v]) delete CMP.shown[v]; else CMP.shown[v] = 1; renderCmp(); const b = document.querySelector(`[data-action="cell"][data-value="${v}"]`); if (b) b.focus(); } break;
      case "cmpAll": {
        if (Object.keys(CMP.shown).length) CMP.shown = {};
        else TABLES[CMP.i].rows.forEach((r, ri) => r.de.slice(1).forEach((_, ci) => { CMP.shown[`${ri}-${ci}`] = 1; }));
        renderCmp(); break;
      }
    }
  });

  document.addEventListener("submit", (e) => { if (e.target.id === "clozeForm") { e.preventDefault(); clozeCheck(false); } });
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") {
      if (e.key === "Enter" && S.mode === "cloze") { e.preventDefault(); clozeCheck(false); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (S.mode === "cards" && !D.done && D.queue.length) {
      if (e.key === " " || e.key === "Enter") {
        if (e.target.closest && e.target.closest("button:not(.card)")) return; // let real buttons work
        e.preventDefault(); flip();
      }
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "1") rate(false);
      else if (e.key === "2") rate(true);
    } else if (S.mode === "quiz" && Q.picked === null && /^[1-4]$/.test(e.key)) {
      const b = document.querySelector(`[data-action="pick"][data-value="${+e.key - 1}"]`); if (b) b.click();
    }
  });

  /* ---------------- boot ---------------- */
  applyTheme();
  renderChrome();
  rebuild();
  render();
})();
