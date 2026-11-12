/**
 * Al Hadaf content sheet.
 *
 * POST fields (use these names):
 *   password, type (blog|project), title, author, projectLead,
 *   member1, member2, member3, company, content, imageURLs,
 *   SeoTitle, SeoDescription, timestamp, slug
 * SeoTitle and SeoDescription are optional. timestamp is optional and must
 * be ISO 8601 UTC (2026-11-09T04:39:28.000Z) when it is sent. Otherwise the
 * script writes the current UTC time in that same format.
 *
 * camelCase seoTitle / seoDescription is also accepted.
 *
 * Timestamps are stored as plain text so Google Sheets cannot swap the day
 * and month. Existing locale strings are read as day-month-year in
 * Asia/Kolkata, which matches the Asia/Calcutta publish-log clock.
 *
 * Deploy as a web app (execute as me, anyone can access), then run
 * repairContentSheet once from the editor or open the web app once.
 * Leave SPREADSHEET_ID empty when this project is bound to the content sheet.
 */
var SPREADSHEET_ID = "";
var ADMIN_PASSWORD = "alhadaf2025";
var KOLKATA_OFFSET_MINUTES = 5 * 60 + 30;

var DAY_MONTH_CORRECTIONS = {
  "2026-08-10T11:45:09.000Z": "2026-10-08T11:45:09.000Z",
  "2026-12-10T04:45:01.000Z": "2026-10-12T04:45:01.000Z",
  "2026-02-11T04:46:33.000Z": "2026-11-02T04:46:33.000Z",
  "2026-09-11T04:39:28.000Z": "2026-11-09T04:39:28.000Z",
  "2025-03-11T08:17:24.000Z": "2025-11-03T08:17:24.000Z",
  "2025-02-12T04:27:38.000Z": "2025-12-02T04:27:38.000Z",
  "2025-03-11T08:30:50.000Z": "2025-11-03T08:30:50.000Z",
  "2025-03-11T08:48:39.000Z": "2025-11-03T08:48:39.000Z",
  "2025-03-11T09:04:02.000Z": "2025-11-03T09:04:02.000Z"
};

