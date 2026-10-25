const SUPABASE_URL = "https://jfqiqcyzcsfjolkctgay.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcWlxY3l6Y3Nmam9sa2N0Z2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MzMxMDAsImV4cCI6MjEwODUwOTEwMH0.eka_J_CYoY3RilcVPPjuiTKWGSCGYdydD4AUJK2W6os";
const DATA_URL = `${SUPABASE_URL}/rest/v1/scripts?select=id,name,description,image,script,maps,updated_at&order=sort_order.asc,id.asc`;
const REFRESH_MS = 5 * 60 * 1000;
const FALLBACK_IMAGE = "img/zerohub.webp";
const IMAGE_HOSTS = ["i.postimg.cc", "tr.rbxcdn.com", "raw.githubusercontent.com", "i.imgur.com", "cdn.discordapp.com"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (id) => document.getElementById(id);
const el = {
  home: $("homeView"), detail: $("detailView"), brand: $("brandHome"), cards: $("cards"),
  results: $("resultsText"), lastUpdate: $("lastUpdateText"), search: $("searchInput"), clear: $("clearSearch"),
  refresh: $("refreshButton"), back: $("backButton"), scriptStat: $("scriptStat"), mapStat: $("mapStat"),
  updatedStat: $("updatedStat"), dImage: $("detailImage"), dTitle: $("detailTitle"), dDesc: $("detailDesc"),
  dTags: $("detailTags"), code: $("codeBlock"), codeInfo: $("codeInfo"), copy: $("copyButton"),
  mapsPanel: $("mapsPanel"), mapList: $("mapList"), mapsCount: $("mapsCount"), toast: $("toast"),
};

let items = [];
let current = null;
let loading = false;
let lastLoad = 0;
let toastTimer;

function escapeHTML(value) {
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

function safeMapURL(value) {
  try {
    const u = new URL(String(value || ""));
    const h = u.hostname.toLowerCase();
    return u.protocol === "https:" && (h === "roblox.com" || h.endsWith(".roblox.com")) ? u.href : "";
  } catch {
    return "";
  }
}

const mapsOf = (item) => (Array.isArray(item.maps) ? item.maps.filter((m) => m && m.name) : []);
const fmt = (n) => Number(n || 0).toLocaleString("th-TH");

function showToast(message, ok = false) {
  el.toast.className = `toast show${ok ? " ok" : ""}`;
  const icon = document.createElement("i");
  icon.className = ok ? "fa-solid fa-circle-check" : "fa-solid fa-circle-info";
  el.toast.replaceChildren(icon, document.createTextNode(message));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2400);
}

function filtered() {
  const q = el.search.value.trim().toLocaleLowerCase("th-TH");
  if (!q) return items;
  return items.filter((it) =>
    [it.name, it.description, mapsOf(it).map((m) => m.name).join(" ")].join(" ").toLocaleLowerCase("th-TH").includes(q)
  );
}

function stateBox(icon, title, text, retry = false) {
  return `<div class="state-box">${icon}<span class="state-title">${title}</span><span>${text}</span>${
    retry ? '<button class="btn btn-red" type="button" data-retry><i class="fa-solid fa-rotate-right"></i>ลองโหลดอีกครั้ง</button>' : ""
  }</div>`;
}

function skeletons() {
  el.cards.innerHTML = Array.from({ length: 3 }, () =>
    '<div class="card skeleton"><div class="card-media"></div><div class="card-body"><div class="sk-line" style="width:70%"></div><div class="sk-line" style="width:95%"></div><div class="sk-line" style="width:55%"></div></div></div>'
  ).join("");
  el.results.textContent = "กำลังโหลดรายการ...";
}

function renderCards() {
  const shown = filtered();
  el.clear.hidden = !el.search.value;
  el.results.innerHTML = `แสดง <strong>${fmt(shown.length)}</strong> จาก <strong>${fmt(items.length)}</strong> สคริปต์`;
  if (!items.length) {
    el.cards.innerHTML = stateBox('<i class="fa-solid fa-box-open"></i>', "ยังไม่มีสคริปต์ในระบบ", "ลองกลับมาใหม่อีกครั้งภายหลัง");
    return;
  }
  if (!shown.length) {
    el.cards.innerHTML = stateBox('<i class="fa-solid fa-magnifying-glass"></i>', "ไม่พบรายการที่ค้นหา", "ลองใช้คำค้นหาอื่น หรือล้างคำค้นหาเพื่อดูทั้งหมด");
    return;
  }
  el.cards.innerHTML = shown
    .map((it) => {
      const n = items.indexOf(it) + 1;
      const name = escapeHTML(it.name || "สคริปต์ไม่มีชื่อ");
      return `<button class="card" type="button" data-id="${Number(it.id)}" aria-label="เปิดรายละเอียด ${name}">
        <span class="card-media"><img src="${escapeHTML(safeImage(it.image))}" alt="" loading="lazy"><span class="card-number"><i class="fa-solid fa-hashtag"></i>สคริปต์ ${fmt(n)}</span><span class="card-open">ดูรายละเอียด <i class="fa-solid fa-arrow-up-right-from-square"></i></span></span>
        <span class="card-body"><span class="card-title">${name}</span><span class="card-desc">${escapeHTML(it.description || "ยังไม่มีคำอธิบายสำหรับสคริปต์นี้")}</span>
        <span class="card-foot"><span><i class="fa-solid fa-gamepad"></i> ${fmt(mapsOf(it).length)} แมพที่รองรับ</span><span class="card-action">เปิดดู <i class="fa-solid fa-arrow-right"></i></span></span></span>
      </button>`;
    })
    .join("");
  el.cards.querySelectorAll(".card-media img").forEach((img) => img.addEventListener("error", () => (img.src = FALLBACK_IMAGE), { once: true }));
}

function renderStats(updatedAt) {
  el.scriptStat.textContent = fmt(items.length);
  el.mapStat.textContent = fmt(new Set(items.flatMap((it) => mapsOf(it).map((m) => m.name.trim().toLowerCase()))).size);
  if (!updatedAt) return;
  const d = new Date(updatedAt);
  const today = d.toDateString() === new Date().toDateString();
  el.updatedStat.textContent = today
    ? d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
  el.lastUpdate.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> อัปเดตล่าสุด ${escapeHTML(
    d.toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
  )}`;
}

function openDetail(id, push) {
  const it = items.find((x) => Number(x.id) === Number(id));
  if (!it) return false;
  current = it;
  if (push) history.pushState({ script: it.id }, "", `?script=${it.id}`);
  el.home.hidden = true;
  el.detail.hidden = false;
  document.title = `${it.name || "สคริปต์"} - ZeroHub Scripts`;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  el.dTitle.textContent = it.name || "สคริปต์ไม่มีชื่อ";
  el.dDesc.textContent = it.description || "ยังไม่มีคำอธิบายสำหรับสคริปต์นี้";
  el.dImage.src = safeImage(it.image);
  el.dImage.alt = `ภาพประกอบ ${it.name || "สคริปต์"}`;
  el.dImage.onerror = () => (el.dImage.src = FALLBACK_IMAGE);

  const code = String(it.script || "");
  el.code.textContent = code || "ไม่พบโค้ดของสคริปต์นี้";
  el.codeInfo.textContent = `${fmt(code.length)} ตัวอักษร · ${fmt(code ? code.split("\n").length : 0)} บรรทัด`;

  const maps = mapsOf(it);
  el.dTags.innerHTML = `<span class="tag"><i class="fa-solid fa-code"></i>สคริปต์ Roblox</span><span class="tag"><i class="fa-solid fa-gift"></i>ฟรี</span><span class="tag"><i class="fa-solid fa-gamepad"></i>${fmt(maps.length)} แมพที่รองรับ</span>`;
  el.mapsPanel.hidden = !maps.length;
  el.mapsCount.textContent = `${fmt(maps.length)} แมพ`;
  el.mapList.innerHTML = maps
    .map((m) => {
      const url = safeMapURL(m.url);
      const inner = `<i class="fa-solid fa-gamepad"></i><span>${escapeHTML(m.name)}</span>${url ? '<i class="fa-solid fa-arrow-up-right-from-square"></i>' : ""}`;
      return url
        ? `<a class="map-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
        : `<div class="map-link">${inner}</div>`;
    })
    .join("");
  resetCopyButton();
  el.back.focus({ preventScroll: true });
  return true;
}

