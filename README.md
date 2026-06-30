# Better BTU Classroom

A Chrome extension that adds missing quality-of-life features to the [Business and Technology University](https://btu.edu.ge) classroom portal — features the portal should have had out of the box.

**[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/btu+-plus-reworked-pages/ebfenlngaocdpllcejeemfbmnfhhenbh)**

---

## Features

### Compact Schedule
The portal's schedule table is cluttered and hard to scan. The extension merges duplicate course rows, corrects displayed time slots to reflect actual class duration, and trims verbose column headers — giving you a clear view of your week at a glance.

### Bulk File Downloads
The portal forces you to click each file individually, and downloads them with an opaque ID as the filename instead of the actual title. The extension adds an **⬇ Save** button next to every file with the correct name, and a **Download All as ZIP** button per section so you can grab everything at once.

### GPA Calculator
The portal shows raw scores but no GPA. The extension calculates weighted GPA using the formula `Σ(score × credit) / Σcredit`, maps it to a 4-point scale via `(rounded_average − 50) × 0.06 + 1`, and injects the result into three places:
- Below the completed courses table (semester GPA + weighted average + grade letter)
- Inside the per-course scores table
- On the academic card page — per-semester GPA in each semester row, plus a cumulative GPA row alongside the portal's own (less accurate) GPA

### Barrier Progress Bar
The course scores page shows two progress bars for exam eligibility thresholds. The extension color-codes them green or red, adds a marker at the exact barrier point, and displays the maximum possible score inside the bar.

---

## Technical Notes

- **Zero dependencies** — all features are built with vanilla JS
- Works on **Chrome** and **Microsoft Edge**
- Matches both `/ge/` and `/en/` locale URL variants across all 5 page types

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
