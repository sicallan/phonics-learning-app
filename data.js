/*
 * Phonics content, aligned to Read Write Inc (RWI).
 *
 * Terminology used in the app:
 *  - Green words : decodable words you can "Fred Talk" (sound out), e.g. c-a-t.
 *  - Red words   : tricky words you cannot sound out, learnt by sight ("you can't Fred a red").
 *  - Fred Talk   : saying a word in its separate sounds, then blending it back together.
 *  - Sets 1/2/3  : RWI's ordered groups of speed sounds.
 *
 * Each level builds on the one before. Level 1 ~ reception (age 4),
 * Level 2 ~ year 1 (age 5), Level 3 ~ year 2 (age 6).
 *
 * "say" fields hold a phonetic spelling so the browser voice pronounces the
 * pure sound rather than the letter name (e.g. "m" should be "mmm", not "em").
 */

const PHONICS = {
  levels: [
    {
      id: 1,
      name: "Level 1",
      age: "Age 4 · Reception",
      colour: "#4caf50",
      blurb: "Set 1 sounds and first little words",

      // RWI Set 1 single-letter / first special-friends sounds, in teaching order.
      sounds: [
        { sound: "m", say: "mmm", phrase: "Maisie, mountain, mountain" },
        { sound: "a", say: "a", phrase: "around the apple, down the leaf" },
        { sound: "s", say: "sss", phrase: "slither down the snake" },
        { sound: "d", say: "d", phrase: "round his bottom, up his tall neck, down to his feet" },
        { sound: "t", say: "t", phrase: "down the tower, across the tower" },
        { sound: "i", say: "i", phrase: "down the body, dot for the head" },
        { sound: "n", say: "nnn", phrase: "down Nobby, over the net" },
        { sound: "p", say: "p", phrase: "down the plait, up and over the pirate's face" },
        { sound: "g", say: "g", phrase: "round the girl's face, down her hair and give a curl" },
        { sound: "o", say: "o", phrase: "all around the orange" },
        { sound: "c", say: "c", phrase: "curl around the caterpillar" },
        { sound: "k", say: "k", phrase: "down the kangaroo's body, tail and leg" },
        { sound: "u", say: "u", phrase: "down and under, up to the top and draw the puddle" },
        { sound: "b", say: "b", phrase: "down the laces, over the toe and touch the heel" },
        { sound: "f", say: "fff", phrase: "down the stem and draw the leaves" },
        { sound: "e", say: "e", phrase: "lift off the top and scoop out the egg" },
        { sound: "l", say: "lll", phrase: "down the long leg" },
        { sound: "h", say: "h", phrase: "down the head to the hooves and over his back" },
        { sound: "sh", say: "shh", phrase: "slither down the snake, then down the horse's head" },
        { sound: "r", say: "rr", phrase: "down the robot's back, then curl over his arm" },
        { sound: "j", say: "j", phrase: "down his body, curl and dot" },
        { sound: "v", say: "vvv", phrase: "down a wing, up a wing" },
        { sound: "y", say: "y", phrase: "down a horn, up a horn and under his head" },
        { sound: "w", say: "w", phrase: "down, up, down, up the worm" },
        { sound: "th", say: "th", phrase: "down the tower, across the tower, then the horse's head" },
        { sound: "z", say: "zzz", phrase: "zig, zag, zig" },
        { sound: "ch", say: "ch", phrase: "curl around the caterpillar, then the horse's head" },
        { sound: "qu", say: "kw", phrase: "the queen's curl, then her umbrella" },
        { sound: "x", say: "ks", phrase: "down the arm and leg, repeat the other side" },
        { sound: "ng", say: "nng", phrase: "a thing on a string" },
        { sound: "nk", say: "nk", phrase: "I think I stink" },
      ],

      // Decodable CVC words. "fred" lists the phonemes to blend in order.
      // "pic" is an emoji used as a gentle picture hint (optional).
      greenWords: [
        { word: "mat", fred: ["m", "a", "t"], pic: "🧶" },
        { word: "sat", fred: ["s", "a", "t"], pic: "🪑" },
        { word: "cat", fred: ["c", "a", "t"], pic: "🐱" },
        { word: "dog", fred: ["d", "o", "g"], pic: "🐶" },
        { word: "sun", fred: ["s", "u", "n"], pic: "☀️" },
        { word: "pin", fred: ["p", "i", "n"], pic: "📌" },
        { word: "pot", fred: ["p", "o", "t"], pic: "🍲" },
        { word: "bus", fred: ["b", "u", "s"], pic: "🚌" },
        { word: "hat", fred: ["h", "a", "t"], pic: "👒" },
        { word: "pig", fred: ["p", "i", "g"], pic: "🐷" },
        { word: "bed", fred: ["b", "e", "d"], pic: "🛏️" },
        { word: "fox", fred: ["f", "o", "x"], pic: "🦊" },
        { word: "net", fred: ["n", "e", "t"], pic: "🥅" },
        { word: "cup", fred: ["c", "u", "p"], pic: "☕" },
        { word: "leg", fred: ["l", "e", "g"], pic: "🦵" },
        { word: "lips", fred: ["l", "i", "p", "s"], pic: "👄" },
      ],

      // RWI red / tricky words for reception. Cannot be sounded out.
      redWords: ["I", "the", "a", "to", "no", "go", "my", "is", "of", "he", "she", "we", "me", "be"],

      phrases: [],
      sentences: [],
    },

    {
      id: 2,
      name: "Level 2",
      age: "Age 5 · Year 1",
      colour: "#2196f3",
      blurb: "Set 2 sounds, longer words and little phrases",

      // RWI Set 2 sounds (the "special friends" digraphs/trigraphs).
      sounds: [
        { sound: "ay", say: "ay", phrase: "may I play" },
        { sound: "ee", say: "ee", phrase: "what can you see" },
        { sound: "igh", say: "ie", phrase: "fly high" },
        { sound: "ow", say: "ow", phrase: "blow the snow" },
        { sound: "oo", say: "ooo", phrase: "poo at the zoo" },
        { sound: "oo", say: "uu", phrase: "look at a book" },
        { sound: "ar", say: "ar", phrase: "start the car" },
        { sound: "or", say: "or", phrase: "shut the door" },
        { sound: "air", say: "air", phrase: "that's not fair" },
        { sound: "ir", say: "er", phrase: "whirl and twirl" },
        { sound: "ou", say: "ow", phrase: "shout it out" },
        { sound: "oy", say: "oy", phrase: "toy for a boy" },
      ],

      greenWords: [
        { word: "play", fred: ["p", "l", "ay"], pic: "🧸" },
        { word: "tree", fred: ["t", "r", "ee"], pic: "🌳" },
        { word: "night", fred: ["n", "igh", "t"], pic: "🌙" },
        { word: "snow", fred: ["s", "n", "ow"], pic: "❄️" },
        { word: "moon", fred: ["m", "oo", "n"], pic: "🌕" },
        { word: "book", fred: ["b", "oo", "k"], pic: "📖" },
        { word: "car", fred: ["c", "ar"], pic: "🚗" },
        { word: "fork", fred: ["f", "or", "k"], pic: "🍴" },
        { word: "chair", fred: ["ch", "air"], pic: "🪑" },
        { word: "bird", fred: ["b", "ir", "d"], pic: "🐦" },
        { word: "cloud", fred: ["c", "l", "ou", "d"], pic: "☁️" },
        { word: "boy", fred: ["b", "oy"], pic: "👦" },
        { word: "frog", fred: ["f", "r", "o", "g"], pic: "🐸" },
        { word: "star", fred: ["s", "t", "ar"], pic: "⭐" },
        { word: "ship", fred: ["sh", "i", "p"], pic: "🚢" },
        { word: "fish", fred: ["f", "i", "sh"], pic: "🐟" },
      ],

      redWords: ["you", "your", "said", "was", "are", "all", "her", "they", "were", "have", "like", "some", "come", "one"],

      // Short decodable phrases. "fred" can be omitted for phrases; words are read whole.
      phrases: [
        { text: "a big dog", pic: "🐶" },
        { text: "the red car", pic: "🚗" },
        { text: "my cat sat", pic: "🐱" },
        { text: "look at the moon", pic: "🌕" },
        { text: "a fish and a frog", pic: "🐟" },
        { text: "up in the tree", pic: "🌳" },
      ],

      sentences: [],
    },

    {
      id: 3,
      name: "Level 3",
      age: "Age 6 · Year 2",
      colour: "#ff9800",
      blurb: "Set 3 sounds and short sentences to read",

      // RWI Set 3 sounds.
      sounds: [
        { sound: "ea", say: "ee", phrase: "cup of tea" },
        { sound: "oi", say: "oy", phrase: "spoil the boy" },
        { sound: "a-e", say: "ay", phrase: "make a cake" },
        { sound: "i-e", say: "ie", phrase: "nice smile" },
        { sound: "o-e", say: "oa", phrase: "phone home" },
        { sound: "u-e", say: "oo", phrase: "huge brute" },
        { sound: "aw", say: "or", phrase: "yawn at dawn" },
        { sound: "are", say: "air", phrase: "share and care" },
        { sound: "ur", say: "er", phrase: "nurse with a purse" },
        { sound: "er", say: "er", phrase: "a better letter" },
        { sound: "ai", say: "ay", phrase: "snail in the rain" },
        { sound: "oa", say: "oa", phrase: "goat in a boat" },
        { sound: "ew", say: "oo", phrase: "chew the stew" },
        { sound: "ire", say: "ire", phrase: "fire fire" },
        { sound: "ear", say: "ear", phrase: "hear with your ear" },
        { sound: "ure", say: "ure", phrase: "sure it's pure" },
      ],

      greenWords: [
        { word: "tea", fred: ["t", "ea"], pic: "🍵" },
        { word: "coin", fred: ["c", "oi", "n"], pic: "🪙" },
        { word: "cake", fred: ["c", "a-e", "k"], pic: "🎂" },
        { word: "smile", fred: ["s", "m", "i-e", "l"], pic: "🙂" },
        { word: "phone", fred: ["ph", "o-e", "n"], pic: "📱" },
        { word: "rain", fred: ["r", "ai", "n"], pic: "🌧️" },
        { word: "boat", fred: ["b", "oa", "t"], pic: "⛵" },
        { word: "goat", fred: ["g", "oa", "t"], pic: "🐐" },
        { word: "snail", fred: ["s", "n", "ai", "l"], pic: "🐌" },
        { word: "fire", fred: ["f", "ire"], pic: "🔥" },
        { word: "nurse", fred: ["n", "ur", "s"], pic: "👩‍⚕️" },
        { word: "spoon", fred: ["s", "p", "oo", "n"], pic: "🥄" },
      ],

      redWords: ["because", "people", "could", "would", "should", "their", "there", "where", "here", "love", "school", "friend", "water", "many"],

      phrases: [
        { text: "a goat in a boat", pic: "🐐" },
        { text: "make a big cake", pic: "🎂" },
        { text: "play in the rain", pic: "🌧️" },
      ],

      sentences: [
        { text: "The cat sat on the mat.", pic: "🐱" },
        { text: "I can see a frog in the tree.", pic: "🐸" },
        { text: "We play in the snow and have fun.", pic: "❄️" },
        { text: "The dog and the pig are my friends.", pic: "🐶" },
        { text: "Look at the goat in the little boat.", pic: "🐐" },
        { text: "She made a cake for her mum.", pic: "🎂" },
      ],
    },
  ],
};
