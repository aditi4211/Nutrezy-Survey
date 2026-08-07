/**
 * NUTREZY SURVEY — GOOGLE SHEETS RECEIVER
 * ----------------------------------------
 * This is NOT part of the website files. It's a small script that lives
 * inside your Google Sheet and receives each survey response as it's
 * submitted, writing it in as a new row.
 *
 * Setup instructions are in README.md, section 10. Short version:
 *   1. Open (or create) a Google Sheet.
 *   2. Extensions → Apps Script.
 *   3. Delete anything in the editor and paste this whole file in.
 *   4. Deploy → New deployment → type "Web app" → Who has access: "Anyone".
 *   5. Copy the Web app URL it gives you.
 *   6. Paste that URL into CONFIG.GOOGLE_SHEETS_URL near the top of
 *      script.js in your website files.
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // First time this runs, write column headers based on whatever keys
  // came in (so it adapts automatically if you edit the survey questions).
  const keys = Object.keys(data);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(keys);
  } else {
    // If new columns show up later (e.g. you added a question), extend
    // the header row so nothing gets silently dropped.
    const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    keys.forEach(k => {
      if (existingHeaders.indexOf(k) === -1) {
        sheet.getRange(1, existingHeaders.length + 1).setValue(k);
        existingHeaders.push(k);
      }
    });
  }

  // Write the row, matching each value to its column by header name.
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => (data[h] !== undefined ? data[h] : ""));
  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
