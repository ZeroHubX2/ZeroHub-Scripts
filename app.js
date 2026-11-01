const SUPABASE_URL = "https://jfqiqcyzcsfjolkctgay.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcWlxY3l6Y3Nmam9sa2N0Z2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MzMxMDAsImV4cCI6MjEwODUwOTEwMH0.eka_J_CYoY3RilcVPPjuiTKWGSCGYdydD4AUJK2W6os";
const DATA_URL = `${SUPABASE_URL}/rest/v1/scripts?select=*&order=sort_order.asc,id.asc`;
const LOADER_URL = "https://zero-hub-api.onrender.com/api/script/ZeroHub";
const CONFIG_LINE = 'getgenv().ZeroHub = { AutoRejoin = "Y", AutoLoad = "Y" }';
const NEWS_URL = `${SUPABASE_URL}/rest/v1/announcements?select=*&order=pinned.desc,created_at.desc&limit=30`;
const LANG_KEY = "zh_lang";
const NEWS_SEEN_KEY = "zh_news_seen";
const NEWS_FRESH_MS = 3 * 24 * 3600 * 1000;
const NEWS_TAGS = ["new", "update", "fix", "event"];
const REFRESH_MS = 5 * 60 * 1000;
const SCAN_MS = 60 * 1000;
const SITE_UPDATED = "2026-11-01T08:23:00Z";
const FALLBACK_IMAGE = "img/zerohub.webp";
const IMAGE_HOSTS = ["i.postimg.cc", "tr.rbxcdn.com", "raw.githubusercontent.com", "i.imgur.com", "cdn.discordapp.com"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const I18N = {
  th: {
    title_page: "ZeroHub Scripts | สคริปต์ Roblox ฟรีจาก ZeroHub",
    side_aria: "เครื่องมือค้นหาและกรอง",
    search_ph: "พิมพ์ชื่อสคริปต์หรือเกม",
    search_aria: "ค้นหาสคริปต์",
    clear_aria: "ล้างคำค้นหา",
    filter_label: "กรองตามเกม",
    news_label: "ประกาศอัปเดต",
    news_dot: "มีประกาศใหม่",
    overview: "ภาพรวม",
    stat_scripts: "สคริปต์",
    stat_games: "เกมที่รองรับ",
    stat_updated: "แก้ไขล่าสุด",
    refresh: "ดึงข้อมูลใหม่",
    banner_sub: "โหลดเดอร์ตัวเดียว ครบทุกเกม",
    banner_p: "ไม่ต้องจำหลายลิงก์ กดคัดลอกครั้งเดียว ระบบเช็กเกมที่คุณเล่นแล้วเปิดสคริปต์ที่ใช่ให้เอง",
    quick_copy: "คัดลอกโหลดเดอร์",
    view_all: "ดูทั้งหมด",
    lv_ok: "ปกติ",
    lv_warn: "กำลังอัปเดต",
    lv_bad: "ล่ม",
    lv_loading: "รอสแกน",
    loader: "โหลดเดอร์",
    recent_scans: "ผลสแกน 20 รอบล่าสุด",
    scan_now: "สแกนเดี๋ยวนี้",
    arsenal: "คลังสคริปต์",
    close: "ปิด",
    works_with: "ใช้ได้กับเกม",
    plain: "แบบธรรมดา",
    config: "แบบคอนฟิก",
    y_on: '"Y" = เปิด',
    opt_rejoin: "เซิร์ฟรีหรือเน็ตหลุด สคริปต์จะพากลับเข้าเกมให้อัตโนมัติ",
    opt_load: "เซิร์ฟรี เน็ตหลุด หรือ AutoRejoin ย้ายเซิร์ฟ สคริปต์จะรันตัวเองใหม่ให้อัตโนมัติ",
    copy_config: "คัดลอกแบบคอนฟิก",
    copy_plain: "คัดลอกแบบธรรมดา",
    lightbox_aria: "รูปประกาศ",
    ok_head: "ทุกแมพพร้อมใช้งาน",
    ok_sub: "โหลดเดอร์และสคริปต์ทุกเกมทำงานปกติ คัดลอกไปใช้ได้เลย",
    ok_side: "ทุกแมพพร้อมใช้งาน",
    warn_head: "บางแมพกำลังอัปเดต",
    warn_sub: "บางเกมกำลังปรับปรุงหลังเกมอัปเดต ระหว่างนี้อาจใช้ได้ไม่ครบทุกฟีเจอร์",
    warn_side: "บางแมพกำลังอัปเดต",
    bad_head: "ตรวจพบระบบขัดข้อง",
    bad_sub: "มีบางส่วนใช้งานไม่ได้ตอนนี้ ทีมงานกำลังเร่งแก้ ติดตามใน Discord",
    bad_side: "มีระบบขัดข้อง",
    loading_head: "กำลังสแกนระบบ...",
    loading_sub: "ตรวจโหลดเดอร์และสคริปต์ทุกเกมแบบเรียลไทม์",
    loading_side: "กำลังสแกน...",
    tag_new: "ใหม่",
    tag_update: "อัปเดต",
    tag_fix: "แก้บั๊ก",
    tag_event: "กิจกรรม",
    pinned: "ปักหมุด",
    zoom: "ดูรูปใหญ่",
    just_now: "เมื่อสักครู่",
    min_ago: (n) => `${n} นาทีที่แล้ว`,
    hr_ago: (n) => `${n} ชม.ที่แล้ว`,
    day_ago: (n) => `${n} วันที่แล้ว`,
    scanning: "กำลังสแกน...",
    first_scan: "รอสแกนรอบแรก",
    last_scan: (c) => `สแกนล่าสุด ${c}`,
    scan_paused: "พักสแกน",
    next_scan: (m) => `รอบถัดไป ${m}`,
    status_set: (a) => `ตั้งสถานะเมื่อ ${a}`,
    found: (n, m) => `เจอ <b>${n}</b> จาก ${m}`,
    total: (n) => `ทั้งหมด <b>${n}</b> สคริปต์`,
    empty_b: "คลังยังว่างอยู่",
    empty_s: "เดี๋ยวทีมงานเติมสคริปต์ให้ แวะมาใหม่นะ",
    none_b: "หาไม่เจอเลย",
    none_s: 'ลองเปลี่ยนคำค้น หรือกด "ทุกเกม" เพื่อดูทั้งหมด',
    featured: "แนะนำ",
    untitled: "ไม่มีชื่อ",
    copy_now: "คัดลอกเลย",
    view_code: "ดูโค้ด",
    copy: "คัดลอก",
    code: "โค้ด",
    all_games: "ทุกเกม",
    today: (x) => `วันนี้ ${x}`,
    edited: (d) => `แก้ไขล่าสุด ${d}`,
    checked: (x) => `เช็กข้อมูลล่าสุด ${x}`,
    checking: "กำลังเช็ก...",
    check_paused: "พักเช็กอัตโนมัติ",
    next_check: (m) => `เช็กรอบถัดไปใน ${m}`,
    foot_refresh: "ข้อมูลรีเฟรชเองทุก 5 นาที",
    loading_data: "กำลังดึงข้อมูล...",
    no_code: "-- ยังไม่มีโค้ด",
    code_info: (n, m) => `${n} บรรทัด · ${m} ตัวอักษร`,
    anywhere: "ใช้ได้ทั่วไป",
    err_db: "ฐานข้อมูลยังไม่พร้อม",
    err_slow: "เซิร์ฟเวอร์ตอบช้าเกินไป",
    err_load: "ดึงข้อมูลไม่สำเร็จ",
    err_db_s: "ต้องสร้างตาราง scripts ใน Supabase ก่อน",
    err_net_s: "เช็กอินเทอร์เน็ตแล้วลองอีกครั้ง",
    retry: "ลองอีกครั้ง",
    offline: "เชื่อมต่อไม่ได้",
    refresh_fail: "รีเฟรชไม่สำเร็จ ยังแสดงข้อมูลชุดเดิมอยู่",
    no_script: "สคริปต์นี้ยังไม่มีโค้ด",
    copy_fail: "คัดลอกไม่ได้ ลองลากคลุมโค้ดแล้วคัดลอกเอง",
    copied_toast: (n) => `คัดลอก ${n} แล้ว วางใน executor ได้เลย`,
    copied: "คัดลอกแล้ว",
    refreshed: "ดึงข้อมูลล่าสุดแล้ว",
    wait_load: "รอข้อมูลโหลดเสร็จก่อนนะ",
    config_name: (n) => `${n} แบบคอนฟิก`,
    script: "สคริปต์",
  },
  en: {
    title_page: "ZeroHub Scripts | Free Roblox Scripts by ZeroHub",
    side_aria: "Search and filters",
    search_ph: "Search scripts or games",
    search_aria: "Search scripts",
    clear_aria: "Clear search",
    filter_label: "Filter by game",
    news_label: "Announcements",
    news_dot: "New announcement",
    overview: "Overview",
    stat_scripts: "Scripts",
    stat_games: "Supported games",
    stat_updated: "Last updated",
    refresh: "Refresh data",
    banner_sub: "One loader for every game",
    banner_p: "No more juggling links. Copy once, and it detects the game you're playing and runs the right script for you.",
    quick_copy: "Copy loader",
    view_all: "View all",
    lv_ok: "Online",
    lv_warn: "Updating",
    lv_bad: "Down",
    lv_loading: "Pending",
    loader: "Loader",
    recent_scans: "Last 20 scans",
    scan_now: "Scan now",
    arsenal: "Script library",
    close: "Close",
    works_with: "Works with",
    plain: "Standard",
    config: "Config",
    y_on: '"Y" = on',
    opt_rejoin: "If the server restarts or you disconnect, the script rejoins the game for you.",
    opt_load: "After a server restart, a disconnect, or an AutoRejoin server hop, the script runs itself again.",
    copy_config: "Copy config",
    copy_plain: "Copy standard",
    lightbox_aria: "Announcement image",
    ok_head: "All maps online",
    ok_sub: "The loader and every game script are working. Copy and go.",
    ok_side: "All maps online",
    warn_head: "Some maps are updating",
    warn_sub: "Some games are being patched after a game update. A few features may not work for now.",
    warn_side: "Some maps updating",
    bad_head: "Outage detected",
    bad_sub: "Some parts are down right now. The team is on it, follow Discord for updates.",
    bad_side: "Outage detected",
    loading_head: "Scanning systems...",
    loading_sub: "Checking the loader and every game script in real time",
    loading_side: "Scanning...",
    tag_new: "New",
    tag_update: "Update",
    tag_fix: "Fix",
    tag_event: "Event",
    pinned: "Pinned",
    zoom: "View larger",
    just_now: "just now",
    min_ago: (n) => `${n} min ago`,
    hr_ago: (n) => `${n} hr ago`,
    day_ago: (n) => `${n} ${n === 1 ? "day" : "days"} ago`,
    scanning: "Scanning...",
    first_scan: "Waiting for first scan",
    last_scan: (c) => `Last scan ${c}`,
    scan_paused: "Paused",
    next_scan: (m) => `Next in ${m}`,
    status_set: (a) => `Status set ${a}`,
    found: (n, m) => `<b>${n}</b> of ${m}`,
    total: (n) => `<b>${n}</b> scripts`,
    empty_b: "The library is empty",
    empty_s: "Scripts are on the way. Check back soon.",
    none_b: "Nothing found",
    none_s: 'Try another search, or pick "All games" to see everything.',
    featured: "Featured",
    untitled: "Untitled",
    copy_now: "Copy now",
    view_code: "View code",
    copy: "Copy",
    code: "Code",
    all_games: "All games",
    today: (x) => `Today ${x}`,
    edited: (d) => `Last updated ${d}`,
    checked: (x) => `Last checked ${x}`,
    checking: "Checking...",
    check_paused: "Auto-check paused",
    next_check: (m) => `Next check in ${m}`,
    foot_refresh: "Data refreshes every 5 minutes",
    loading_data: "Loading...",
    no_code: "-- No code yet",
    code_info: (n, m) => `${n} ${n === "1" ? "line" : "lines"} · ${m} chars`,
    anywhere: "Works anywhere",
    err_db: "Database not ready",
    err_slow: "The server took too long",
    err_load: "Couldn't load data",
    err_db_s: "The scripts table needs to be created in Supabase first",
    err_net_s: "Check your connection and try again",
    retry: "Try again",
    offline: "Can't connect",
    refresh_fail: "Refresh failed. Still showing the last data.",
    no_script: "This script has no code yet",
    copy_fail: "Couldn't copy. Select the code and copy it manually.",
    copied_toast: (n) => `Copied ${n}. Paste it into your executor.`,
    copied: "Copied",
    refreshed: "Data refreshed",
    wait_load: "Hang on, still loading",
    config_name: (n) => `${n} (config)`,
    script: "script",
  },
};

function initLang() {
  const q = new URLSearchParams(location.search).get("lang");
  if (I18N[q]) {
    try {
      localStorage.setItem(LANG_KEY, q);
    } catch {}
    return q;
  }
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (I18N[saved]) return saved;
  } catch {}
  const langs = navigator.languages || [navigator.language || ""];
  let zone = "";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {}
  return langs.some((l) => /^th/i.test(l)) || zone === "Asia/Bangkok" ? "th" : "en";
}

