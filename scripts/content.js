let extracted_point_credit_pairs = []; // [[POINT, CREDIT]]
if(window.location.href.includes("/schedule")){
  // Changing Table
  const table = document.querySelector('table');
  const originalTableHTML = table.innerHTML; // Store the original table content

  // Append a switch to change a table or not
  const element = document.querySelector('legend');
  if (element) {
    btu_plus_enabled = localStorage.getItem('btu_plus_enabled') === "1";

    const switchContainer = document.createElement('label');
    switchContainer.style.display = 'inline-flex';
    switchContainer.style.alignItems = 'center';
    switchContainer.style.marginLeft = '15px';
    switchContainer.style.cursor = 'pointer';
    switchContainer.innerHTML = `
      <input type="checkbox" id="tableToggle"  style="margin-right: 8px; margin-top: -1px;">
      <span class="badge badge-success" id="btu_plus_badge">BTU+</span>
    `;
    element.appendChild(switchContainer);
    document.getElementById('tableToggle').checked = btu_plus_enabled;

    // Get the checkbox
    const tableToggle = document.getElementById('tableToggle');

    // Function to toggle table changes
    function toggleTableChanges(enabled) {
      const rows = document.querySelectorAll('tr.tip');
      if(enabled){
        rows.forEach(row => {
          if(enabled){
            row.classList.add('btu_plus');
            changeDamatebitiInformaciaStyles();
            renderTable();
          }else{
            row.classList.remove('btu_plus')
          }
        });
      }else{
        table.innerHTML = originalTableHTML
      }
      localStorage.setItem("btu_plus_enabled", enabled ? "1" : "0");
      document.getElementById("btu_plus_badge").style.backgroundColor = enabled ? '#cb2d78' : '#BDBDBD';
      document.getElementById("btu_plus_badge").style.userSelect = "none";
    }

    // Add event listener to checkbox
    tableToggle.addEventListener('change', (e) => {
      toggleTableChanges(e.target.checked);
    });

    // Initialize the table state
    toggleTableChanges(tableToggle.checked);
  }

  function renderTable(){
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr.tip.btu_plus');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td')
      cells.forEach((cell,index) => {
        cell.style.whiteSpace = 'nowrap';
        cell.style.padding = '12px';
        cell.style.paddingLeft = '8px';
        switch (index){
          // კურსის დასახელება CONTENT
          case 2:
            const prevRow = rows[rowIndex - 1];
            if(cell.textContent.trim() === prevRow?.querySelectorAll('td')?.[2]?.textContent?.trim()){
              // remove element
              prevRow.remove()
              const time = cells[0].textContent.trim(); // Get the time string
              const [start, end] = time.split(' - '); // Split into start and end times

              function adjustTime(timeStr, hourDiff, minDiff) {
                let [hours, minutes] = timeStr.split(':').map(Number);
                hours = (hours + hourDiff + 24) % 24; // Adjust hours, ensuring it wraps correctly
                minutes += minDiff;

                if (minutes >= 60) {
                  hours += Math.floor(minutes / 60);
                  minutes %= 60;
                }

                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              }

              const newStart = adjustTime(start, -1, 0);  // Decrease start time by 1 hour
              const newEnd = adjustTime(end, 0, 10);     // Increase end time by 10 minutes;

              cells[0].textContent = `${newStart} - ${newEnd}`; // Update the cell
              cells[0].style.fontWeight = '600'; // Update the cell
              cells[0].style.paddingRight = '20px'; // Update the cell
              // Decrease time by 1 hour 10:00 - 10:50 =>>>> 09:00 - 11:00
              // cells[0].textContent = ""
              cell.textContent = cell.textContent.split('-').slice(2).join('-').trim();

            }
            break;

          // დამ. ინფორმაცია CONTENT
          case 5:
            cell.style.whiteSpace = 'pre-line';
            break;
        }
      })
    })
  }

  function changeDamatebitiInformaciaStyles(){
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr:not([class])');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells[5].title = 'დამaტებითი ინფორმაცია'
      cells[5].querySelector('b').textContent = 'დამ. ინფორმაცია'
      cells[5].style.whiteSpace = 'nowrap';
      cells[5].style.overflow = 'hidden';
      cells[5].style.textOverflow = 'ellipsis';
      // cells[5].style.maxWidth = "150px";
    })
  }
}