var CATALOG = [
  { type: "blog", title: "Why Powder Coating Is the Best Finish for Metal Products", slug: "why-powder-coating-is-the-best-finish-for-metal-products", raw: ["24/11/2025, 9:31:46 am"], seoTitle: "Why Powder Coating Is the Best Metal Finish | Al-Hadaf", seoDescription: "Powder coating is one of the most trusted and durable finishing solutions for metal products, offering long-lasting protection and a premium look." },
  { type: "blog", title: "Celebrate UAE Flag Day 2025 – Unity, Heritage & Proud Colours of the United Arab Emirates", slug: "celebrate-uae-flag-day-2025-unity-heritage-proud-colours-of-the-united-arab-emirates", raw: ["2025-03-11T08:17:24.000Z"], seoTitle: "Celebrate UAE Flag Day 2025: Unity and Heritage", seoDescription: "We honour UAE Flag Day, celebrated every year on 3 November, a day of pride, identity and unity that reaffirms our allegiance and love for the nation." },
  { type: "blog", title: "54 UAE National Day", slug: "54-uae-national-day", raw: ["2025-02-12T04:27:38.000Z"], seoTitle: "54 UAE National Day | Al Hadaf Metal Coating", seoDescription: "UAE National Day marks the historic union of the seven emirates on December 2nd, a day that symbolizes pride, unity, and remarkable progress." },
  { type: "blog", title: "Al Hadaf Metal Coating LLC Awarded Certification by Sharjah Municipality, UAE", slug: "al-hadaf-metal-coating-llc-awarded-certification-by-sharjah-municipality-uae", raw: ["25/1/2026, 12:34:08 am"], seoTitle: "Al Hadaf Certified by Sharjah Municipality, UAE", seoDescription: "Al Hadaf Metal Coating LLC has been certified and recognized by the Municipal Authority of Sharjah, UAE, for quality services and professional excellence." },
  { type: "blog", title: "Powder Coating in Sharjah: Process, Finishes & Quotes", slug: "powder-coating-in-sharjah-process-finishes-quotes", raw: ["2026-08-10T11:45:09.000Z"], seoTitle: "Powder Coating in Sharjah: Process, Finishes & Quotes", seoDescription: "If you are looking for powder coating in Sharjah, this guide covers the process, finishes and RAL colours, and what to send for an accurate quote." },
  { type: "blog", title: "Aluminium Powder Coating in Dubai: Windows, Doors & Facades", slug: "aluminium-powder-coating-in-dubai-windows-doors-facades", raw: ["2026-12-10T04:45:01.000Z"], seoTitle: "Aluminium Powder Coating in Dubai: Windows, Doors & Facades", seoDescription: "Architects specifying powder coating in Dubai for aluminium windows, doors and facades need a finish that holds colour under strong sun and coastal air." },
  { type: "blog", title: "Metal Coating in the UAE: A Guide to 7 Finishes", slug: "metal-coating-in-the-uae-a-guide-to-7-finishes", raw: ["19/10/2026, 10:16:57 am"], seoTitle: "Metal Coating in the UAE: A Guide to 7 Finishes", seoDescription: "This guide explains the main types of metal coating UAE workshops offer, what each one does, and which jobs it suits, from powder coating to antique finishes." },
  { type: "blog", title: "RAL Colour Chart for Powder Coating: How to Choose", slug: "ral-colour-chart-for-powder-coating-how-to-choose", raw: ["26/10/2026, 10:10:36 am"], seoTitle: "RAL Colour Chart for Powder Coating: How to Choose", seoDescription: "A RAL colour chart for powder coating makes colour choice clear and repeatable. This guide explains how RAL codes work and how to use our interactive RAL tool." },
  { type: "blog", title: "Sandblasting in Sharjah: Why Prep Decides Coating Life", slug: "sandblasting-in-sharjah-why-prep-decides-coating-life", raw: ["2026-02-11T04:46:33.000Z"], seoTitle: "Sandblasting in Sharjah: Why Prep Decides Coating Life", seoDescription: "Sandblasting in Sharjah is often the step customers never see, yet it has more effect on how long a coating lasts than almost anything else." },
  { type: "blog", title: "Powder Coating vs Galvanizing: Which Is Right for Steel?", slug: "powder-coating-vs-galvanizing-which-is-right-for-steel", raw: ["2026-09-11T04:39:28.000Z"], seoTitle: "Powder Coating vs Galvanizing: Which Is Right?", seoDescription: "Powder coating vs galvanizing is one of the most common questions we hear from customers with steel to protect. Both stop rust, but they work in different ways." },
  { type: "project", title: "Dubai Hills", slug: "dubai-hills", raw: ["15/10/2025, 4:39:30 pm"], seoTitle: "", seoDescription: "" },
  { type: "project", title: "Pwder Coating", slug: "powder-coating-dubai-rta-border-fencing", raw: ["22/10/2025, 10:28:05 am"], seoTitle: "Border Fencing Powder Coating for Dubai RTA", seoDescription: "Successfully completed the powder coating work for fencing at the border, ensuring a durable, corrosion-resistant and weatherproof finish that lasts." },
  { type: "project", title: "Powder Coating", slug: "powder-coating-piccadilly-whippy", raw: ["22/10/2025, 10:30:40 am"], seoTitle: "Ice Cream Van Powder Coating | Piccadilly Whippy", seoDescription: "Successfully completed the Piccadilly Whippy ice cream van powder coating project, ensuring a high-quality, durable and uniform finish for outdoor use." },
  { type: "project", title: "Powder Coating", slug: "powder-coating-carrefour-market", raw: ["22/10/2025, 10:34:15 am"], seoTitle: "Powder Coating Work for Carrefour Market, UAE", seoDescription: "Successfully completed wooden acrylic and powder coating work for Carrefour Market, UAE, delivering a high-quality, durable, and aesthetically refined finish." },
  { type: "project", title: "Powder Coating", slug: "powder-coating-stanley-hardware", raw: ["23/10/2025, 12:06:12 pm"], seoTitle: "Powder Coating for Stanley Hardware and Tools", seoDescription: "Successfully completed the powder coating work for Stanley Hardware and Power Tools, ensuring a durable, corrosion-resistant, high-performance finish." },
  { type: "project", title: "Aafina Hotel Powder Coating Project – Premium Metal Finishing by Al Hadaf Metal Coating, Jumeirah Lake Towers, Dubai", slug: "aafina-hotel-powder-coating-project-premium-metal-finishing-by-al-hadaf-metal-coating-jumeirah-lake-towers-dubai", raw: ["2025-03-11T08:30:50.000Z"], seoTitle: "Aafina Hotel Powder Coating Project, JLT Dubai", seoDescription: "A high-end powder coating project for Aafina Hotel in Jumeirah Lake Towers, Dubai, covering decorative metal structures, railing panels and design fixtures." },
  { type: "project", title: "Industrial Mesh Fence Powder Coating Project – KIZAD Industrial Zone, Abu Dhabi", slug: "industrial-mesh-fence-powder-coating-project-kizad-industrial-zone-abu-dhabi", raw: ["2025-03-11T08:48:39.000Z"], seoTitle: "Industrial Mesh Fence Powder Coating in KIZAD", seoDescription: "Large-scale industrial powder coating for KIZAD Industrial Zone in Abu Dhabi, covering heavy-duty mild steel mesh fence panels for harsh outdoor conditions." },
  { type: "project", title: "Sharjah International Airport Cladding Project – Architectural Metal Finishing by Al Hadaf Metal Coating", slug: "sharjah-international-airport-cladding-project-architectural-metal-finishing-by-al-hadaf-metal-coating", raw: ["2025-03-11T09:04:02.000Z"], seoTitle: "Sharjah Airport Cladding Powder Coating Project", seoDescription: "Architectural finishing for Sharjah International Airport: aluminium and steel cladding powder coated in metallic silver and architectural white." },
  { type: "project", title: "PepsiCo Powder Coating Panel Transformation Project", slug: "pepsico-powder-coating-panel-transformation-project", raw: ["2025-12-12T05:06:40.000Z"], seoTitle: "PepsiCo Mesh Panel Powder Coating Restoration", seoDescription: "Complete powder-coating restoration of large industrial metal mesh panels used by PepsiCo, from surface preparation to a high-gloss, vibrant yellow finish." },
  { type: "project", title: "Curved Metal Structure Powder Coating Project – UAE", slug: "curved-metal-structure-powder-coating-project-uae", raw: ["2025-12-12T05:25:39.000Z"], seoTitle: "Curved Metal Structure Powder Coating in the UAE", seoDescription: "Powder coating of large curved metal structures for architectural or industrial use, prepared and oven-cured for long-term outdoor durability in the UAE." },
  { type: "project", title: "Yellow Safety Bollards & Protective Pipe Coating – Madina Supermarket", slug: "yellow-safety-bollards-protective-pipe-coating-madina-supermarket", raw: ["24/12/2025, 11:26:12 am"], seoTitle: "Yellow Safety Bollards for Madina Supermarket", seoDescription: "Powder coating of cylindrical metal safety pipes and bollards for Madina Supermarket, finished in bright industrial yellow for parking and loading areas." },
  { type: "project", title: "Decorative Mesh Panel Powder Coating", slug: "decorative-mesh-panel-powder-coating", raw: ["31/12/2025, 11:08:48 am"], seoTitle: "Decorative Mesh Panel Powder Coating, Hatta Wadi", seoDescription: "Powder coating of large decorative metal mesh panels developed for Hatta Wadi Park, intended for architectural, landscaping and public space applications." }
];