let lang = initLang();
const t = (key, ...args) => {
  const v = I18N[lang][key] ?? I18N.th[key] ?? key;
  return typeof v === "function" ? v(...args) : v;
};
const loc = () => (lang === "en" ? "en-US" : "th-TH");
const txt = (obj, field) => (lang === "en" && obj && obj[`${field}_en`]) || (obj && obj[field]) || "";

const $ = (id) => document.getElementById(id);
const ui = {
  search: $("searchInput"), clear: $("clearSearch"), mapFilter: $("mapFilter"), refresh: $("refreshButton"),
  scriptStat: $("scriptStat"), mapStat: $("mapStat"), updatedStat: $("updatedStat"), results: $("resultsText"),
  featured: $("featured"), rows: $("rows"), lastUpdate: $("lastUpdateText"), quickCopy: $("quickCopy"),
  brand: $("brandHome"), backdrop: $("backdrop"), drawer: $("drawer"), dImage: $("drawerImage"),
  dTitle: $("drawerTitle"), dDesc: $("drawerDesc"), dMaps: $("drawerMaps"), code: $("codeBlock"),
  codeInfo: $("codeInfo"), dOpts: $("drawerOpts"), configBlock: $("configBlock"), copyConfig: $("copyConfig"), copy: $("copyButton"), close: $("closeDrawer"), toast: $("toast"),
  sbHero: $("sbHero"), sbTitle: $("statusTitle"), sbSub: $("sbSub"), sbList: $("sbList"),
  sbTimer: $("sbTimer"), scan: $("scanButton"),
  sideStatus: $("sideStatus"), sideStatusText: $("sideStatusText"), dStatus: $("drawerStatus"),
  news: $("news"), newsList: $("newsList"), sideNews: $("sideNews"), sideNewsDot: $("sideNewsDot"),
  lightbox: $("lightbox"), lightboxImg: $("lightboxImg"), langSwitch: $("langSwitch"),
};

