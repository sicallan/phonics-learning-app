# 🦊 Phonics Fun

A simple, clutter-free phonics app for young children, aligned to **Read Write Inc (RWI)**
— the scheme using *green words* (sound them out) and *red words* (learn by sight).

## How to use it

**Just double-click `index.html`** — it opens in any web browser. No installation, no internet needed.

(On a phone or tablet, open the file in the browser the same way, or pop it on a web host later.)

## What's inside

Three levels that build on each other:

| Level | Age | Content |
|-------|-----|---------|
| 🌱 **Level 1** | 4 · Reception | Set 1 sounds, first CVC words (cat, dog…), first red words |
| 🌿 **Level 2** | 5 · Year 1 | Set 2 sounds, longer words, short phrases |
| 🌳 **Level 3** | 6 · Year 2 | Set 3 sounds, short sentences to read |

Each activity is a deck of big flashcards:

- **�Sounds** – tap to hear the pure sound, with the RWI letter-formation rhyme underneath.
- **🟢 Green Words** – tap **🐸 Sound it out** to "Fred Talk" the word: each sound lights up
  in turn, then they blend into the whole word.
- **🔴 Red Words** – tricky words shown for sight reading ("you can't Fred a red").
- **💬 Phrases / 📖 Sentences** – read short lines aloud (levels 2 & 3).

Tap **💡 Hint** to reveal a picture clue, **🔊 Say it** (or tap the card) to hear it again,
and the **‹ ›** arrows or your keyboard arrows to move between cards.

## Changing the content

All the words, sounds and pictures live in **`data.js`** — easy to edit. Add a new green word
by copying a line like:

```js
{ word: "hen", fred: ["h", "e", "n"], pic: "🐔" },
```

`fred` is the list of sounds to blend, in order. `pic` is an optional emoji hint.