// Extracting points and credits from table (only finished classes)
if(window.location.href.includes("/courses") && !window.location.href.includes("/courses/scores")){
  const table = document.querySelector('table');
  if (table) {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const tds = row.querySelectorAll('td');

      if (tds.length >= 2) {
        if (tds[3] && tds[5] && tds[0].classList.contains('text-success')) {
          const point = Number(tds[3].textContent.trim());
          const credit = Number(tds[5].textContent.trim());
          extracted_point_credit_pairs.push([point, credit]);
        }
      }
    });

    // Bug fix
    if(extracted_point_credit_pairs.length > 0){
      showGpaAfterElement(table, extracted_point_credit_pairs);
    }
  } else {
    console.log(table, "არჩეული კურსების TABLE Not Found");
  }
}

// Changing text and color of competence progress bar
if(window.location.href.includes("/course/scores")) {
  const barriers = document.querySelectorAll('.barrier');
  if (barriers && barriers.length === 2) {
    for (const [index, barrierDiv] of barriers.entries()) {
      // New text that better explains this is for assignments/quizzes excluding midterm
      //  paragraphElement.textContent = "შუალედური გამოცდის გარდა, დანარჩენი აქტივობების (ქვიზები, დავალებები) მინიმალური ზღვარი | " + match[0] + "/" + match[1];


      // if(!currentValue){
      //     continue;
      // }

      // Get the progress bar and modify its color
      const progressBar = barrierDiv.querySelector('.progress-bar');
      if (progressBar) {
        // Get current and Max Barrier Value
        const currentValue = parseFloat(progressBar.getAttribute('aria-valuenow'));
        const barrierValue = parseFloat(progressBar.getAttribute('aria-valuemax'));
        const displayCurrentValue = currentValue.toFixed(2);
        const displayBarrierValue = barrierValue.toFixed(2);

        // Change Text
        const barrierParagraphElement = barrierDiv.querySelector('p');
        const barrierText = barrierParagraphElement.textContent
        const match = barrierText.match(/\d+\.?\d*/g); // This will match numbers including decimals
        const maxValue = match ? parseFloat(match[0]) : 0; // Get the second number (18.86)


        if (index === 0) {
          // old text სემესტრული შეფასებების მინიმალური კომპეტენციის ზღვარი | 40/16.4
          barrierParagraphElement.innerHTML = `ყველა აქტივობის ჯამი, გარდა შუალედურისა - ფინალურზე დასაშვები ზღვარი - <b>${displayBarrierValue}</b>`;
        }

        if (index === 1) {
          // old text შუალედური შეფასებების მინიმალური კომპეტენციის ზღვარი | 70/28.7
          barrierParagraphElement.innerHTML = `ყველა აქტივობისა და შუალედურის ჯამი - ფინალურზე დასაშვები ზღვარი - <b>${displayBarrierValue}</b>`;
          insertExclamationIconInfo(barrierParagraphElement, displayBarrierValue)
        }

        // Change color based on whether it meets the minimum barrier
        if (currentValue >= barrierValue) {
          progressBar.style.backgroundColor = '#28a745'; // Green for pass
          progressBar.setAttribute('title', `${displayBarrierValue} ქულიანი ბარიერი გადალახულია`);
        } else {
          // Insert absolute green dash representing barrier
          const barrierIndicator = document.createElement('div');
          barrierIndicator.title = `ბარიერი - ${displayBarrierValue}`;
          barrierIndicator.style.position = 'absolute';
          barrierIndicator.style.left = `${(displayBarrierValue / maxValue) * 100}%`;
          barrierIndicator.style.height = '100%';
          barrierIndicator.style.width = '2px';  // width of the dash
          barrierIndicator.style.backgroundColor = '#28a745';  // Bootstrap success green
          barrierIndicator.style.zIndex = '1';   // ensure it's above the progress bar
          progressBar.parentElement.appendChild(barrierIndicator);

        }

        // ** Injecting max value inside progress bar
        // ** Injecting max value inside progress bar
        // ** Injecting max value inside progress bar
        progressBar.parentElement.style.position = 'relative'

        // Create and style the max value element
        const maxValueDiv = document.createElement('div');
        maxValueDiv.style.position = 'absolute';
        maxValueDiv.style.right = '16px';
        maxValueDiv.style.top = '0';
        if(currentValue >= maxValue){
          maxValueDiv.textContent = `PERFECT`;
          maxValueDiv.style.color = "#FFF"
        }else{
          maxValueDiv.textContent = `(მაქს: ${maxValue})`;
        }
        // maxValueDiv.style.color = '#6c757d'; // Bootstrap secondary color
        maxValueDiv.style.fontSize = '1rem'; // 14px
        maxValueDiv.style.lineHeight = progressBar.offsetHeight + 'px'; // Center vertically

        progressBar.parentElement.appendChild(maxValueDiv);
      }
    }
  }


  //     INSERT GPA IN TABLE
  //     INSERT GPA IN TABLE
  //     INSERT GPA IN TABLE
  const table = document.querySelector('table');
  showCourseGpaAfterTable(table)
}