var ISO_UTC = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:Z)?)?$/i;
var DAY_MONTH_YEAR = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?:[,\sT]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([ap]m))?)?$/i;

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var warning = "";
  try {
    repairContentSheet();
  } catch (error) {
    warning = String(error && error.message || error);
  }
  try {
    var payload = { result: "success", data: readRows() };
    if (warning) payload.warning = warning;
    return json(payload);
  } catch (error) {
    return json({ result: "error", message: String(error && error.message || error) });
  }
}

function doPost(e) {
  var params = (e && e.parameter) || {};
  if (String(params.password || "") !== ADMIN_PASSWORD) {
    return json({ result: "error", message: "Invalid password" });
  }
  try {
    var saved = appendEntry(params);
    return json({ result: "success", slug: saved.slug, timestamp: saved.timestamp });
  } catch (error) {
    return json({ result: "error", message: String(error && error.message || error) });
  }
}

function contentSpreadsheet() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) throw new Error("Bind this script to the content spreadsheet or set SPREADSHEET_ID.");
  return active;
}

function contentSheet() {
  var ss = contentSpreadsheet();
  return ss.getSheetByName("Content") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
}

function headerList(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0].map(function (value) {
    return String(value || "").trim();
  });
  if (headers.indexOf("Title") === -1 || headers.indexOf("Type") === -1) {
    throw new Error("Row 1 must contain Title and Type headers.");
  }
  return headers;
}

function ensureColumn(sheet, name) {
  var headers = headerList(sheet);
  var index = headers.indexOf(name);
  if (index !== -1) return index + 1;
  var col = headers.length + 1;
  for (var i = 0; i < headers.length; i++) {
    if (!headers[i]) {
      col = i + 1;
      break;
    }
  }
  sheet.getRange(1, col).setValue(name);
  return col;
}

