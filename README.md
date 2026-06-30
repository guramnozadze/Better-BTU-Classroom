# Better BTU Classroom

A Chrome extension that adds missing quality-of-life features to the [Business and Technology University](https://btu.edu.ge) classroom portal — features the portal should have had out of the box.

**[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/btu+-plus-reworked-pages/ebfenlngaocdpllcejeemfbmnfhhenbh)**

---

## Features

### Bulk File Downloads
On any course's materials page, each file gets an individual **⬇ Save** button. Section headers get a **Download All as ZIP** button that fetches all files concurrently and packages them client-side — no server, no external library. The ZIP is built from scratch using `DataView` + `ArrayBuffer` with a hand-rolled CRC-32 implementation and STORE compression (appropriate since PDFs, PPTX, and DOCX are already compressed containers).

### GPA Calculator
The portal shows raw scores but no GPA. The extension calculates weighted GPA using the formula `Σ(score × credit) / Σcredit`, maps it to a 4-point scale via `(rounded_average − 50) × 0.06 + 1`, and injects the result into three places:
- Below the completed courses table (semester GPA + weighted average + grade letter)
- Inside the per-course scores table
- On the academic card page — per-semester GPA in each semester row, plus a cumulative GPA row alongside the portal's own (less accurate) GPA

### Barrier Progress Bar
The course scores page has two progress bars showing minimum thresholds for exam eligibility. The extension color-codes them green/red based on whether the threshold is met, adds a visible marker line at the exact barrier point when failing, and injects the maximum possible score into the bar. Labels are rewritten to plain Georgian instead of the portal's bureaucratic phrasing.

### Compact Schedule
The schedule table has a toggle (persisted via `localStorage`) that merges consecutive rows for the same course, adjusts the displayed time slot to reflect actual class duration, and trims verbose column headers.

---

## Technical Notes

- **Manifest V3**, content script only — no background service worker, no popup
- **Zero dependencies** — ZIP generation, CRC-32, GPA math, and all DOM work are vanilla JS
- Matches both `/ge/` and `/en/` locale URL variants across all 5 page types
- Requires Chrome 116+

---

## Developer Setup

```bash
git clone https://github.com/guramnozadze/Better-BTU-Classroom
```

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the repo directory

After editing `scripts/content.js`, click the refresh icon on the extension card — no build step needed.

---

## Contributing

Issues and PRs are welcome. The entire extension is a single content script (`scripts/content.js`) that branches by `window.location.href` — it's straightforward to add a new page feature by following the existing pattern.

## License

GPL-3.0 — see [LICENSE](LICENSE).