if(window.location.href.includes("/student/card")){
  const table = document.querySelector('table');
  if (table) {
    const rows = table.querySelectorAll('tr');
    let GPA_ROW_INDEX;
    let all_points_credits = [];
    let semester_points_credits = [];

    rows.forEach((row, i) => {
      const tds = row.querySelectorAll('td');
      if (tds?.[0]?.textContent.trim() === 'GPA'){
        GPA_ROW_INDEX = i
      }
      if (tds.length === 4) {
        const point = tds?.[3]?.textContent?.trim();
        const credit = tds?.[2]?.textContent?.trim();

        if(isNumber(credit) && Number(credit) !== 0) {
          if(isNumber(point)){
            semester_points_credits.push([Number(point), Number(credit)]);
            all_points_credits.push([Number(point), Number(credit)]);
          }else{
            if (Number(credit) === semester_points_credits.reduce((acc, [_, credit]) => acc + credit, 0)) {
              // we have hit bottom of semester and siplay GPA at point 'td'
              const [GPA, points_sum, chabarebuli_sagnebi] = calculateGpa(semester_points_credits)
              semester_points_credits = [];
              tds[3].setAttribute("align", "center")
              tds[3].innerHTML = `<b>GPA ${GPA.toFixed(2)}</b>`
            }
          }

        }
      }
    });

    if(GPA_ROW_INDEX){
      const GPA_ROW = table.querySelectorAll('tr')[GPA_ROW_INDEX];
      console.log(GPA_ROW)

      const [GPA, points_sum, chabarebuli_sagnebi] = calculateGpa(all_points_credits)
      const newButPlusGPARow = GPA_ROW.cloneNode(true)
      newButPlusGPARow.querySelectorAll('td')[0].innerHTML = `GPA <span class="badge badge-success" style="background-color:#cb2d78;">BTU+</span> `;
      newButPlusGPARow.querySelectorAll('td')[1].innerHTML = `<b style="color:#cb2d78;">${GPA.toFixed(2)}<b/>`;
      GPA_ROW.insertAdjacentElement("afterend", newButPlusGPARow);
    }
  }
}


// Calculating GPA Σ(GPA x CR) / ΣCR
function calculateGpa(point_credit_pairs) {  // [[POINT, CREDIT]]
  const credits_sum = point_credit_pairs.reduce((acc, [_, credit]) => acc + credit, 0)
  const points_sum = point_credit_pairs.reduce((acc, [point, _]) => acc + point, 0)

  const weighted_average = point_credit_pairs.reduce((acc, [point, credit]) => acc + (point * credit), 0) / credits_sum;
  const rounded_average = Math.round(weighted_average);
  const gpa = (rounded_average - 50) * 0.06 + 1;


  // GPA of finished classes so far
  return [gpa, points_sum, point_credit_pairs.length];
}

function showGpaAfterElement(element, point_credit_pairs) {
  if (element) {
    const [gpa_semester, points_sum, len] = calculateGpa(point_credit_pairs);


    // შერჩევითი საშუალო კრედიტების წონის მიხედვიტ
    const weightedAverage = point_credit_pairs.reduce((acc, [point, credit]) => acc + (point * credit), 0) /
      point_credit_pairs.reduce((acc, [_, credit]) => acc + credit, 0);
    const weighted_average_p = document.createElement('p');
    weighted_average_p.textContent = `შერჩევითი საშუალო ${weightedAverage.toFixed(2)} (${calcGradeLetter(points_sum / len)})`;
    element.insertAdjacentElement('afterend', weighted_average_p);

    const average_points_p = document.createElement('p');
    // average_points.textContent = `საშუალო ქულა ${points_sum/len.toFixed(2)} - (${points_sum}/${len})`;
    average_points_p.textContent = `საშუალო ქულა ${(points_sum/len).toFixed(2)} (${calcGradeLetter(points_sum/len)})`;
    element.insertAdjacentElement('afterend', average_points_p);

    const finished_count_p = document.createElement('p');
    finished_count_p.textContent = `ჩაბარებული საგნები ${point_credit_pairs.length}`;
    element.insertAdjacentElement('afterend', finished_count_p);

    // GPA(S) = Σ(GPA x CR) / ΣCR
    const gpa_p = document.createElement('p');
    const boldText = document.createElement('b');
    gpa_p.appendChild(boldText);
    // badge.textContent = `მიმდინარე GPA ${gpa_semester.toFixed(2)} - Σ(GPA x CR) / ΣCR` ;
    boldText.textContent = `სემესტრის GPA ${gpa_semester.toFixed(2)}` ;
    element.insertAdjacentElement('afterend', gpa_p);

    // Brand
    gpa_p.insertAdjacentHTML("beforeend", `<span class="badge badge-success" style="margin-left:8px;margin-top:4px;background-color:#cb2d78;">BTU+</span>`)

  } else {
    console.log("not found element")
  }
}