let items = [];
let activeMap = "";
let openItem = null;
let loading = false;
let lastLoad = 0;
let nextLoadAt = 0;
let editedLabel = "";
let scriptsLatest = "";
let lastFocus = null;
let toastTimer;
const hasStatusUI = !!(ui.sbHero && ui.scan && ui.sideStatus && ui.dStatus);
let scanning = false;
let lastScan = 0;
let nextScanAt = 0;
const checks = new Map();
let news = [];
let lightboxFocus = null;

const LEVEL = {
  ok: { pill: "ONLINE", icon: "fa-shield-halved" },
  warn: { pill: "UPDATING", icon: "fa-screwdriver-wrench" },
  bad: { pill: "DOWN", icon: "fa-triangle-exclamation" },
  loading: { pill: "SCANNING", icon: "fa-satellite-dish" },
};
const MANUAL = { working: "ok", updating: "warn", down: "bad" };

function timeoutSignal(ms) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") return AbortSignal.timeout(ms);
  if (typeof AbortController === "undefined") return undefined;
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);
}

function safeImage(value) {
  const v = String(value || "").trim();
  if (/^img\/[\w.-]+$/.test(v)) return v;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && IMAGE_HOSTS.includes(u.hostname) ? u.href : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

function safeGameURL(value) {
  try {
    const u = new URL(String(value || ""));
    const h = u.hostname.toLowerCase();
    return u.protocol === "https:" && (h === "roblox.com" || h.endsWith(".roblox.com")) ? u.href : "";
  } catch {
    return "";
  }
}

const gamesOf = (it) => (Array.isArray(it.maps) ? it.maps.filter((m) => m && typeof m.name === "string" && m.name.trim()) : []);
const fmt = (n) => Number(n || 0).toLocaleString(loc());
const keyOf = (name) => name.trim().toLowerCase();
const byId = (id) => items.find((x) => Number(x.id) === Number(id));

function toast(message, ok = false) {
  ui.toast.className = `toast show${ok ? " ok" : ""}`;
  const i = document.createElement("i");
  i.className = ok ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation";
  ui.toast.replaceChildren(i, document.createTextNode(message));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 2300);
}

