PERSONA CHARACTER SHEET - EDITABLE VERSION
==========================================

HOW TO USE
  Open index.html in your browser. Keep all files together in this folder.
  The sheet saves automatically in this browser. Personas and saves are kept locally;
  they are not automatically synchronized to other devices.

MULTIPLE PERSONAS AND DEVICE TRANSFER
  Use the Personas and transfer panel below the sheet to create, select, rename,
  or delete personas. Each persona saves separately in this browser.
  To move personas to another device, click Export personas and transfer the
  downloaded persona-sheets-backup.json file to that device. Open the same page
  there, click Import backup, and select the JSON file. This is a manual backup
  and restore; it does not provide live cloud synchronization. Keep the backup
  somewhere safe, since browser storage can be cleared.

THE FILES
  index.html         the page layout and script loading order
  config.js          positions, affinity colors, rules and EXP table
  style.css          fonts, text sizes and colors
  sheet.js           sheet behavior and calculations
  persona-manager.js multiple local personas and JSON backup/import
  background.jpg     your sheet artwork

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
      Use New persona in the Personas and transfer panel rather than changing storageKey.

SHARING IT
  Zip the folder and send it, or upload the folder to a web host (GitHub Pages, Netlify, etc.).
  Each visitor's saves remain in their own browser unless they export and transfer a backup.