function showCourseGpaAfterTable(table){
  if(!table){
    return;
  }

  // Select all rows in the table body
  let rows = table.querySelectorAll("tbody tr");

  // Get the last two rows
  let lastTwoRows = Array.from(rows).slice(-2);

  const point = lastTwoRows[0]?.querySelectorAll('td')?.[1]?.innerText ?? 0;
  const credit = lastTwoRows[1]?.querySelectorAll('td')?.[1]?.innerText ?? 0;
  if(credit > 0){
    let newRow = document.createElement("tr");
    // Create the first TD with class "warning"
    let td1 = document.createElement("td");
    td1.classList.add("warning");
    let strong1 = document.createElement("strong");
    strong1.innerHTML = "GPA <span class=\"badge badge-success\" style=\"background-color:#cb2d78;\">BTU+</span>";
    td1.appendChild(strong1);

    // Create the second TD
    let td2 = document.createElement("td");
    let div = document.createElement("div");
    div.style.paddingLeft = "20px"; // Add inline style
    let strong2 = document.createElement("strong");
    strong2.style.color = "#cb2d78";
    strong2.innerHTML = `${((Number(point) - 50) * 0.06 + 1).toFixed(2)}`;
    div.appendChild(strong2);
    td2.appendChild(div);

    // Append TDs to the row
    newRow.appendChild(td1);
    newRow.appendChild(td2);

    // Append the row to the table body
    table.querySelector("tbody").appendChild(newRow)
  }

}

function calcGradeLetter(point){
  if(point === 100){
    return 'A+ Perfect'
  }
  if(point > 95){
    return 'A+'
  }
  if(point > 90){
    return 'A'
  }
  if(point > 85){
    return 'B+'
  }
  if(point > 80){
    return 'B'
  }
  if(point > 75){
    return 'C+'
  }
  if(point > 70){
    return 'C'
  }
  if(point > 65){
    return 'D+'
  }
  if(point > 60){
    return 'D'
  }
  if(point > 55){
    return 'C+'
  }
  if(point > 50){
    return 'C'
  }
  return ''
}

function insertExclamationIconInfo(element, minBarrier){

  if(!element){
    return
  }

  // TEXT ICON
  const warningText = `შენიშვნა: თუ შუალედურში ჩაიჭერი, სხვა აქტივობებით დაგროვებული ${minBarrier || "მინიმალურ"} ქულა საკმარისი იქნება ფინალურზე გასასვლელად! თუ ფიქრობ რომ ვერ დააგროვებ რეკომენდირებულია დროულად! - ლექტორთან დალაპარაკება ან მეილზე მიწერა.`
  const warningIcon = document.createElement('i');
  warningIcon.className = 'icon-info-sign';
  warningIcon.setAttribute('title', warningText);

  // Add a unique class to the icon
  warningIcon.className += ' guram-nozadze-warning-icon';

  // Add style rules
  const style = document.createElement('style');
  style.textContent = `
		.guram-nozadze-warning-icon {
			padding-left: 8px;
			cursor: help;
			opacity: 0.55;
			transition: opacity 0.2s ease;
		}
		.guram-nozadze-warning-icon:hover {
			opacity: 1;
		}
	`;
  document.head.appendChild(style);

  // warningIcon.style.color = '#ffc107'; // Warning yellow color

  // Find parent element and append the icon
  // const parentElement = barriers[0].parentElement;
  // const headingText = document.createElement('div');
  // headingText.className = 'fw-bold mb-3'; // Bootstrap classes for bold text and margin
  // headingText.textContent = 'შეფასების კომპონენტები და ბარიერები';
  // headingText.appendChild(warningIcon);

  // Insert heading before the barriers
  element.appendChild(warningIcon);
}