function readRows() {
  var sheet = contentSheet();
  var headers = headerList(sheet);
  if (sheet.getLastRow() < 2) return [];
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  return values.map(function (row) {
    var item = {};
    headers.forEach(function (header, index) {
      if (!header) return;
      var value = row[index];
      if (header === "Timestamp") value = toUtcIso(stampText(value)) || "";
      else if (Object.prototype.toString.call(value) === "[object Date]") value = Utilities.formatDate(value, "UTC", "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
      item[header] = value == null ? "" : String(value);
    });
    return item;
  }).filter(function (item) {
    return String(item.Title || "").trim() || String(item.Type || "").trim();
  });
}

function repairContentSheet() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    var sheet = contentSheet();
    ["Timestamp", "Slug", "SeoTitle", "SeoDescription"].forEach(function (name) {
      ensureColumn(sheet, name);
    });
    var headers = headerList(sheet);
    var timestampCol = headers.indexOf("Timestamp") + 1;
    var slugCol = headers.indexOf("Slug") + 1;
    var titleCol = headers.indexOf("SeoTitle") + 1;
    var descriptionCol = headers.indexOf("SeoDescription") + 1;
    if (sheet.getMaxRows() > 0) sheet.getRange(1, timestampCol, sheet.getMaxRows(), 1).setNumberFormat("@");
    if (sheet.getLastRow() < 2) return;

    var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
    var usedSlugs = {};
    values.forEach(function (row) {
      var slug = slugify(row[slugCol - 1]);
      if (slug) usedSlugs[slug] = true;
    });

    values.forEach(function (row, offset) {
      var sheetRow = offset + 2;
      var type = String(row[headers.indexOf("Type")] || "").trim();
      var title = String(row[headers.indexOf("Title")] || "").trim();
      if (!type || !title) return;
      var currentSlug = slugify(row[slugCol - 1]);
      var rawStampValue = row[timestampCol - 1];
      var stamp = stampText(rawStampValue);
      var record = matchCatalog(type, title, stamp, currentSlug);
      var iso = toUtcIso(stamp);
      var storedAsDate = Object.prototype.toString.call(rawStampValue) === "[object Date]";
      if (iso && (storedAsDate || stamp !== iso)) {
        sheet.getRange(sheetRow, timestampCol).setNumberFormat("@");
        sheet.getRange(sheetRow, timestampCol).setValue(iso);
      }
      if (!currentSlug) {
        var nextSlug = record ? record.slug : uniqueSlug(usedSlugs, title, "");
        if (usedSlugs[nextSlug] && (!record || record.slug !== nextSlug)) nextSlug = uniqueSlug(usedSlugs, title, "");
        usedSlugs[nextSlug] = true;
        sheet.getRange(sheetRow, slugCol).setValue(nextSlug);
        currentSlug = nextSlug;
      }
      if (record && record.seoTitle && !String(row[titleCol - 1] || "").trim()) {
        sheet.getRange(sheetRow, titleCol).setValue(record.seoTitle);
      }
      if (record && record.seoDescription && !String(row[descriptionCol - 1] || "").trim()) {
        sheet.getRange(sheetRow, descriptionCol).setValue(record.seoDescription);
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function appendEntry(params) {
  var type = String(params.type || "").trim().toLowerCase();
  if (type !== "blog" && type !== "project") throw new Error("type must be blog or project");
  var title = String(params.title || "").trim();
  var content = String(params.content || "").trim();
  if (!title || !content) throw new Error("Title and content are required");

  repairContentSheet();
  var sheet = contentSheet();
  ["Type", "Title", "Author/Lead", "Content", "ImageURLs", "Timestamp", "Company", "Member1", "Member2", "Member3", "Slug", "SeoTitle", "SeoDescription"].forEach(function (name) {
    ensureColumn(sheet, name);
  });
  var headers = headerList(sheet);
  var timestampCol = headers.indexOf("Timestamp") + 1;
  sheet.getRange(1, timestampCol, sheet.getMaxRows(), 1).setNumberFormat("@");

  var existing = readRows();
  var used = {};
  existing.forEach(function (item) {
    var slug = slugify(item.Slug);
    if (slug) used[slug] = true;
  });

  var requestedSlug = slugify(params.slug || "");
  var slug = requestedSlug && !used[requestedSlug] ? requestedSlug : uniqueSlug(used, title, "");
  var timestamp = incomingTimestamp(params.timestamp || params.Timestamp);
  var seoTitle = String(params.SeoTitle || params.seoTitle || "").trim();
  var seoDescription = String(params.SeoDescription || params.seoDescription || "").trim();

  var row = headers.map(function () { return ""; });
  function put(name, value) {
    var index = headers.indexOf(name);
    if (index !== -1) row[index] = value;
  }
  put("Type", type);
  put("Title", title);
  put("Author/Lead", String(type === "project" ? (params.projectLead || params.author || "") : (params.author || "")).trim());
  put("Content", content);
  put("ImageURLs", String(params.imageURLs || "").trim());
  put("Company", String(params.company || "").trim());
  put("Member1", String(params.member1 || "").trim());
  put("Member2", String(params.member2 || "").trim());
  put("Member3", String(params.member3 || "").trim());
  put("Timestamp", timestamp);
  put("Slug", slug);
  put("SeoTitle", seoTitle);
  put("SeoDescription", seoDescription);

  sheet.appendRow(row);
  var written = sheet.getLastRow();
  sheet.getRange(written, timestampCol).setNumberFormat("@");
  sheet.getRange(written, timestampCol).setValue(timestamp);
  return { slug: slug, timestamp: timestamp };
}

function matchCatalog(type, title, stamp, slug) {
  if (slug) {
    for (var i = 0; i < CATALOG.length; i++) {
      if (CATALOG[i].type === type && CATALOG[i].slug === slug) return CATALOG[i];
    }
  }
  var dated = datedSlug(title, stamp);
  for (var j = 0; j < CATALOG.length; j++) {
    var record = CATALOG[j];
    if (record.type !== type) continue;
    if (record.raw.indexOf(stamp) !== -1) return record;
    if (dated && dated === datedSlug(record.title, record.raw[0])) return record;
    var iso = toUtcIso(record.raw[0]);
    if (dated && iso && dated === datedSlug(record.title, iso)) return record;
  }
  return null;
}

function incomingTimestamp(value) {
  var iso = parseIsoUtc(value);
  return iso || nowIso();
}

function nowIso() {
  return Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
}

function stampText(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, "UTC", "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
  }
  return String(value == null ? "" : value).trim();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function datedSlug(title, stampValue) {
  var titleSlug = slugify(title);
  var stamp = slugify(stampValue).slice(0, 32);
  if (!titleSlug || !stamp) return titleSlug;
  return titleSlug + "-" + stamp;
}

function uniqueSlug(used, title, requested) {
  var base = slugify(requested || title) || "item";
  if (!used[base]) return base;
  var n = 2;
  while (used[base + "-" + n]) n++;
  return base + "-" + n;
}

function parseIsoUtc(value) {
  var text = String(value || "").trim();
  var match = text.match(ISO_UTC);
  if (!match) return null;
  var year = Number(match[1]);
  var month = Number(match[2]);
  var day = Number(match[3]);
  var hasTime = match[4] != null;
  var hour = hasTime ? Number(match[4]) : 0;
  var minute = hasTime ? Number(match[5]) : 0;
  var second = hasTime ? Number(match[6]) : 0;
  var ms = match[7] ? Number(String(match[7]).padEnd(3, "0").slice(0, 3)) : 0;
  if (!isValidParts(year, month, day, hour, minute, second)) return null;
  return Utilities.formatDate(new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms)), "UTC", "yyyy-MM-dd'T'HH:mm:ss.000'Z'").replace(/\.000Z$/, ms ? "." + String(ms).padStart(3, "0") + "Z" : ".000Z");
}

function parseDayMonthYear(value) {
  var text = String(value || "").trim();
  var match = text.match(DAY_MONTH_YEAR);
  if (!match) return null;
  var day = Number(match[1]);
  var month = Number(match[2]);
  var year = Number(match[3]);
  var hour = match[4] == null ? 0 : Number(match[4]);
  var minute = match[5] == null ? 0 : Number(match[5]);
  var second = match[6] == null ? 0 : Number(match[6]);
  var meridian = String(match[7] || "").toLowerCase();
  if (month < 1 || month > 12 || day < 1 || day > 31 || minute > 59 || second > 59) return null;
  if (meridian) {
    if (hour < 1 || hour > 12) return null;
    hour = meridian === "am" ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
  } else if (hour > 23) return null;
  if (!isValidParts(year, month, day, hour, minute, second)) return null;
  var utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - KOLKATA_OFFSET_MINUTES * 60 * 1000;
  return Utilities.formatDate(new Date(utcMs), "UTC", "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
}

function isValidParts(year, month, day, hour, minute, second) {
  var probe = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day;
}

function toUtcIso(value) {
  var text = stampText(value);
  var iso = parseIsoUtc(text);
  if (iso) return DAY_MONTH_CORRECTIONS[iso] || iso;
  return parseDayMonthYear(text);
}
