/* ============================================================
 * Phonics Fun — app logic
 * Zero dependencies. Uses the browser's built-in speech voice.
 * ============================================================ */

/* ---- Speech ------------------------------------------------ */

// Pure-sound pronunciations so the voice says "mmm", not the letter name "em".
// Built from every sound defined in data.js, plus a few base letters that
// appear inside words but aren't taught as their own card.
const SAY = {};
PHONICS.levels.forEach(lvl =>
  lvl.sounds.forEach(s => { if (!(s.sound in SAY)) SAY[s.sound] = s.say; })
);
Object.assign(SAY, {
  a: "a", e: "e", i: "i", o: "o", u: "uh",
  ph: "fff", k: "k", l: "lll", r: "rr",
});

let voice = null;

// Score voices so we land on the most natural-sounding one available.
// Named neural/online voices (Sonia, Daniel, Google UK…) beat the robotic
// built-in "default" voice that ships with some browsers.
function voiceScore(v) {
  const name = (v.name || "").toLowerCase();
  let score = 0;
  if (/en-gb/i.test(v.lang)) score += 40;          // British accent first
  else if (/^en/i.test(v.lang)) score += 20;       // any English next
  if (/natural|neural|online|premium|enhanced/.test(name)) score += 30;
  if (/google/.test(name)) score += 25;            // Google voices sound good
  if (/sonia|libby|ryan|hazel|daniel|kate|serena|arthur|stephanie/.test(name)) score += 20;
  if (/microsoft/.test(name)) score += 8;
  if (/espeak|robot|compact|fred\b/.test(name)) score -= 30; // known robotic
  if (v.localService === false) score += 5;        // cloud voices usually richer
  return score;
}

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return;
  voice = voices.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

// A monotonically increasing token. Calling stopSpeaking() bumps it, which
// invalidates any utterance that was about to start — this is what stops the
// engine from replaying a queued sound (the cause of the stutter/repeat).
let speakToken = 0;