function isNumber(str){
  if(!str) return false;
  return !isNaN(Number(str))
}

// Training Materials — named download buttons per file and per section
if (window.location.href.includes("/course/files/")) {
  setupTrainingMaterialDownloads();
}

function setupTrainingMaterialDownloads() {
  const style = document.createElement('style');
  style.textContent = `
    .btu-dl-btn {
      display: inline-block;
      margin-left: 8px;
      padding: 1px 7px;
      font-size: 11px;
      cursor: pointer;
      background: transparent;
      color: #337ab7;
      border: 1px solid #337ab7;
      border-radius: 4px;
      vertical-align: middle;
      text-decoration: none !important;
      white-space: nowrap;
      opacity: 0.75;
      transition: opacity 0.25s;
    }
    .btu-dl-btn:hover { opacity: 1; }
    .btu-dl-all-btn {
      display: inline-block;
      margin-left: 12px;
      padding: 2px 10px;
      font-size: 11px;
      cursor: pointer;
      background: transparent;
      color: #31708f;
      border: 1px solid #31708f;
      border-radius: 4px;
      vertical-align: middle;
      opacity: 0.85;
      transition: opacity 0.25s;
    }

    .btu-dl-all-btn:hover { opacity: 1; }
    .btu-dl-all-btn:disabled { opacity: 0.4; cursor: default; }

    tr.info .glyphicon { top: 3px; }
  `;
  document.head.appendChild(style);

  const table = document.querySelector('table');
  if (!table) {
    return;
  }

  const rows = Array.from(table.querySelectorAll('tr'));
  const sections = [];
  let currentSection = null;

  rows.forEach(row => {
    // target glyphicon and make top 3px instead of 1

    // Section header rows have class="info" (blue background rows with instructor name)
    if (row.classList.contains('info')) {
      currentSection = { headerRow: row, files: [] };
      sections.push(currentSection);
      return;
    }

    if (!currentSection) return;

    // The downloadable file link is always the <a> in the first <td>
    const firstCell = row.querySelector('td:first-child');
    if (!firstCell) return;

    const link = firstCell.querySelector('a');
    if (!link) return;

    // External link rows have href="" — the actual URL lives in the second <td>
    // link.getAttribute('href') gives the raw attribute value, "" for external rows
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;

    const filename = extractFilename(link);
    currentSection.files.push({ href: link.href, name: filename });

    // Add individual download button into the second (empty) table cell
    const secondCell = row.querySelector('td:last-child');
    const dlBtn = document.createElement('a');
    dlBtn.className = 'btu-dl-btn';
    dlBtn.href = link.href;
    dlBtn.download = filename;
    dlBtn.textContent = '⬇ Save';
    dlBtn.title = `Download as "${filename}"`;
    secondCell.appendChild(dlBtn);
  });

  // Add "Download All as ZIP" button to each section header
  sections.forEach(section => {
    if (section.files.length === 0) return;
    const headerCell = section.headerRow.querySelector('td');
    if (!headerCell) return;

    const lecturerName = getLecturerName(section.headerRow);

    const allBtn = document.createElement('button');
    allBtn.className = 'btu-dl-all-btn';
    allBtn.textContent = `⬇ Download All (${section.files.length})`;
    allBtn.title = `Download all ${section.files.length} files as ZIP`;
    allBtn.addEventListener('click', () => downloadAllAsZip(section.files, lecturerName, allBtn));
    headerCell.appendChild(allBtn);
  });
}

function isSameDomain(href) {
  try {
    return new URL(href).hostname === window.location.hostname;
  } catch {
    return true; // relative URLs are same-domain
  }
}

function extractFilename(linkEl) {
  const clone = linkEl.cloneNode(true);
  clone.querySelectorAll('i').forEach(i => i.remove());
  return clone.textContent.trim();
}

function getLecturerName(headerRow) {
  const link = headerRow.querySelector('a[href*="/lector/"]');
  return link ? link.textContent.trim() : '';
}

function getCourseName() {
  const legend = document.querySelector('legend');
  if (!legend) return 'Course';
  const text = legend.textContent.trim();
  const dashIdx = text.indexOf(' - ');
  return dashIdx !== -1 ? text.slice(dashIdx + 3) : text;
}

function getExtFromUrl(url) {
  try {
    const path = new URL(url).pathname;
    const dot = path.lastIndexOf('.');
    return dot !== -1 ? path.slice(dot) : '';
  } catch {
    return '';
  }
}

