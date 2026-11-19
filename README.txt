PERSONA CHARACTER SHEET - EDITABLE VERSION
==========================================

HOW TO USE
  Double-click index.html. It opens in your browser and works offline.
  Keep all the files together in this folder.
  Your sheet saves automatically in the browser you use.

THE FILES
  index.html       the page layout (what sits on the sheet, and the panels under it)
  config.js        positions, colors of affinities, rules, EXP table   <- most edits go here
  style.css        fonts, text sizes and colors                         <- look and feel
  sheet.js         the logic (only needed to change HOW things calculate)
  background.jpg   your sheet artwork

COMMON CHANGES
  Move or resize a field on the sheet
      config.js > positions (header boxes), statBars, affinityBoxes, skillRows / skillColumns.
      Numbers are pixels measured on the artwork from its top-left corner.
      Open index.html?debug (add ?debug to the end of the address) to see red outlines
      around every field while you line them up. Refresh after each edit.

  Use a different sheet image
      Replace background.jpg with your new image (same file name), then set width and
      height in config.js to the image's size in pixels. Re-line up the fields using ?debug.

  Change the font or text size on the sheet
      style.css, the first block (1. TEXT ON THE SHEET). To load a different Google font,
      change the <link> near the top of index.html as well.

  Change colors of the controls under the sheet
      style.css, block 2 (the --bg, --panel, --accent lines, one set for light and one for dark).

  Change affinity labels or colors
      config.js > affinityStates (code, name, color). Add or remove entries as you like.

  Change the starting HP/SP, Guts bonus or stat minimum
      config.js > rules.

  Change the HP or SP formula
      sheet.js > function calc() (marked THE FORMULAS).

  Change the EXP table
      config.js > expTable. One number per level, level 1 first. The sheet's max level
      is however many numbers are in the list.

  Add or remove skill rows
      config.js > skillRows. Each row is [top, height] in pixels. Make sure it matches the artwork.

  Remove a panel under the sheet
      Delete its <div class="panel ctl"> ... </div> block in index.html.

  Start a second, separate character
      Change storageKey in config.js (for example to "persona-sheet-alex"). Each key keeps its own saved data.

SHARING IT
  Zip the folder and send it, or upload the folder to any free web host (GitHub Pages, Netlify, etc.).
  Saved sheets stay in each person's own browser; they are not shared between people.
