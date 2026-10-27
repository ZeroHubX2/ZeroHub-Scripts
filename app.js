const SUPABASE_URL = "https://jfqiqcyzcsfjolkctgay.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcWlxY3l6Y3Nmam9sa2N0Z2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MzMxMDAsImV4cCI6MjEwODUwOTEwMH0.eka_J_CYoY3RilcVPPjuiTKWGSCGYdydD4AUJK2W6os";
const DATA_URL = `${SUPABASE_URL}/rest/v1/scripts?select=id,name,description,image,script,maps,updated_at&order=sort_order.asc,id.asc`;
const REFRESH_MS = 5 * 60 * 1000;
const SITE_UPDATED = "2026-10-27T12:14:00Z";
const FALLBACK_IMAGE = "img/zerohub.webp";
const IMAGE_HOSTS = ["i.postimg.cc", "tr.rbxcdn.com", "raw.githubusercontent.com", "i.imgur.com", "cdn.discordapp.com"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (id) => document.getElementById(id);
const ui = {
  search: $("searchInput"), clear: $("clearSearch"), mapFilter: $("mapFilter"), refresh: $("refreshButton"),
  scriptStat: $("scriptStat"), mapStat: $("mapStat"), updatedStat: $("updatedStat"), results: $("resultsText"),
  featured: $("featured"), rows: $("rows"), lastUpdate: $("lastUpdateText"), quickCopy: $("quickCopy"),
  brand: $("brandHome"), backdrop: $("backdrop"), drawer: $("drawer"), dImage: $("drawerImage"),
  dTitle: $("drawerTitle"), dDesc: $("drawerDesc"), dMaps: $("drawerMaps"), code: $("codeBlock"),
  codeInfo: $("codeInfo"), copy: $("copyButton"), close: $("closeDrawer"), toast: $("toast"),
};

let items = [];
let activeMap = "";
let openItem = null;
let loading = false;
let lastLoad = 0;
let nextLoadAt = 0;
let editedLabel = "";
let lastFocus = null;
let toastTimer;

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
const fmt = (n) => Number(n || 0).toLocaleString("th-TH");
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

async function copyScript(it, btn) {
  const code = it && String(it.script || "");
  if (!code) return toast("สคริปต์นี้ยังไม่มีโค้ด");
  if (!(await copyText(code))) return toast("คัดลอกไม่ได้ ลองลากคลุมโค้ดแล้วคัดลอกเอง");
  toast(`คัดลอก ${it.name || "สคริปต์"} แล้ว วางใน executor ได้เลย`, true);
  if (!btn) return;
  const icon = btn.querySelector("i");
  const label = btn.querySelector("span");
  const prev = [icon.className, label.textContent];
  btn.classList.add("done");
  icon.className = "fa-solid fa-check";
  label.textContent = "คัดลอกแล้ว";
  setTimeout(() => {
    btn.classList.remove("done");
    [icon.className, label.textContent] = prev;
  }, 1800);
}

function matches(it) {
  if (activeMap && !gamesOf(it).some((m) => keyOf(m.name) === activeMap)) return false;
  const q = ui.search.value.trim().toLocaleLowerCase("th-TH");
  if (!q) return true;
  return [it.name, it.description, gamesOf(it).map((m) => m.name).join(" ")].join(" ").toLocaleLowerCase("th-TH").includes(q);
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
  ui.mapFilter.innerHTML = btn("", "ทุกเกม", items.length) + [...counts].map(([k, v]) => btn(k, v.name, v.n)).join("");
  ui.mapStat.textContent = fmt(counts.size);
}

function renderList() {
  ui.clear.hidden = !ui.search.value;
  const list = items.filter(matches);
  const filtering = !!(activeMap || ui.search.value.trim());
  ui.results.innerHTML = filtering ? `เจอ <b>${fmt(list.length)}</b> จาก ${fmt(items.length)}` : `ทั้งหมด <b>${fmt(items.length)}</b> สคริปต์`;

  if (!items.length) {
    ui.featured.innerHTML = "";
    ui.rows.innerHTML = '<div class="state"><i class="fa-solid fa-box-open"></i><b>คลังยังว่างอยู่</b><span>เดี๋ยวทีมงานเติมสคริปต์ให้ แวะมาใหม่นะ</span></div>';
    return;
  }
  if (!list.length) {
    ui.featured.innerHTML = "";
    ui.rows.innerHTML = '<div class="state"><i class="fa-solid fa-ghost"></i><b>หาไม่เจอเลย</b><span>ลองเปลี่ยนคำค้น หรือกด "ทุกเกม" เพื่อดูทั้งหมด</span></div>';
    return;
  }

  const [top, ...rest] = filtering ? [null, ...list] : list;
  ui.featured.innerHTML = top
    ? `<article class="feature" data-open="${Number(top.id)}">
        <div class="feature-img"><span class="ribbon">แนะนำ</span><img src="${esc(safeImage(top.image))}" alt=""></div>
        <div class="feature-info">
          <h3>${esc(top.name || "ไม่มีชื่อ")}</h3>
          <p>${esc(top.description || "")}</p>
          ${chipsHTML(top, 6)}
          <div class="feature-actions">
            <button class="z-btn z-red z-lg" type="button" data-copy="${Number(top.id)}"><i class="fa-solid fa-bolt"></i><span>คัดลอกเลย</span></button>
            <button class="z-btn z-lg" type="button" data-open="${Number(top.id)}"><i class="fa-solid fa-terminal"></i><span>ดูโค้ด</span></button>
          </div>
        </div>
      </article>`
    : "";
  ui.rows.innerHTML = rest
    .map(
      (it) => `<article class="row" data-open="${Number(it.id)}">
        <img class="row-icon" src="${esc(safeImage(it.image))}" alt="" loading="lazy">
        <div class="row-info"><h3>${esc(it.name || "ไม่มีชื่อ")}</h3><p>${esc(it.description || "")}</p>${chipsHTML(it)}</div>
        <div class="row-actions">
          <button class="z-btn z-red" type="button" data-copy="${Number(it.id)}"><i class="fa-regular fa-copy"></i><span>คัดลอก</span></button>
          <button class="z-btn" type="button" data-open="${Number(it.id)}" aria-label="ดูโค้ด ${esc(it.name || "")}"><i class="fa-solid fa-terminal"></i><span>โค้ด</span></button>
        </div>
      </article>`
    )
    .join("");
  document.querySelectorAll(".row-icon, .feature-img img").forEach((img) => img.addEventListener("error", () => (img.src = FALLBACK_IMAGE), { once: true }));
}

function renderMeta(updatedAt) {
  ui.scriptStat.textContent = fmt(items.length);
  if (!updatedAt) return;
  const d = new Date(updatedAt);
  ui.updatedStat.textContent =
    d.toDateString() === new Date().toDateString()
      ? `วันนี้ ${d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`
      : d.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
  editedLabel = `แก้ไขล่าสุด ${d.toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`;
  renderClock();
}

function renderClock() {
  if (!editedLabel) return;
  const parts = [editedLabel];
  if (lastLoad) parts.push(`เช็กข้อมูลล่าสุด ${new Date(lastLoad).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`);
  if (loading) parts.push("กำลังเช็ก...");
  else if (document.hidden) parts.push("พักเช็กอัตโนมัติ");
  else {
    const left = Math.max(0, Math.ceil((nextLoadAt - Date.now()) / 1000));
    parts.push(`เช็กรอบถัดไปใน ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`);
  }
  ui.lastUpdate.textContent = parts.join(" · ");
}

function skeleton() {
  ui.featured.innerHTML = "";
  ui.rows.innerHTML = Array.from({ length: 4 }, () =>
    '<div class="row sk"><div class="row-icon"></div><div class="row-info"><div class="bar" style="width:45%"></div><div class="bar" style="width:80%"></div></div></div>'
  ).join("");
  ui.results.textContent = "กำลังดึงข้อมูล...";
}

function fillDrawer(it) {
  ui.dTitle.textContent = it.name || "ไม่มีชื่อ";
  ui.dDesc.textContent = it.description || "";
  ui.dDesc.hidden = !it.description;
  ui.dImage.src = safeImage(it.image);
  ui.dImage.onerror = () => (ui.dImage.src = FALLBACK_IMAGE);
  const code = String(it.script || "");
  const lines = code ? code.split("\n") : ["-- ยังไม่มีโค้ด"];
  ui.code.replaceChildren(
    ...lines.map((line) => {
      const s = document.createElement("span");
      s.className = "ln";
      s.textContent = line || " ";
      return s;
    })
  );
  ui.codeInfo.textContent = `${fmt(lines.length)} บรรทัด · ${fmt(code.length)} ตัวอักษร`;
  const games = gamesOf(it);
  ui.dMaps.innerHTML = games.length
    ? games
        .map((m) => {
          const url = safeGameURL(m.url);
          const inner = `<i class="fa-solid fa-play"></i><span>${esc(m.name)}</span>${url ? '<i class="fa-solid fa-arrow-up-right-from-square ext"></i>' : ""}`;
          return url ? `<a class="game-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<div class="game-link">${inner}</div>`;
        })
        .join("")
    : '<div class="game-link"><i class="fa-solid fa-globe"></i><span>ใช้ได้ทั่วไป</span></div>';
}

function openDrawer(id, push) {
  const it = byId(id);
  if (!it) return false;
  if (!openItem) lastFocus = document.activeElement;
  openItem = it;
  fillDrawer(it);
  if (push) history.pushState({ script: it.id }, "", `?script=${it.id}`);
  document.title = `${it.name || "สคริปต์"} | ZeroHub Scripts`;
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
  document.title = "ZeroHub Scripts | สคริปต์ Roblox ฟรีจาก ZeroHub";
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
      signal: AbortSignal.timeout(10000),
    });
    const body = await r.json().catch(() => null);
    if (!r.ok) {
      const err = new Error((body && body.message) || `HTTP ${r.status}`);
      err.code = body && body.code;
      throw err;
    }
    items = Array.isArray(body) ? body : [];
    lastLoad = Date.now();
    const dbLatest = items.reduce((m, it) => (it.updated_at > m ? it.updated_at : m), "");
    renderMeta(new Date(dbLatest || 0) > new Date(SITE_UPDATED) ? dbLatest : SITE_UPDATED);
    renderFilter();
    renderList();
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
        missing ? "ฐานข้อมูลยังไม่พร้อม" : err.name === "TimeoutError" ? "เซิร์ฟเวอร์ตอบช้าเกินไป" : "ดึงข้อมูลไม่สำเร็จ"
      }</b><span>${missing ? "ต้องสร้างตาราง scripts ใน Supabase ก่อน" : "เช็กอินเทอร์เน็ตแล้วลองอีกครั้ง"}</span><button class="z-btn z-red" type="button" data-retry><i class="fa-solid fa-arrows-rotate"></i><span>ลองอีกครั้ง</span></button></div>`;
      ui.results.textContent = "เชื่อมต่อไม่ได้";
    } else {
      toast("รีเฟรชไม่สำเร็จ ยังแสดงข้อมูลชุดเดิมอยู่");
    }
    return false;
  } finally {
    loading = false;
    ui.refresh.disabled = false;
    ui.refresh.classList.remove("spin");
    renderClock();
  }
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
  if (await load(false)) toast("ดึงข้อมูลล่าสุดแล้ว", true);
});
ui.quickCopy.addEventListener("click", () => {
  if (!items.length) return toast("รอข้อมูลโหลดเสร็จก่อนนะ");
  copyScript(items[0], ui.quickCopy);
});
ui.copy.addEventListener("click", () => copyScript(openItem, ui.copy));
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
setupEmbers();
load(true);
setInterval(() => {
  if (!document.hidden && !loading && Date.now() >= nextLoadAt) load(false);
  else renderClock();
}, 1000);