async function downloadAllAsZip(files, lecturerName, btn) {
  const originalText = btn.textContent;
  btn.disabled = true;

  const courseName = getCourseName();
  const zipName = `${courseName}-${lecturerName}-მასალები.zip`;

  let completed = 0;
  btn.textContent = `Fetching 0 / ${files.length}…`;

  const results = await Promise.allSettled(
    files.map(async ({ href, name }) => {
      const response = await fetch(href, { credentials: 'include' });
      const buffer = await response.arrayBuffer();
      btn.textContent = `Fetching ${++completed} / ${files.length}…`;
      return { name: name + getExtFromUrl(href), data: new Uint8Array(buffer) };
    })
  );

  const entries = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  btn.textContent = 'Building ZIP…';
  const blob = buildZip(entries);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  btn.textContent = originalText;
  btn.disabled = false;
}

// Pre-computed CRC-32 lookup table
const CRC32_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]) & 0xFF];
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Builds a ZIP blob from entries using STORE (no compression).
// PDF/PPTX/DOCX are already compressed containers, so re-compressing wastes time.
function buildZip(entries) {
  const enc = new TextEncoder();
  const localParts = [];
  const cdParts = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBytes = enc.encode(name);
    const checksum = crc32(data);
    const size = data.length;

    // Local file header: 30 bytes fixed + filename
    const lhBuf = new ArrayBuffer(30 + nameBytes.length);
    const lh = new DataView(lhBuf);
    lh.setUint32(0,  0x04034b50, true); // signature
    lh.setUint16(4,  20,         true); // version needed
    lh.setUint16(6,  0x0800,     true); // flags: UTF-8 filename (bit 11)
    lh.setUint16(8,  0,          true); // compression: STORE
    lh.setUint16(10, 0,          true); // mod time
    lh.setUint16(12, 0,          true); // mod date
    lh.setUint32(14, checksum,   true); // CRC-32
    lh.setUint32(18, size,       true); // compressed size
    lh.setUint32(22, size,       true); // uncompressed size
    lh.setUint16(26, nameBytes.length, true); // filename length
    lh.setUint16(28, 0,          true); // extra field length
    new Uint8Array(lhBuf, 30).set(nameBytes);

    localParts.push(lhBuf, data);

    // Central directory entry: 46 bytes fixed + filename
    const cdBuf = new ArrayBuffer(46 + nameBytes.length);
    const cd = new DataView(cdBuf);
    cd.setUint32(0,  0x02014b50, true); // signature
    cd.setUint16(4,  20,         true); // version made by
    cd.setUint16(6,  20,         true); // version needed
    cd.setUint16(8,  0x0800,     true); // flags: UTF-8 filename (bit 11)
    cd.setUint16(10, 0,          true); // compression
    cd.setUint16(12, 0,          true); // mod time
    cd.setUint16(14, 0,          true); // mod date
    cd.setUint32(16, checksum,   true); // CRC-32
    cd.setUint32(20, size,       true); // compressed size
    cd.setUint32(24, size,       true); // uncompressed size
    cd.setUint16(28, nameBytes.length, true); // filename length
    cd.setUint16(30, 0,          true); // extra field length
    cd.setUint16(32, 0,          true); // file comment length
    cd.setUint16(34, 0,          true); // disk number start
    cd.setUint16(36, 0,          true); // internal attributes
    cd.setUint32(38, 0,          true); // external attributes
    cd.setUint32(42, offset,     true); // local header offset
    new Uint8Array(cdBuf, 46).set(nameBytes);

    cdParts.push(cdBuf);
    offset += 30 + nameBytes.length + size;
  }

  // End of central directory record: 22 bytes
  const cdSize = cdParts.reduce((s, b) => s + b.byteLength, 0);
  const eocdBuf = new ArrayBuffer(22);
  const eocd = new DataView(eocdBuf);
  eocd.setUint32(0,  0x06054b50,     true); // signature
  eocd.setUint16(4,  0,              true); // disk number
  eocd.setUint16(6,  0,              true); // disk with central dir
  eocd.setUint16(8,  entries.length, true); // entries on disk
  eocd.setUint16(10, entries.length, true); // total entries
  eocd.setUint32(12, cdSize,         true); // central dir size
  eocd.setUint32(16, offset,         true); // central dir offset
  eocd.setUint16(20, 0,              true); // comment length

  return new Blob([...localParts, ...cdParts, eocdBuf], { type: 'application/zip' });
}
