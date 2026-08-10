const requirementHead = document.querySelector("#requirements .head h2");
if (requirementHead) {
  requirementHead.innerHTML = "기능 구축과 함께<br>기존 DB 개선이 핵심입니다.";
}

const moduleHeader = document.querySelector("#requirements .modules .th");
moduleHeader?.insertAdjacentHTML(
  "afterend",
  '<div class="db-row"><b>00 · 기존 DB 개선</b><span>현행 데이터 구조 진단, 중복·불일치 정리, 핵심 식별체계와 관계 재설계, 기존 데이터 이관</span><em>공통 기반</em></div>',
);

let current = 0;
let snapLock = false;
const sections = [...document.querySelectorAll("[data-section]")];
const links = [...document.querySelectorAll("[data-nav]")];
const page = document.querySelector("[data-page]");
const rail = document.querySelector(".rail");
const total = Math.max(0, sections.length - 1);
const SNAP_MS = 720;

const observer = new IntersectionObserver(
  (entries) => {
    if (snapLock) return;
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = Math.max(0, sections.indexOf(visible.target));
    if (index === current) return;
    current = index;
    syncChrome(index);
  },
  { threshold: [0.35, 0.55, 0.75] },
);
sections.forEach((section) => observer.observe(section));

document.querySelector("[data-menu]")?.addEventListener("click", () =>
  rail?.classList.toggle("open"),
);

document.querySelector("[data-slider]")?.addEventListener("input", (event) => {
  const value = event.target.value;
  const before = document.querySelector("[data-before]");
  const line = document.querySelector("[data-line]");
  if (before) before.style.width = `${value}%`;
  if (line) line.style.left = `${value}%`;
});

function syncChrome(index) {
  links.forEach((link) =>
    link.classList.toggle("active", link.hash === `#${sections[index]?.id}`),
  );
  if (page) {
    page.textContent = `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  }
}

function goTo(index, behavior = "smooth") {
  const next = Math.max(0, Math.min(sections.length - 1, index));
  if (next === current && behavior === "smooth" && snapLock) return;
  current = next;
  snapLock = true;
  syncChrome(next);
  sections[next]?.scrollIntoView({ behavior, block: "start" });
  rail?.classList.remove("open");
  window.setTimeout(() => {
    snapLock = false;
  }, behavior === "smooth" ? SNAP_MS : 0);
}

function nearestIndex() {
  const mid = window.scrollY + window.innerHeight * 0.4;
  let best = 0;
  let bestDist = Infinity;
  sections.forEach((section, i) => {
    const dist = Math.abs(section.offsetTop - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

function stepPage(dir) {
  if (snapLock) return;
  goTo(current + dir);
}

window.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      window.__deckZoom?.adjust(event.deltaY > 0 ? -0.05 : 0.05);
      return;
    }
    if (event.target.closest("input, textarea, select")) return;
    if (Math.abs(event.deltaY) < 10) return;
    event.preventDefault();
    if (snapLock) return;
    stepPage(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false },
);

window.addEventListener("keydown", (event) => {
  if (event.target.closest("input, textarea, select")) return;
  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    stepPage(1);
  }
  if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    stepPage(-1);
  }
  if (event.key === "Home") goTo(0);
  if (event.key === "End") goTo(sections.length - 1);
});

let touchY = 0;
window.addEventListener(
  "touchstart",
  (event) => {
    touchY = event.touches[0]?.clientY ?? 0;
  },
  { passive: true },
);
window.addEventListener(
  "touchend",
  (event) => {
    const y = event.changedTouches[0]?.clientY ?? touchY;
    const delta = touchY - y;
    if (Math.abs(delta) < 56) return;
    stepPage(delta > 0 ? 1 : -1);
  },
  { passive: true },
);

window.addEventListener(
  "scroll",
  () => {
    if (snapLock) return;
    const next = nearestIndex();
    if (next !== current) {
      current = next;
      syncChrome(next);
    }
  },
  { passive: true },
);

links.forEach((link) =>
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.hash);
    const index = target ? sections.indexOf(target) : -1;
    if (index < 0) return;
    event.preventDefault();
    goTo(index);
  }),
);

syncChrome(0);