function stopSpeaking() {
  speakToken++;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

function speak(text, { rate = 0.95, pitch = 1.05 } = {}) {
  if (!("speechSynthesis" in window)) return Promise.resolve();
  const myToken = speakToken;
  return new Promise(resolve => {
    // If something newer interrupted us before we even started, skip cleanly.
    if (myToken !== speakToken) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    u.rate = rate;
    u.pitch = pitch;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
  });
}

const wait = ms => new Promise(r => setTimeout(r, ms));

// Wait until the speech engine has truly finished cancelling. Chrome keeps
// .speaking / .pending true for a short, unpredictable time after cancel(),
// and calling speak() during that window makes it REPLAY the first utterance
// (the stutter). Polling until it's idle is the only reliable guard.
async function ensureIdle() {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  for (let i = 0; i < 40; i++) {
    if (!speechSynthesis.speaking && !speechSynthesis.pending) return;
    await wait(25);
  }
}

// Remove consecutive repeated words from the RWI rhymes, e.g.
// "Maisie, mountain, mountain" → "Maisie, mountain", "fire fire" → "fire".
function tidyRhyme(phrase) {
  if (!phrase) return "";
  const tokens = phrase.split(/\s+/);
  const norm = t => t.toLowerCase().replace(/[^a-z']/g, "");
  const out = [];
  for (const t of tokens) {
    if (out.length && norm(t) && norm(out[out.length - 1]) === norm(t)) continue;
    out.push(t);
  }
  return out.join(" ").replace(/[ ,]+$/g, "");
}

// Break a word into its grapheme segments using the Fred Talk breakdown, so
// multi-letter sounds ("special friends" like sh / igh / air) can be underlined
// as one unit. Split digraphs ("a-e" in cake) underline both letters, which
// sit apart in the word, and share the same Fred step (fi) for highlighting.
function graphemeSegments(word, fred) {
  if (!fred) return [{ text: word, joined: false, fi: 0 }];
  const head = [], tail = [];
  fred.forEach((part, fi) => {
    if (part.includes("-")) {
      const [a, b] = part.split("-");                 // e.g. "a-e" -> a … e
      head.push({ letters: a, joined: true, fi });
      tail.push({ letters: b, joined: true, fi });    // second letter comes later
    } else {
      head.push({ letters: part, joined: part.length > 1, fi });
    }
  });
  let pos = 0;
  return head.concat(tail).map(m => {
    const seg = { text: word.slice(pos, pos + m.letters.length), joined: m.joined, fi: m.fi };
    pos += m.letters.length;
    return seg;
  });
}

// Render a word into the card, underlining special friends. Pass activeFi to
// highlight the grapheme currently being sounded out during Fred Talk.
function renderWord(textEl, word, fred, activeFi) {
  textEl.innerHTML = graphemeSegments(word, fred).map(s => {
    const cls = [];
    if (s.joined) cls.push("join");
    if (activeFi != null) cls.push(s.fi === activeFi ? "ph" : "dim");
    return `<span class="${cls.join(" ")}">${s.text}</span>`;
  }).join("");
}

/* ---- App state -------------------------------------------- */

const state = {
  level: null,      // current level object
  activity: null,   // current activity object { key, title, type, items }
  index: 0,         // current card index
};

const screens = {
  home: document.getElementById("home"),
  menu: document.getElementById("menu"),
  activity: document.getElementById("activity"),
  game: document.getElementById("game"),
};

function show(name) {
  stopSpeaking();
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function setAccent(colour) {
  document.documentElement.style.setProperty("--accent", colour);
}

/* ---- Home: level picker ----------------------------------- */

function renderHome() {
  const grid = document.getElementById("levelGrid");
  grid.innerHTML = "";
  PHONICS.levels.forEach(lvl => {
    const b = document.createElement("button");
    b.className = "tile level";
    b.style.setProperty("--tile", lvl.colour);
    b.innerHTML =
      `<span class="tile-emoji">${["🌱", "🌿", "🌳"][lvl.id - 1] || "⭐"}</span>` +
      `${lvl.name}<span class="tile-age">${lvl.age}</span>`;
    b.onclick = () => openLevel(lvl);
    grid.appendChild(b);
  });
}

/* ---- Menu: activity picker -------------------------------- */

function buildActivities(lvl) {
  const acts = [
    { key: "sounds", title: "Sounds", emoji: "🔤", type: "sound", items: lvl.sounds },
    { key: "green", title: "Green Words", emoji: "🟢", type: "green", items: lvl.greenWords },
    { key: "red", title: "Red Words", emoji: "🔴", type: "red", items: lvl.redWords.map(w => ({ word: w })) },
  ];
  if (lvl.phrases && lvl.phrases.length)
    acts.push({ key: "phrases", title: "Phrases", emoji: "💬", type: "line", items: lvl.phrases });
  if (lvl.sentences && lvl.sentences.length)
    acts.push({ key: "sentences", title: "Sentences", emoji: "📖", type: "line", items: lvl.sentences });
  acts.push({ key: "game", title: "Find the Word", emoji: "🎮", type: "game" });
  return acts;
}

function openLevel(lvl) {
  state.level = lvl;
  setAccent(lvl.colour);
  document.getElementById("menuTitle").textContent = `${lvl.name} — pick an activity`;
  const grid = document.getElementById("activityGrid");
  grid.innerHTML = "";
  buildActivities(lvl).forEach(act => {
    const b = document.createElement("button");
    b.className = "tile";
    b.innerHTML = `<span class="tile-emoji">${act.emoji}</span>${act.title}`;
    b.onclick = () => openActivity(act);
    grid.appendChild(b);
  });
  show("menu");
}

/* ---- Activity: flashcards --------------------------------- */

function openActivity(act) {
  if (act.type === "game") return startGame();
  state.activity = act;
  state.index = 0;
  document.getElementById("activityTitle").textContent = act.title;
  show("activity");
  renderCard();
}

function renderCard(animate = false) {
  stopSpeaking();
  const { activity, index } = state;
  const item = activity.items[index];

  const cardEl = document.getElementById("card");
  const picEl = document.getElementById("cardPic");
  const textEl = document.getElementById("cardText");
  const subEl = document.getElementById("cardSub");

  const fredBtn = document.getElementById("fredBtn");
  const hintBtn = document.getElementById("hintBtn");
  const rhymeBtn = document.getElementById("rhymeBtn");

  // Reset
  picEl.textContent = "";
  subEl.textContent = "";
  fredBtn.classList.add("hidden");
  hintBtn.classList.add("hidden");
  rhymeBtn.classList.add("hidden");

  if (activity.type === "sound") {
    textEl.textContent = item.sound;
    const rhyme = tidyRhyme(item.phrase);
    subEl.textContent = rhyme ? `“${rhyme}”` : "";
    if (rhyme) rhymeBtn.classList.remove("hidden");
  } else if (activity.type === "green") {
    renderWord(textEl, item.word, item.fred);
    fredBtn.classList.remove("hidden");
    if (item.pic) hintBtn.classList.remove("hidden");
  } else if (activity.type === "red") {
    textEl.textContent = item.word;
    subEl.textContent = "Red word — learn by sight!";
  } else if (activity.type === "line") {
    textEl.textContent = item.text;
    if (item.pic) hintBtn.classList.remove("hidden");
  }

  // Progress + arrows
  document.getElementById("progress").textContent =
    `${index + 1} / ${activity.items.length}`;
  document.getElementById("prevBtn").disabled = index === 0;
  document.getElementById("nextBtn").disabled = index === activity.items.length - 1;

  if (animate) {
    cardEl.classList.remove("animate");
    void cardEl.offsetWidth;       // restart animation
    cardEl.classList.add("animate");
  }
}

/* ---- Actions ---------------------------------------------- */

function currentItem() {
  return state.activity.items[state.index];
}

// "Say it" — read the whole sound / word / line aloud.
async function sayCurrent() {
  stopSpeaking();
  const token = speakToken;
  await ensureIdle();
  if (token !== speakToken) return;       // navigated away while settling
  const { type } = state.activity;
  const item = currentItem();
  if (type === "sound") return speak(item.say, { rate: 0.75 });
  if (type === "line") return speak(item.text, { rate: 0.9 });
  return speak(item.word, { rate: 0.85 });
}

// Say the (de-duplicated) RWI rhyme for the current sound.
async function sayRhyme() {
  stopSpeaking();
  const token = speakToken;
  await ensureIdle();
  if (token !== speakToken) return;
  const rhyme = tidyRhyme(currentItem().phrase);
  if (rhyme) return speak(rhyme, { rate: 0.92 });
}

// "Sound it out" — Fred Talk: each phoneme in turn (highlighted), then blend.
let fredBusy = false;
async function fredCurrent() {
  const item = currentItem();
  if (!item.fred) return sayCurrent();
  if (fredBusy) return;            // ignore repeat taps mid-sequence
  fredBusy = true;
  stopSpeaking();
  const token = speakToken;
  await ensureIdle();              // wait for the engine to settle, or it replays
  if (token !== speakToken) { fredBusy = false; return; }

  const textEl = document.getElementById("cardText");
  const parts = item.fred;

  for (let i = 0; i < parts.length; i++) {
    if (token !== speakToken) { fredBusy = false; return; }  // interrupted
    renderWord(textEl, item.word, parts, i);   // highlight the active grapheme
    await speak(SAY[parts[i]] ?? parts[i], { rate: 0.7, pitch: 1.05 });
    await wait(120);
  }

  // Blend: show the whole word (underlines kept) and say it.
  if (token === speakToken) {
    renderWord(textEl, item.word, parts);
    await wait(150);
    await speak(item.word, { rate: 0.85 });
  }
  fredBusy = false;
}

function go(delta) {
  const n = state.activity.items.length;
  state.index = (state.index + delta + n) % n;
  // Clamp instead of wrap at the ends to keep arrow state meaningful.
  if (state.index < 0) state.index = 0;
  if (state.index >= n) state.index = n - 1;
  renderCard(true);
  sayCurrent();
}

/* ---- Wiring ----------------------------------------------- */

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.onclick = () => show(btn.dataset.go);
});

document.getElementById("nextBtn").onclick = () => {
  if (state.index < state.activity.items.length - 1) { state.index++; renderCard(true); sayCurrent(); }
};
document.getElementById("prevBtn").onclick = () => {
  if (state.index > 0) { state.index--; renderCard(true); sayCurrent(); }
};

document.getElementById("sayBtn").onclick = sayCurrent;
document.getElementById("fredBtn").onclick = fredCurrent;
document.getElementById("rhymeBtn").onclick = sayRhyme;
document.getElementById("card").onclick = sayCurrent;

document.getElementById("hintBtn").onclick = () => {
  const item = currentItem();
  if (item.pic) document.getElementById("cardPic").textContent = item.pic;
};

// Keyboard support for grown-ups helping out.
document.addEventListener("keydown", e => {
  if (!screens.activity.classList.contains("active")) return;
  if (e.key === "ArrowRight") document.getElementById("nextBtn").click();
  if (e.key === "ArrowLeft") document.getElementById("prevBtn").click();
  if (e.key === " ") { e.preventDefault(); sayCurrent(); }
});

/* ---- Find the Word game ----------------------------------- */

const gameState = { pool: [], queue: [], current: null, found: 0 };
const PRAISE = ["Well done!", "Great job!", "You got it!", "Brilliant!", "Super!", "Nice one!"];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fewer choices for younger children: easier to scan and succeed.
function gridSizeFor(level) {
  return level.id === 1 ? 6 : level.id === 2 ? 9 : 12;
}

// Speak one word with the same robust idle-then-speak guard used elsewhere.
async function gameSpeak(text, opts = { rate: 0.85 }) {
  stopSpeaking();
  const token = speakToken;
  await ensureIdle();
  if (token !== speakToken) return;
  return speak(text, opts);
}

function startGame() {
  const words = state.level.greenWords;
  const n = Math.min(gridSizeFor(state.level), words.length);
  gameState.pool = shuffle(words).slice(0, n);   // which words appear in the grid
  gameState.queue = shuffle(gameState.pool);     // order they'll be asked
  gameState.found = 0;
  document.getElementById("gameDone").classList.add("hidden");
  document.getElementById("gamePlay").classList.remove("hidden");
  renderGameGrid();
  show("game");
  nextGameRound();
}

function renderGameGrid() {
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = "";
  gameState.pool.forEach(item => {
    const b = document.createElement("button");
    b.className = "tile game-tile";
    const span = document.createElement("span");
    b.appendChild(span);
    renderWord(span, item.word, item.fred);      // same special-friend underlines
    b.onclick = () => guessWord(item, b);
    grid.appendChild(b);
  });
}

function updateGameProgress() {
  document.getElementById("gameProgress").textContent =
    `${gameState.found} / ${gameState.pool.length}`;
}

function nextGameRound() {
  if (!gameState.queue.length) return endGame();
  gameState.current = gameState.queue[0];
  updateGameProgress();
  // Small pause, then say the word — only if we're still on the game screen.
  setTimeout(() => {
    if (screens.game.classList.contains("active") && gameState.current)
      gameSpeak(gameState.current.word);
  }, 350);
}

function guessWord(item, btn) {
  if (!gameState.current || btn.classList.contains("done")) return;
  if (item.word === gameState.current.word) {
    gameState.current = null;                    // lock out further taps mid-celebration
    gameState.queue.shift();
    gameState.found++;
    updateGameProgress();
    btn.classList.add("correct");
    gameSpeak(PRAISE[Math.floor(Math.random() * PRAISE.length)], { rate: 0.95 });
    setTimeout(() => {
      btn.classList.remove("correct");
      btn.classList.add("done");
      nextGameRound();
    }, 900);
  } else {
    btn.classList.add("wrong");
    setTimeout(() => btn.classList.remove("wrong"), 400);
  }
}

function endGame() {
  gameState.current = null;
  document.getElementById("gamePlay").classList.add("hidden");
  document.getElementById("gameDone").classList.remove("hidden");
  gameSpeak("You found them all! Well done!", { rate: 0.9 });
}

document.getElementById("gameSayBtn").onclick = () => {
  if (gameState.current) gameSpeak(gameState.current.word);
};
document.getElementById("gameAgainBtn").onclick = startGame;

renderHome();