async function copyText(text) {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error("no clipboard");
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    t.setAttribute("readonly", "");
    t.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand("copy");
    t.remove();
    return ok;
  }
}

function configOf(it) {
  const code = String((it && it.script) || "");
  return code.includes(LOADER_URL) && !code.includes("getgenv().ZeroHub") ? `${CONFIG_LINE}\n${code}` : "";
}

async function copyScript(it, btn) {
  const code = it && String(it.script || "");
  if (!code) return toast(t("no_script"));
  if (!(await copyText(code))) return toast(t("copy_fail"));
  toast(t("copied_toast", it.name || t("script")), true);
  if (!btn) return;
  const icon = btn.querySelector("i");
  const label = btn.querySelector("span");
  const prev = [icon.className, label.textContent];
  btn.classList.add("done");
  icon.className = "fa-solid fa-check";
  label.textContent = t("copied");
  setTimeout(() => {
    btn.classList.remove("done");
    [icon.className, label.textContent] = prev;
  }, 1800);
}

function matches(it) {
  if (activeMap && !gamesOf(it).some((m) => keyOf(m.name) === activeMap)) return false;
  const q = ui.search.value.trim().toLocaleLowerCase("th-TH");
  if (!q) return true;
  return [it.name, it.description, it.description_en, gamesOf(it).map((m) => m.name).join(" ")].join(" ").toLocaleLowerCase("th-TH").includes(q);
}

function chipsHTML(it, limit = 4) {
  const games = gamesOf(it);
  const shown = games.slice(0, limit).map((m) => `<span class="chip"><i class="fa-solid fa-play"></i>${esc(m.name)}</span>`);
  if (games.length > limit) shown.push(`<span class="chip">+${games.length - limit}</span>`);
  return shown.length ? `<div class="chips">${shown.join("")}</div>` : "";
}

function renderFilter() {
  const counts = new Map();
  items.forEach((it) =>
    gamesOf(it).forEach((m) => {
      const k = keyOf(m.name);
      const prev = counts.get(k);
      counts.set(k, { name: prev ? prev.name : m.name.trim(), n: (prev ? prev.n : 0) + 1 });
    })
  );
  if (activeMap && !counts.has(activeMap)) activeMap = "";
  const btn = (key, label, n) =>
    `<button type="button" class="mf${activeMap === key ? " on" : ""}" role="tab" aria-selected="${activeMap === key}" data-map="${esc(key)}"><span>${esc(label)}</span><span class="n">${fmt(n)}</span></button>`;
  ui.mapFilter.innerHTML = btn("", t("all_games"), items.length) + [...counts].map(([k, v]) => btn(k, v.name, v.n)).join("");
  ui.mapStat.textContent = fmt(counts.size);
}

function safeCheckURL(value) {
  try {
    const u = new URL(String(value || ""));
    return u.protocol === "https:" && u.hostname === "raw.githubusercontent.com" ? u.href : "";
  } catch {
    return "";
  }
}

function liveLevel(url, slowMs) {
  const c = checks.get(url);
  if (!c) return "loading";
  if (!c.last.ok) return "bad";
  return c.last.ms > slowMs ? "warn" : "ok";
}

function components() {
  const list = [{ key: LOADER_URL, item: null, level: liveLevel(LOADER_URL, 6000) }];
  items.forEach((it) => {
    const url = safeCheckURL(it.check_url);
    if (!url) return;
    const manual = MANUAL[it.status] || "ok";
    const live = liveLevel(url, 8000);
    list.push({ key: url, item: it, level: manual !== "ok" ? manual : live === "warn" ? "ok" : live });
  });
  return list;
}

function overallLevel(comps = components()) {
  const levels = comps.map((c) => c.level);
  if (levels.includes("bad")) return "bad";
  if (levels.includes("warn")) return "warn";
  if (levels.includes("loading")) return "loading";
  return "ok";
}

function levelOf(it) {
  const manual = MANUAL[it.status] || "ok";
  if (manual !== "ok") return manual;
  const url = safeCheckURL(it.check_url);
  const live = url ? liveLevel(url, 8000) : liveLevel(LOADER_URL, 6000);
  return live === "warn" ? "ok" : live;
}

const pill = (level) => `<span class="pill" data-level="${level}">${LEVEL[level].pill}</span>`;

function ago(ts) {
  const s = Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 1000));
  if (!isFinite(s)) return "-";
  if (s < 60) return t("just_now");
  if (s < 3600) return t("min_ago", Math.floor(s / 60));
  if (s < 86400) return t("hr_ago", Math.floor(s / 3600));
  return t("day_ago", Math.floor(s / 86400));
}

