const scopeSlide = document.querySelector("#scope");
const deliverySlide = document.querySelector("#delivery");
scopeSlide?.remove();
deliverySlide?.remove();

const nav = document.querySelector(".rail nav");
nav?.querySelector('a[href="#scope"]')?.remove();
nav?.querySelector('a[href="#delivery"]')?.remove();
if (nav) {
  nav.insertAdjacentHTML(
    "beforeend",
    '<a href="#discussion" data-nav><em>07</em>핵심 과제·협의</a>',
  );
}

const requirementHead = document.querySelector("#requirements .head h2");
if (requirementHead) {
  requirementHead.innerHTML = "기능 구축과 함께<br>기존 DB 개선이 핵심입니다.";
}

const moduleHeader = document.querySelector("#requirements .modules .th");
moduleHeader?.insertAdjacentHTML(
  "afterend",
  '<div class="db-row"><b>00 · 기존 DB 개선</b><span>현행 데이터 구조 진단, 중복·불일치 정리, 핵심 식별체계와 관계 재설계, 기존 데이터 이관</span><em>공통 기반</em></div>',
);

const commonLayer = document.querySelector("#channels .api b");
if (commonLayer) {
  commonLayer.textContent = "기존 DB 리팩터링 · 공통 업무·데이터 처리";
}

const finalSlide = document.createElement("section");
finalSlide.className = "slide scope";
finalSlide.id = "discussion";
finalSlide.setAttribute("data-section", "");
finalSlide.innerHTML = `
  <span class="num">07</span>
  <p class="kicker">CORE TASK AND DISCUSSION</p>
  <div class="head">
    <h2>이번 구축의 중심은<br>기존 DB 구조 개선입니다.</h2>
    <p>새 화면을 추가하는 것에 앞서 현재 사용 중인 데이터베이스를 진단하고, 조사·공급망·탄소·DDS 업무가 연결될 수 있는 공통 데이터 구조로 개선해야 합니다.</p>
  </div>
  <div class="three">
    <article><i>01 · ASSESS</i><h3>현행 DB 진단</h3><p>기존 테이블, 데이터 항목, 중복·누락·불일치, 업무별 데이터 사용방식과 이관 대상을 확인합니다.</p></article>
    <article><i>02 · RESTRUCTURE</i><h3>통합 구조 재설계</h3><p>회사·사용자·생산자·농장·조사·로트·공급망의 식별체계와 관계, 이력·버전 관리 기준을 정리합니다.</p></article>
    <article><i>03 · MIGRATE</i><h3>데이터 정비·이관</h3><p>기존 데이터를 정제·매핑하여 신규 구조로 옮기고, 이관 전후 건수와 핵심 데이터의 일치 여부를 확인합니다.</p></article>
  </div>
  <div class="definition discuss"><b>착수 전 협의 포인트</b><p>기존 DB 제공 범위와 품질 · 이관 대상과 보존기간 · 사용자별 데이터 접근범위 · 모바일 형태 · GPS·지도·오프라인 수준 · 계산 기준 · 보고서 형식 · 외부 연계 방식</p></div>
  <div class="final"><b>1차 목표</b><p>현장 조사 → 관리자 검수 → 계산·조회가 연결되는 기본 업무 흐름과 이를 지탱하는 통합 데이터 구조를 마련합니다. 세부 구현 범위는 현행 DB 진단 후 협의합니다.</p></div>
`;
document.querySelector("main")?.append(finalSlide);

const sections = [...document.querySelectorAll("[data-section]")];
const links = [...document.querySelectorAll("[data-nav]")];
const page = document.querySelector("[data-page]");
const rail = document.querySelector(".rail");
const total = sections.length - 1;

const observer = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    const index = Math.max(0, sections.indexOf(current.target));
    links.forEach((link) =>
      link.classList.toggle("active", link.hash === `#${current.target.id}`),
    );
    if (page) page.textContent = `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  },
  { threshold: [0.35, 0.6] },
);
sections.forEach((section) => observer.observe(section));

document.querySelector("[data-menu]")?.addEventListener("click", () =>
  rail?.classList.toggle("open"),
);
links.forEach((link) =>
  link.addEventListener("click", () => rail?.classList.remove("open")),
);

document.querySelector("[data-slider]")?.addEventListener("input", (event) => {
  const value = event.target.value;
  const before = document.querySelector("[data-before]");
  const line = document.querySelector("[data-line]");
  if (before) before.style.width = `${value}%`;
  if (line) line.style.left = `${value}%`;
});
