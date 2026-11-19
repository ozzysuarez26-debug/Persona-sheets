/* =====================================================================
   PERSONA CHARACTER SHEET  -  SETTINGS
   Edit this file to move things around or change the rules.
   You do not need to touch sheet.js.

   COORDINATES: every position below is in PIXELS measured on the artwork
   (background.jpg), from its top-left corner.
     x = distance from the left edge     y = distance from the top edge
     w = width    h = height             r = tilt in degrees (negative = tilts up to the right)
   Tip: open index.html?debug in your browser to see red outlines around every
   field, which makes lining things up with the artwork much easier.
   ===================================================================== */

window.SHEET_CONFIG = {

  /* ---------- the artwork ---------- */
  title: "Persona Character Sheet",
  background: "background.jpg",   // swap the file, or point this at another image
  width: 1080,                    // size of the artwork in pixels
  height: 1398,                   // (right-click the image > properties to check)
  storageKey: "persona-sheet-editable-v1",  // change this to keep a second, separate sheet

  /* ---------- the rules (HP, SP and levels) ---------- */
  rules: {
    baseHP: 50,          // starting base HP for a custom persona
    baseSP: 20,          // starting base SP
    gutsHPPerRank: 10,   // HP gained for each rank of the Guts social stat
    hpBoost: 0,
    spBoost: 0,
    gym: 0,
    startingStats: 1,    // every stat starts at this number
    // HP = baseHP + EN + (floor(EN / 5) x level) + Guts bonus
    // SP = baseSP + MA + floor( floor(MA / 5) x level / 2 )   <- change the formulas in sheet.js, function calc()
  },

  /* ---------- total EXP needed to reach each level (level 1 first, level 50 last) ---------- */
  expTable: [0, 10, 30, 100, 200, 330, 505, 735, 1000, 1390, 1885, 2500, 3445, 4730, 6380, 8200, 11000, 15150, 21500, 29000, 38000, 48000, 59600, 72000, 85700, 100000, 117500, 141000, 169000, 200000, 241000, 290000, 350500, 424000, 500000, 581500, 666900, 770000, 883000, 1000000, 1135000, 1300000, 1530000, 1825000, 2150000, 2500000, 3000000, 3550000, 4200000, 5000000],

  /* ---------- header fields ---------- */
  positions: {
    arcana:    { x: 66,  y: 74,  w: 148, h: 26, r: -1.6 },
    signature: { x: 70,  y: 147, w: 92,  h: 56, r: -2 },
    persona:   { x: 262, y: 67,  w: 206, h: 27, r: -1.4 },
    hp:        { x: 547, y: 75,  w: 136, h: 30, r: -1.8 },   // "current / max" readout
    sp:        { x: 735, y: 69,  w: 136, h: 28, r: -2 },
    level:     { x: 212, y: 158, w: 42,  h: 26, r: -0.6 },
    exp:       { x: 277, y: 150, w: 120, h: 29, r: -2.8 },     // current EXP box
    expNext:   { x: 447, y: 142, w: 126, h: 28, r: -2.8 },     // EXP needed for next level
    ac:        { x: 603, y: 140, w: 36,  h: 28, r: 0 },      // Guard / AC hexagon
    player:    { x: 660, y: 112, w: 213, h: 26, r: -2.1 },

    // The picture frame is slanted, so it is placed by its three corners instead.
    // tl = top-left, tr = top-right, bl = bottom-left   (the 4th corner is worked out for you)
    visage: { tl: [803, 252], tr: [1037, 233], bl: [781, 552] }
  },

  /* ---------- the five stat bars (the + / - buttons and the number) ---------- */
  statBars: [
    { key: "ST", label: "Strength",  x: 154, y: 409, w: 440, h: 40, r: -2.5 },
    { key: "MA", label: "Magic",     x: 119, y: 465, w: 440, h: 40, r: -2.5 },
    { key: "EN", label: "Endurance", x: 178, y: 521, w: 440, h: 40, r: -2.5 },
    { key: "AG", label: "Agility",   x: 115, y: 582, w: 440, h: 40, r: -2.5 },
    { key: "LC", label: "Luck",      x: 95, y: 652, w: 440, h: 40, r: -2.5 }
  ],

  /* ---------- the affinity boxes under the icons (click a box to cycle) ---------- */
  affinityBoxSize: { w: 58, h: 42 },
  affinityBoxes: [
    { key: "phys",  label: "Physical", x: 74,  y: 325, r: -8 },
    { key: "gun",   label: "Gun",      x: 150, y: 318, r: -8 },
    { key: "fire",  label: "Fire",     x: 241, y: 309, r: -8 },
    { key: "ice",   label: "Ice",      x: 304, y: 302, r: -8 },
    { key: "elec",  label: "Electric", x: 371, y: 296, r: -8 },
    { key: "wind",  label: "Wind",     x: 435, y: 289, r: -8 },
    { key: "psy",   label: "Psychic",  x: 502, y: 283, r: -8 },
    { key: "nuke",  label: "Nuclear",  x: 564, y: 277, r: -8 },
    { key: "bless", label: "Bless",    x: 632, y: 270, r: -8 },
    { key: "curse", label: "Curse",    x: 697, y: 263, r: -8 }
  ],
  // What clicking a box cycles through. The first one is "empty". Edit codes, names and colours freely.
  affinityStates: [
    { code: "",   name: "none",    color: "" },
    { code: "Wk", name: "Weak",    color: "#b3202f" },
    { code: "Rs", name: "Resist",  color: "#1f58b8" },
    { code: "Bk", name: "Block",   color: "#3a3a3a" },
    { code: "Rf", name: "Reflect", color: "#7a2a9a" },
    { code: "Ab", name: "Absorb",  color: "#1a7a44" }
  ],

  /* ---------- the skills table ---------- */
  // Each row is [top y, height]. Add or remove rows to match your artwork.
  skillRows: [ [835, 53], [892, 63], [955, 72], [1027, 70], [1097, 68], [1165, 64], [1229, 71], [1300, 70] ],
  // Each column: which piece of data it holds, where it sits, and its look ("nm" bold name, "cs" centred cost).
  skillColumns: [
    { field: "n", label: "name",        x: 27,  w: 163, style: "nm" },
    { field: "e", label: "effect",      x: 194, w: 305, style: "" },
    { field: "d", label: "description", x: 504, w: 404, style: "" },
    { field: "c", label: "cost",        x: 914, w: 143, style: "cs" }
  ],

  /* ---------- the social stats listed in the "extras" panel below the sheet ---------- */
  socialStats: ["Knowledge", "Guts", "Proficiency", "Kindness", "Charm"],
  maxSocialRank: 5,
  socialBonusPerRank: 3
};