const clock = (ts) => new Date(ts).toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const BARS = 20;

function svcHTML(c) {
  const ch = checks.get(c.key);
  const hist = ch ? ch.hist.slice(-BARS) : [];
  const slow = c.item ? 8000 : 6000;
  const bars = Array.from({ length: BARS }, (_, i) => {
    const h = hist[i - (BARS - hist.length)];
    return `<i data-r="${h ? (!h.ok ? "bad" : h.ms > slow ? "warn" : "ok") : "none"}"></i>`;
  }).join("");
  const name = c.item ? c.item.name || t("untitled") : t("loader");
  const img = c.item ? safeImage(c.item.image) : "img/logo-sm.webp";
  const ms = ch && ch.last.ok ? `${fmt(ch.last.ms)} ms` : "--";
  return `<li class="svc" data-level="${c.level}">
    <img src="${esc(img)}" alt="">
    <div class="svc-main">
      <div class="svc-top"><b>${esc(name)}</b><span class="svc-lv">${esc(t(`lv_${c.level}`))}</span></div>
      <div class="svc-bot"><span class="svc-bars" title="${esc(t("recent_scans"))}">${bars}</span><span class="svc-ms">${ms}</span></div>
    </div>
  </li>`;
}

function renderStatus() {
  if (!hasStatusUI) return;
  const comps = components();
  const lv = items.length ? overallLevel(comps) : "loading";
  ui.sbHero.dataset.level = lv;
  ui.sideStatus.dataset.level = lv;
  ui.sbTitle.textContent = t(`${lv}_head`);
  ui.sbSub.textContent = t(`${lv}_sub`);
  ui.sideStatusText.textContent = t(`${lv}_side`);
  if (ui.sbList) ui.sbList.innerHTML = items.length ? comps.map(svcHTML).join("") : "";
  renderScanTimer();
}

function renderScanTimer() {
  if (!hasStatusUI) return;
  if (scanning) {
    ui.sbTimer.textContent = t("scanning");
    return;
  }
  if (!lastScan) {
    ui.sbTimer.textContent = t("first_scan");
    return;
  }
  const left = Math.max(0, Math.ceil((nextScanAt - Date.now()) / 1000));
  ui.sbTimer.textContent = `${t("last_scan", clock(lastScan))} · ${document.hidden ? t("scan_paused") : t("next_scan", `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`)}`;
}

function renderDrawerStatus(it) {
  if (!hasStatusUI) return;
  const lv = levelOf(it);
  const when = it.status && it.status !== "working" && it.status_updated_at ? t("status_set", ago(it.status_updated_at)) : lastScan ? t("last_scan", clock(lastScan)) : "";
  ui.dStatus.innerHTML = `${pill(lv)}<span>${esc(when)}</span>${it.status_note ? `<p class="sc-note">${esc(it.status_note)}</p>` : ""}`;
  ui.dStatus.dataset.level = lv;
}

async function probe(url, opts) {
  const t = performance.now();
  try {
    const r = await fetch(url, { ...opts, cache: "no-store", signal: timeoutSignal(25000) });
    return { ok: r.type === "opaque" || r.ok, ms: Math.round(performance.now() - t), size: Number(r.headers.get("content-length")) || 0, at: Date.now() };
  } catch {
    return { ok: false, ms: Math.round(performance.now() - t), size: 0, at: Date.now() };
  }
}

function record(url, res) {
  const c = checks.get(url) || { hist: [] };
  c.hist.push(res);
  if (c.hist.length > 24) c.hist.shift();
  c.last = res;
  checks.set(url, c);
}

async function scan() {
  if (!hasStatusUI || scanning || !items.length) return;
  scanning = true;
  nextScanAt = Date.now() + SCAN_MS;
  ui.scan.disabled = true;
  ui.scan.classList.add("spin");
  renderScanTimer();
  const urls = [...new Set(items.map((it) => safeCheckURL(it.check_url)).filter(Boolean))];
  await Promise.all([
    probe(LOADER_URL, { mode: "no-cors" }).then((r) => record(LOADER_URL, r)),
    ...urls.map((u) => probe(u, { method: "HEAD" }).then((r) => record(u, r))),
  ]);
  lastScan = Date.now();
  scanning = false;
  ui.scan.disabled = false;
  ui.scan.classList.remove("spin");
  renderStatus();
  renderList();
  if (openItem) renderDrawerStatus(openItem);
}

function renderNews() {
  if (!ui.news || !ui.newsList) return;
  ui.news.hidden = !news.length;
  if (ui.sideNews) ui.sideNews.hidden = !news.length;
  if (!news.length) return;
  renderNewsDot();
  const latest = newestNews();
  ui.newsList.innerHTML = news
    .map((n) => {
      const tag = NEWS_TAGS.includes(n.tag) ? n.tag : "update";
      const d = new Date(n.created_at);
      const isFresh = d.getTime() === latest && Date.now() - latest < NEWS_FRESH_MS;
      const img = n.image ? safeImage(n.image) : "";
      return `<article class="news-item${n.pinned ? " pinned" : ""}${img ? " has-img" : ""}" data-tag="${tag}">
        <div class="ni-date"><b>${d.getDate()}</b><small>${esc(d.toLocaleDateString(loc(), { month: "short" }))}</small></div>
        <div class="ni-body">
          <div class="ni-top"><span class="ni-tag">${esc(t(`tag_${tag}`))}</span>${n.pinned ? `<span class="ni-pin"><i class="fa-solid fa-thumbtack"></i>${esc(t("pinned"))}</span>` : ""}${isFresh ? '<span class="ni-new">NEW</span>' : ""}<span class="ni-time">${esc(ago(n.created_at))}</span></div>
          <h3>${esc(txt(n, "title"))}</h3>
          ${txt(n, "body") ? `<p>${esc(txt(n, "body"))}</p>` : ""}
        </div>
        ${img ? `<button class="ni-img" type="button" data-zoom="${esc(img)}" aria-label="${esc(t("zoom"))}"><img src="${esc(img)}" alt="" loading="lazy"><i class="fa-solid fa-expand"></i></button>` : ""}
      </article>`;
    })
    .join("");
}