function showHome() {
  current = null;
  el.detail.hidden = true;
  el.home.hidden = false;
  document.title = "ZeroHub Scripts - แจกสคริปต์ Roblox ฟรี";
}

function closeDetail() {
  if (history.state && history.state.script != null) {
    history.back();
    return;
  }
  history.replaceState({}, "", location.pathname);
  showHome();
  document.getElementById("scripts").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

function syncFromURL() {
  const id = new URLSearchParams(location.search).get("script");
  if (id && openDetail(id, false)) return;
  if (id) history.replaceState({}, "", location.pathname);
  showHome();
}

function resetCopyButton() {
  el.copy.classList.remove("success");
  el.copy.querySelector("i").className = "fa-regular fa-copy";
  el.copy.querySelector("span").textContent = "คัดลอกโค้ดสคริปต์";
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

async function loadData(showSkeleton) {
  if (loading) return;
  loading = true;
  if (showSkeleton) skeletons();
  el.refresh.disabled = true;
  el.refresh.classList.add("is-spinning");
  try {
    const r = await fetch(DATA_URL, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const body = await r.json().catch(() => null);
    if (!r.ok) {
      const err = new Error(body && body.message ? body.message : `HTTP ${r.status}`);
      err.code = body && body.code;
      throw err;
    }
    items = Array.isArray(body) ? body : [];
    const latest = items.reduce((m, it) => (it.updated_at && it.updated_at > m ? it.updated_at : m), "");
    renderStats(latest || new Date().toISOString());
    renderCards();
    lastLoad = Date.now();
    if (current) {
      const fresh = items.find((x) => Number(x.id) === Number(current.id));
      if (fresh) current = fresh;
      else closeDetail();
    } else syncFromURL();
  } catch (err) {
    if (!items.length) {
      const missing = err.code === "PGRST205" || err.code === "42P01";
      const timeout = err.name === "TimeoutError";
      el.cards.innerHTML = stateBox(
        '<i class="fa-solid fa-triangle-exclamation"></i>',
        missing ? "ยังไม่ได้ตั้งค่าฐานข้อมูล" : timeout ? "การเชื่อมต่อใช้เวลานานเกินไป" : "โหลดรายการไม่สำเร็จ",
        missing ? "ต้องสร้างตาราง scripts ใน Supabase ก่อน" : "ตรวจสอบอินเทอร์เน็ตแล้วลองโหลดใหม่อีกครั้ง",
        true
      );
      el.results.textContent = "ยังโหลดรายการไม่ได้";
      el.lastUpdate.textContent = "เชื่อมต่อข้อมูลไม่สำเร็จ";
    } else {
      showToast("อัปเดตข้อมูลไม่สำเร็จ กำลังแสดงรายการเดิม");
    }
  } finally {
    loading = false;
    el.refresh.disabled = false;
    el.refresh.classList.remove("is-spinning");
  }
}

function setupEmbers() {
  const canvas = $("embers");
  const ctx = canvas.getContext("2d");
  let w, h, parts;
  const spawn = (any) => ({
    x: Math.random() * w,
    y: any ? Math.random() * h : h + 10,
    r: Math.random() * 2 + 0.6,
    vy: Math.random() * 0.5 + 0.2,
    vx: (Math.random() - 0.5) * 0.3,
    a: Math.random() * 0.55 + 0.25,
    white: Math.random() < 0.18,
    t: Math.random() * 100,
  });
  const resize = () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    parts = Array.from({ length: Math.min(55, Math.floor(w / 22)) }, () => spawn(true));
  };
  const tick = () => {
    if (!document.hidden) {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.t += 0.02;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.t) * 0.25;
        if (p.y < -10) parts[i] = spawn(false);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.white ? `rgba(255,255,255,${p.a})` : `rgba(255,40,40,${p.a})`;
        ctx.shadowBlur = 10;
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

el.cards.addEventListener("click", (e) => {
  if (e.target.closest("[data-retry]")) return loadData(true);
  const card = e.target.closest(".card[data-id]");
  if (card) openDetail(card.dataset.id, true);
});
el.cards.addEventListener("pointermove", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
});
el.search.addEventListener("input", renderCards);
el.clear.addEventListener("click", () => {
  el.search.value = "";
  renderCards();
  el.search.focus();
});
el.refresh.addEventListener("click", async () => {
  await loadData(false);
  showToast("อัปเดตรายการแล้ว", true);
});
el.back.addEventListener("click", closeDetail);
el.brand.addEventListener("click", (e) => {
  e.preventDefault();
  if (location.search) history.pushState({}, "", location.pathname);
  showHome();
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});
el.copy.addEventListener("click", async () => {
  if (!current || !current.script) return showToast("ไม่พบโค้ดสำหรับคัดลอก");
  if (!(await copyText(String(current.script)))) return showToast("คัดลอกไม่สำเร็จ กรุณาเลือกและคัดลอกโค้ดเอง");
  el.copy.classList.add("success");
  el.copy.querySelector("i").className = "fa-solid fa-check";
  el.copy.querySelector("span").textContent = "คัดลอกแล้ว";
  showToast("คัดลอกโค้ดแล้ว นำไปวางใน executor ได้เลย", true);
  setTimeout(resetCopyButton, 2000);
});
addEventListener("popstate", syncFromURL);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el.detail.hidden) closeDetail();
  if (e.key === "/" && el.detail.hidden && document.activeElement !== el.search) {
    e.preventDefault();
    el.search.focus();
  }
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && Date.now() - lastLoad > REFRESH_MS) loadData(false);
});

setupEmbers();
loadData(true);
setInterval(() => {
  if (!document.hidden) loadData(false);
}, REFRESH_MS);
