const toc = document.querySelector(".rail");
const tocButton = document.createElement("button");
tocButton.type = "button";
tocButton.className = "nav-toggle";
tocButton.innerHTML = '<i data-lucide="panel-left" aria-hidden="true"></i>';
tocButton.setAttribute("aria-controls", "brief-navigation");
tocButton.setAttribute("aria-label", "목차 접기");
tocButton.title = "목차 접기";
toc?.setAttribute("id", "brief-navigation");
document.body.append(tocButton);
window.lucide?.createIcons();

document.querySelectorAll(".head h2 br").forEach((lineBreak) => {
  lineBreak.replaceWith(document.createTextNode(" "));
});

const usersHeading = document.querySelector("#users .head h2");
const usersDescription = document.querySelector("#users .head > p");
if (usersHeading) usersHeading.textContent = "사용자 유형 및 권한";
usersDescription?.remove();

const dataDescription = document.querySelector("#data .head > p");
const dataHeading = document.querySelector("#data .head h2");
if (dataHeading) dataHeading.textContent = "데이터 검수·계산 및 활용";
if (dataDescription) {
  dataDescription.textContent =
    "등록된 현장·공급망 데이터와 적용 기준을 바탕으로 검수, 계산, 자료 조회가 이어집니다.";
}

const externalIntegrationCard = document.querySelector("#data .logic article:last-child");
if (externalIntegrationCard) {
  externalIntegrationCard.innerHTML =
    "<small>OUTPUT</small><b>자료 조회·출력</b><p>검수 결과, 탄소 계산 결과, DDS 관련 자료를 역할별로 제공합니다.</p>";
}

const comparison = document.querySelector("#data .compare");
if (comparison) {
  comparison.classList.add("clear-comparison");
  comparison.innerHTML = `
    <img src="assets/gps-degradation-comparison.png" alt="동일 농경지의 GPS 경계 확인 상태와 황폐화 진행 상태 비교">
    <span class="comparison-label gps-label">GPS 경계 확인</span>
    <span class="comparison-label degradation-label">황폐화 진행</span>
  `;
}

const journey = document.querySelector("#workflow .journey");
if (journey) {
  journey.innerHTML = `
    <div><b>1</b><span>조사 신청</span><small>고객사</small></div>
    <div><b>2</b><span>접수·배정</span><small>관리자</small></div>
    <div><b>3</b><span>현장 조사</span><small>조사원</small></div>
    <div><b>4</b><span>GPS·증빙</span><small>조사원</small></div>
    <div><b>5</b><span>제출</span><small>조사원</small></div>
    <div><b>6</b><span>검수·승인</span><small>관리자</small></div>
    <div><b>7</b><span>탄소·DDS 처리</span><small>계산·자료 생성</small></div>
    <div><b>8</b><span>결과 조회</span><small>고객사</small></div>
  `;
}

function setNavigation(hidden) {
  document.body.classList.toggle("nav-hidden", hidden);
  tocButton.setAttribute("aria-expanded", String(!hidden));
  const label = hidden ? "목차 열기" : "목차 접기";
  tocButton.setAttribute("aria-label", label);
  tocButton.title = label;
}

setNavigation(window.innerWidth <= 1000);
tocButton.addEventListener("click", () => {
  setNavigation(!document.body.classList.contains("nav-hidden"));
});

document.querySelectorAll(".rail nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1000) setNavigation(true);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.body.classList.contains("nav-hidden")) {
    setNavigation(true);
    tocButton.focus();
  }
});

(function initDeckZoom() {
  const STORAGE_KEY = "kizami-deck-zoom";
  const MIN = 0.65;
  const MAX = 1.5;
  const STEP = 0.05;
  let zoom = Number(sessionStorage.getItem(STORAGE_KEY)) || 1;
  const badge = document.createElement("div");
  badge.className = "zoom-badge";
  badge.setAttribute("aria-live", "polite");
  document.body.append(badge);

  function apply(next, flash) {
    zoom = Math.round(Math.min(MAX, Math.max(MIN, next)) * 100) / 100;
    document.documentElement.style.zoom = String(zoom);
    sessionStorage.setItem(STORAGE_KEY, String(zoom));
    badge.textContent = `${Math.round(zoom * 100)}%`;
    badge.dataset.active = zoom === 1 ? "0" : "1";
    if (flash !== false) {
      badge.classList.add("show");
      clearTimeout(badge._timer);
      badge._timer = setTimeout(() => badge.classList.remove("show"), 900);
    }
  }

  window.__deckZoom = {
    adjust(delta) {
      apply(zoom + delta);
    },
    set(value) {
      apply(value);
    },
    reset() {
      apply(1);
    },
  };

  apply(zoom, false);

  window.addEventListener(
    "wheel",
    (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      window.__deckZoom.adjust(event.deltaY > 0 ? -STEP : STEP);
    },
    { passive: false, capture: true },
  );

  window.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key === "=" || event.key === "+" || event.code === "NumpadAdd") {
      event.preventDefault();
      window.__deckZoom.adjust(STEP);
    }
    if (event.key === "-" || event.key === "_" || event.code === "NumpadSubtract") {
      event.preventDefault();
      window.__deckZoom.adjust(-STEP);
    }
    if (event.key === "0" || event.code === "Numpad0") {
      event.preventDefault();
      window.__deckZoom.reset();
    }
  });
})();