function newestNews() {
  return news.reduce((m, n) => Math.max(m, new Date(n.created_at).getTime() || 0), 0);
}

function seenNews() {
  try {
    return Number(localStorage.getItem(NEWS_SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

function renderNewsDot() {
  if (!ui.sideNewsDot) return;
  const latest = newestNews();
  const seen = seenNews();
  ui.sideNewsDot.hidden = !latest || latest <= seen || (!seen && Date.now() - latest > NEWS_FRESH_MS);
}

function markNewsSeen() {
  const latest = newestNews();
  if (!latest || latest <= seenNews()) return;
  try {
    localStorage.setItem(NEWS_SEEN_KEY, String(latest));
  } catch {}
  renderNewsDot();
}

function openLightbox(src, from) {
  if (!ui.lightbox) return;
  lightboxFocus = from || null;
  ui.lightboxImg.src = src;
  ui.lightbox.hidden = false;
  ui.lightbox.focus();
}

function closeLightbox() {
  if (!ui.lightbox || ui.lightbox.hidden) return false;
  ui.lightbox.hidden = true;
  ui.lightboxImg.removeAttribute("src");
  if (lightboxFocus) lightboxFocus.focus();
  return true;
}

async function loadNews() {
  try {
    const r = await fetch(NEWS_URL, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      cache: "no-store",
      signal: timeoutSignal(15000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const body = await r.json();
    news = Array.isArray(body) ? body.filter((n) => n && n.title && n.created_at) : [];
  } catch {
    if (!news.length) news = [];
  }
  if (items.length) refreshMeta();
  renderNews();
}

function renderList() {
  ui.clear.hidden = !ui.search.value;
  const list = items.filter(matches);
  const filtering = !!(activeMap || ui.search.value.trim());
  ui.results.innerHTML = filtering ? t("found", fmt(list.length), fmt(items.length)) : t("total", fmt(items.length));

  if (!items.length) {
    ui.featured.innerHTML = "";
    ui.rows.innerHTML = `<div class="state"><i class="fa-solid fa-box-open"></i><b>${esc(t("empty_b"))}</b><span>${esc(t("empty_s"))}</span></div>`;
    return;
  }
  if (!list.length) {
    ui.featured.innerHTML = "";
    ui.rows.innerHTML = `<div class="state"><i class="fa-solid fa-ghost"></i><b>${esc(t("none_b"))}</b><span>${esc(t("none_s"))}</span></div>`;
    return;
  }

  const [top, ...rest] = filtering ? [null, ...list] : list;
  ui.featured.innerHTML = top
    ? `<article class="feature" data-open="${Number(top.id)}">
        <div class="feature-img"><span class="ribbon">${esc(t("featured"))}</span><img src="${esc(safeImage(top.image))}" alt=""></div>
        <div class="feature-info">
          <h3>${esc(top.name || t("untitled"))}${pill(levelOf(top))}</h3>
          <p>${esc(txt(top, "description"))}</p>
          ${chipsHTML(top, 6)}
          <div class="feature-actions">
            <button class="z-btn z-red z-lg" type="button" data-copy="${Number(top.id)}"><i class="fa-solid fa-bolt"></i><span>${esc(t("copy_now"))}</span></button>
            <button class="z-btn z-lg" type="button" data-open="${Number(top.id)}"><i class="fa-solid fa-terminal"></i><span>${esc(t("view_code"))}</span></button>
          </div>
        </div>
      </article>`
    : "";
  ui.rows.innerHTML = rest
    .map(
      (it) => `<article class="row" data-open="${Number(it.id)}">
        <img class="row-icon" src="${esc(safeImage(it.image))}" alt="" loading="lazy">
        <div class="row-info"><h3>${esc(it.name || t("untitled"))}${pill(levelOf(it))}</h3><p>${esc(txt(it, "description"))}</p>${chipsHTML(it)}</div>
        <div class="row-actions">
          <button class="z-btn z-red" type="button" data-copy="${Number(it.id)}"><i class="fa-regular fa-copy"></i><span>${esc(t("copy"))}</span></button>
          <button class="z-btn" type="button" data-open="${Number(it.id)}" aria-label="${esc(t("view_code"))} ${esc(it.name || "")}"><i class="fa-solid fa-terminal"></i><span>${esc(t("code"))}</span></button>
        </div>
      </article>`
    )
    .join("");
  document.querySelectorAll(".row-icon, .feature-img img").forEach((img) => img.addEventListener("error", () => (img.src = FALLBACK_IMAGE), { once: true }));
}

function refreshMeta() {
  const t = Math.max(new Date(scriptsLatest || 0).getTime() || 0, new Date(SITE_UPDATED).getTime(), newestNews());
  renderMeta(new Date(t).toISOString());
}

function renderMeta(updatedAt) {
  ui.scriptStat.textContent = fmt(items.length);
  if (!updatedAt) return;
  const d = new Date(updatedAt);
  ui.updatedStat.textContent =
    d.toDateString() === new Date().toDateString()
      ? t("today", d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }))
      : d.toLocaleDateString(loc(), { day: "numeric", month: "short" });
  editedLabel = t("edited", d.toLocaleString(loc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }));
  renderClock();
}

function renderClock() {
  if (!editedLabel) {
    ui.lastUpdate.textContent = t("foot_refresh");
    return;
  }
  const parts = [editedLabel];
  if (lastLoad) parts.push(t("checked", clock(lastLoad)));
  if (loading) parts.push(t("checking"));
  else if (document.hidden) parts.push(t("check_paused"));
  else {
    const left = Math.max(0, Math.ceil((nextLoadAt - Date.now()) / 1000));
    parts.push(t("next_check", `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`));
  }
  ui.lastUpdate.textContent = parts.join(" · ");
}

function skeleton() {
  ui.featured.innerHTML = "";
  ui.rows.innerHTML = Array.from({ length: 4 }, () =>
    '<div class="row sk"><div class="row-icon"></div><div class="row-info"><div class="bar" style="width:45%"></div><div class="bar" style="width:80%"></div></div></div>'
  ).join("");
  ui.results.textContent = t("loading_data");
}

function fillDrawer(it) {
  renderDrawerStatus(it);
  ui.dTitle.textContent = it.name || t("untitled");
  ui.dDesc.textContent = txt(it, "description");
  ui.dDesc.hidden = !ui.dDesc.textContent;
  ui.dImage.src = safeImage(it.image);
  ui.dImage.onerror = () => (ui.dImage.src = FALLBACK_IMAGE);
  const code = String(it.script || "");
  const lines = code ? code.split("\n") : [t("no_code")];
  ui.code.replaceChildren(
    ...lines.map((line) => {
      const s = document.createElement("span");
      s.className = "ln";
      s.textContent = line || " ";
      return s;
    })
  );
  ui.codeInfo.textContent = t("code_info", fmt(lines.length), fmt(code.length));
  if (ui.dOpts) {
    const config = configOf(it);
    ui.dOpts.hidden = !config;
    if (config) ui.configBlock.replaceChildren(...config.split("\n").map((line) => Object.assign(document.createElement("span"), { className: "ln", textContent: line })));
  }
  const games = gamesOf(it);
  ui.dMaps.innerHTML = games.length
    ? games
        .map((m) => {
          const url = safeGameURL(m.url);
          const inner = `<i class="fa-solid fa-play"></i><span>${esc(m.name)}</span>${url ? '<i class="fa-solid fa-arrow-up-right-from-square ext"></i>' : ""}`;
          return url ? `<a class="game-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<div class="game-link">${inner}</div>`;
        })
        .join("")
    : `<div class="game-link"><i class="fa-solid fa-globe"></i><span>${esc(t("anywhere"))}</span></div>`;
}

function openDrawer(id, push) {
  const it = byId(id);
  if (!it) return false;
  if (!openItem) lastFocus = document.activeElement;
  openItem = it;
  fillDrawer(it);
  if (push) history.pushState({ script: it.id }, "", `?script=${it.id}`);
  document.title = `${it.name || t("script")} | ZeroHub Scripts`;
  ui.backdrop.hidden = false;
  ui.drawer.hidden = false;
  document.body.classList.add("lock");
  ui.drawer.querySelector(".drawer-body").scrollTop = 0;
  ui.close.focus({ preventScroll: true });
  return true;
}

function hideDrawer() {
  openItem = null;
  ui.drawer.hidden = true;
  ui.backdrop.hidden = true;
  document.body.classList.remove("lock");
  document.title = t("title_page");
  if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
}

function closeDrawer() {
  if (history.state && history.state.script != null) return history.back();
  history.replaceState({}, "", location.pathname + location.hash);
  hideDrawer();
}

function syncFromURL() {
  const id = new URLSearchParams(location.search).get("script");
  if (id && openDrawer(id, false)) return;
  if (id) history.replaceState({}, "", location.pathname + location.hash);
  if (openItem) hideDrawer();
}

async function load(showSkeleton) {
  if (loading) return;
  loading = true;
  nextLoadAt = Date.now() + REFRESH_MS;
  renderClock();
  if (showSkeleton) skeleton();
  ui.refresh.disabled = true;
  ui.refresh.classList.add("spin");
  try {
    const r = await fetch(DATA_URL, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      cache: "no-store",
      signal: timeoutSignal(15000),
    });
    const body = await r.json().catch(() => null);
    if (!r.ok) {
      const err = new Error((body && body.message) || `HTTP ${r.status}`);
      err.code = body && body.code;
      throw err;
    }
    items = Array.isArray(body) ? body : [];
    lastLoad = Date.now();
    const dbLatest = items.reduce((m, it) => {
      const t = [it.updated_at, it.status_updated_at].filter(Boolean).sort().pop() || "";
      return t > m ? t : m;
    }, "");
    scriptsLatest = dbLatest;
    refreshMeta();
    renderFilter();
    renderList();
    renderStatus();
    loadNews();
    if (!lastScan && !scanning) scan();
    if (openItem) {
      const fresh = byId(openItem.id);
      if (fresh) {
        openItem = fresh;
        fillDrawer(fresh);
      } else closeDrawer();
    } else syncFromURL();
    return true;
  } catch (err) {
    if (!items.length) {
      const missing = err.code === "PGRST205" || err.code === "42P01";
      ui.featured.innerHTML = "";
      ui.rows.innerHTML = `<div class="state"><i class="fa-solid fa-plug-circle-xmark"></i><b>${
        missing ? t("err_db") : err.name === "TimeoutError" ? t("err_slow") : t("err_load")
      }</b><span>${missing ? t("err_db_s") : t("err_net_s")}</span><button class="z-btn z-red" type="button" data-retry><i class="fa-solid fa-arrows-rotate"></i><span>${t("retry")}</span></button></div>`;
      ui.results.textContent = t("offline");
    } else {
      toast(t("refresh_fail"));
    }
    return false;
  } finally {
    loading = false;
    ui.refresh.disabled = false;
    ui.refresh.classList.remove("spin");
    renderClock();
  }
}

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  document.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  if (!openItem) document.title = t("title_page");
}

function setLang(next) {
  if (!I18N[next] || next === lang) return;
  lang = next;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
  applyLang();
  renderFilter();
  if (items.length) {
    renderList();
    refreshMeta();
  }
  renderStatus();
  renderNews();
  renderClock();
  if (openItem) fillDrawer(openItem);
}

function setupEmbers() {
  const canvas = $("embers");
  const ctx = canvas.getContext("2d");
  let w, h, parts;
  const spawn = (any) => ({
    x: Math.random() * w, y: any ? Math.random() * h : h + 10, r: Math.random() * 1.8 + 0.5,
    vy: Math.random() * 0.45 + 0.15, vx: (Math.random() - 0.5) * 0.25, a: Math.random() * 0.5 + 0.2,
    white: Math.random() < 0.15, t: Math.random() * 100,
  });
  const resize = () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    parts = Array.from({ length: Math.min(45, Math.floor(w / 26)) }, () => spawn(true));
  };
  const tick = () => {
    if (!document.hidden) {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.t += 0.02;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.t) * 0.2;
        if (p.y < -10) parts[i] = spawn(false);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.white ? `rgba(255,255,255,${p.a})` : `rgba(255,40,40,${p.a})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.white ? "#fff" : "#ff1e1e";
        ctx.fill();
      });
    }
    requestAnimationFrame(tick);
  };
  addEventListener("resize", resize);
  resize();
  if (!reduceMotion) tick();
}

document.querySelector(".arsenal").addEventListener("click", (e) => {
  if (e.target.closest("[data-retry]")) return load(true);
  const copyBtn = e.target.closest("[data-copy]");
  if (copyBtn) return copyScript(byId(copyBtn.dataset.copy), copyBtn);
  const opener = e.target.closest("[data-open]");
  if (opener) openDrawer(opener.dataset.open, true);
});
ui.mapFilter.addEventListener("click", (e) => {
  const b = e.target.closest(".mf");
  if (!b) return;
  activeMap = b.dataset.map;
  renderFilter();
  renderList();
});
ui.search.addEventListener("input", renderList);
ui.clear.addEventListener("click", () => {
  ui.search.value = "";
  renderList();
  ui.search.focus();
});
ui.refresh.addEventListener("click", async () => {
  if (await load(false)) toast(t("refreshed"), true);
});
ui.quickCopy.addEventListener("click", () => {
  if (!items.length) return toast(t("wait_load"));
  copyScript(items[0], ui.quickCopy);
});
ui.copy.addEventListener("click", () => copyScript(openItem, ui.copy));
if (ui.copyConfig) ui.copyConfig.addEventListener("click", () => openItem && copyScript({ name: t("config_name", openItem.name), script: configOf(openItem) }, ui.copyConfig));
ui.close.addEventListener("click", closeDrawer);
ui.backdrop.addEventListener("click", closeDrawer);
ui.brand.addEventListener("click", (e) => {
  e.preventDefault();
  if (openItem) closeDrawer();
  activeMap = "";
  ui.search.value = "";
  renderFilter();
  renderList();
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});
addEventListener("popstate", syncFromURL);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && closeLightbox()) return;
  if (e.key === "Escape" && openItem) return closeDrawer();
  if (e.key === "Tab" && openItem) {
    const f = [...ui.drawer.querySelectorAll("button, a[href]")].filter((x) => x.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
      e.preventDefault();
      f[0].focus();
    }
  }
  if (e.key === "/" && !openItem && document.activeElement !== ui.search) {
    e.preventDefault();
    ui.search.focus();
  }
});
if (hasStatusUI) ui.scan.addEventListener("click", scan);
if (ui.newsList) {
  ui.newsList.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (z) openLightbox(z.dataset.zoom, z);
  });
}
if (ui.lightbox) ui.lightbox.addEventListener("click", closeLightbox);
if (ui.sideNews) ui.sideNews.addEventListener("click", markNewsSeen);
if (ui.news && "IntersectionObserver" in window) {
  new IntersectionObserver((entries) => {
    if (entries.some((x) => x.isIntersecting)) markNewsSeen();
  }, { threshold: 0.35 }).observe(ui.news);
}

if (ui.langSwitch) {
  ui.langSwitch.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]");
    if (b) setLang(b.dataset.lang);
  });
}

applyLang();
renderStatus();
renderClock();
setupEmbers();
load(true);
setInterval(() => {
  if (!document.hidden && !loading && Date.now() >= nextLoadAt) load(false);
  else renderClock();
  if (!document.hidden && !scanning && lastScan && Date.now() >= nextScanAt) scan();
  else renderScanTimer();
}, 1000);
