// ========================================================
// 중소벤처기업부 소개 웹 앱 - app.js
// ========================================================

// 1. 핵심 업무 탭 전환 로직
function switchTab(tabId) {
  const buttons = document.querySelectorAll('.mission-tabs .tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }

  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const targetContent = document.getElementById(`tab-${tabId}`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

// 2. 빠른 정책 찾기 (Interactive Finder) 로직
function showPolicy(type) {
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }

  const results = document.querySelectorAll('.finder-result');
  results.forEach(res => res.style.display = 'none');

  const targetResult = document.getElementById(`policy-result-${type}`);
  if (targetResult) {
    targetResult.style.display = 'block';
  }
}

// 3. 뉴스 카테고리 필터링 로직
function filterNews(category) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }

  const newsCards = document.querySelectorAll('.news-card');
  newsCards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// 4. 네비게이션 스크롤 효과
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }
});

// ========================================================
// 5. 국민 체감형 셀프 진단 체크리스트 & 설문 데이터 및 로직
// ========================================================

const BENEFIT_DATABASE = [
  // 창업 & 자금
  {
    id: "p_pre_startup",
    category: "예비·초기창업",
    targetStatus: ["startup", "citizen"],
    needs: ["finance", "rnd"],
    title: "예비·초기창업패키지",
    desc: "참신한 아이디어 및 혁신 BM을 보유한 창업자에게 시제품 제작, 지식재산권 취득, 마케팅 자금을 바우처로 최대 1억 원까지 무상 지원합니다.",
    target: "혁신 아이디어를 보유한 예비창업자 및 3년 이내 초기 스타트업",
    benefit: "최대 1억 원 사업화 자금 바우처 + 1:1 창업 전담 멘토링 매칭",
    portalName: "K-Startup 포털",
    portalUrl: "https://www.k-startup.go.kr"
  },
  {
    id: "p_tips",
    category: "기술창업·투자",
    targetStatus: ["startup", "sme"],
    needs: ["rnd", "finance"],
    title: "민간투자주도형 기술창업지원 (TIPS)",
    desc: "민간 액셀러레이터·벤처캐피털(VC)이 발굴·선투자(1~2억)한 유망 기술 스타트업에게 중기부가 R&D 자금 최대 5억 원을 연계 매칭 지원합니다.",
    target: "독보적 기술을 보유한 7년 이내 딥테크·AI·바이오 스타트업",
    benefit: "최대 5억~7억 원 정부 R&D 매칭 및 글로벌 진출 연계",
    portalName: "TIPS 운영 포털",
    portalUrl: "http://www.jointips.or.kr"
  },
  // 소상공인 & 자금/경영
  {
    id: "p_sbiz_loan",
    category: "소상공인 정책자금",
    targetStatus: ["smallbiz"],
    needs: ["finance"],
    title: "소상공인 정책자금 및 대환대출 지원",
    desc: "고금리 장기화로 자금난을 겪는 소상공인을 위해 시중은행보다 낮은 정책금리로 운전자금 및 고금리 대출을 저금리로 전환해 드립니다.",
    target: "상시근로자 5인 미만(제조·건설 10인 미만) 소상공인",
    benefit: "저금리 정책자금 융자 및 연 7% 이상 고금리 대출의 저금리 대환",
    portalName: "소상공인정책자금 포털",
    portalUrl: "https://ols.semas.or.kr"
  },
  {
    id: "p_smart_store",
    category: "소상공인 디지털(AX)",
    targetStatus: ["smallbiz"],
    needs: ["digital"],
    title: "스마트상점 기술보급 사업",
    desc: "매장 내 인건비 절감과 매출 증대를 위해 테이블오더, 무인 키오스크, 서빙로봇, AI 조리로봇 등 스마트 기기 도입 비용의 50~70%를 지원합니다.",
    target: "스마트기기 도입을 희망하는 전국의 오프라인 매장 소상공인",
    benefit: "기기 도입비 최대 500만~1,500만 원 국비 국고 보조",
    portalName: "소상공인 스마트상점 누리집",
    portalUrl: "https://www.sbiz.or.kr/smst/index.do"
  },
  // 중소기업 스마트제조 & 공장
  {
    id: "p_smart_factory",
    category: "스마트제조 혁신",
    targetStatus: ["sme"],
    needs: ["digital", "rnd"],
    title: "스마트공장 구축 및 고도화 지원",
    desc: "생산 공정에 IoT, AI, 빅데이터를 적용하여 생산성을 향상시키고 불량률을 낮추도록 MES, ERP 등 공장 자동화 솔루션 구축비용을 매칭 지원합니다.",
    target: "국내 제조 중소·중견기업",
    benefit: "스마트공장 솔루션 및 연동 설비 구축비 최대 5천만~2억 원 지원",
    portalName: "스마트공장 사업관리시스템",
    portalUrl: "https://www.smart-factory.kr"
  },
  // 중소기업 글로벌 수출
  {
    id: "p_export_voucher",
    category: "글로벌 수출 판로",
    targetStatus: ["sme", "startup"],
    needs: ["export"],
    title: "중소기업 수출바우처 사업",
    desc: "해외 마케팅, 해외 전시회 참가, 글로벌 인증(CE, FDA 등) 획득, 해외 바이어 매칭 등 수출 전 과정을 바우처 형태로 자유롭게 활용할 수 있습니다.",
    target: "수출을 추진 중이거나 수출 실적을 보유한 중소기업",
    benefit: "최대 3천만~1억 원 상당의 정부 지원 바우처 발급",
    portalName: "수출지원기반활용(수출바우처) 포털",
    portalUrl: "https://www.exportvoucher.com"
  },
  // 공정거래 & 권익 보호
  {
    id: "p_fair_trade",
    category: "상생협력·권익구제",
    targetStatus: ["sme", "smallbiz", "startup"],
    needs: ["fairness"],
    title: "납품대금 연동제 컨설팅 & 기술보호 지원",
    desc: "원자재 및 에너지 비용 상승분을 원청 대기업 납품대금에 공정하게 반영할 수 있도록 연동계약 체결을 지원하고, 대기업의 기술탈취 피해 시 법률·행정 구제를 전액 지원합니다.",
    target: "수탁·하청 거래 중소기업 및 기술탈취 피해 우려 기업",
    benefit: "납품연동 약정체결 컨설팅 무료 제공, 기술분쟁 소송비용 최대 3천만 원 지원",
    portalName: "중소기업 기술보호울타리",
    portalUrl: "https://www.ultari.go.kr"
  },
  // 일반 국민 & 소비 혜택
  {
    id: "p_onnuri",
    category: "국민소비·온누리상품권",
    targetStatus: ["citizen", "smallbiz"],
    needs: ["consumption"],
    title: "충전식 카드형 온누리상품권 & 상생 할인",
    desc: "스마트폰 앱에 본인 카드를 등록해 계좌 충전 시 10% 즉시 할인 혜택을 받고, 전통시장 및 골목형 상점가에서 결제 시 40% 소득공제 혜택을 받습니다.",
    target: "전통시장 및 골목상권을 이용하는 대한민국 모든 국민",
    benefit: "월 최대 200만 원 한도 10% 특별할인 충전 + 전통시장 소득공제 40%",
    portalName: "온누리상품권 공식 포털",
    portalUrl: "https://www.sbiz.or.kr/sijangtong/nation.do"
  },
  {
    id: "p_grand_festival",
    category: "대국민 소비촉진",
    targetStatus: ["citizen", "smallbiz"],
    needs: ["consumption", "finance"],
    title: "대한민국 동행축제 & 상생소비페이백",
    desc: "중기부가 주관하는 전국 단위 대규모 소비 촉진 행사로, 우수 중기·소상공인 제품을 최대 50% 할인 구매하고 영수증 추첨 상생복권 이벤트에 참여할 수 있습니다.",
    target: "우수 중소기업·소상공인 제품을 알뜰하게 구매하고자 하는 국민",
    benefit: "전국 온·오프라인 특가 할인전 + 상생소비복권 경품 이벤트 참여",
    portalName: "동행축제 누리집",
    portalUrl: "https://k-shoppingfesta.org"
  }
];

// 설문 진단 계산 함수
function calculateBenefit(e) {
  e.preventDefault();

  const form = document.getElementById('benefitSurveyForm');
  const selectedStatus = form.querySelector('input[name="q_status"]:checked')?.value;
  const checkedNeeds = Array.from(form.querySelectorAll('input[name="q_needs"]:checked')).map(cb => cb.value);

  // 매칭 알고리즘
  // 1. targetStatus가 일치하는 항목 필터
  // 2. needs가 선택된 경우, needs 중 하나라도 일치하면 높은 점수 부여
  // 3. needs를 선택하지 않은 경우 해당 신분의 대표 프로그램 제공

  let matched = BENEFIT_DATABASE.filter(item => {
    return item.targetStatus.includes(selectedStatus);
  });

  if (checkedNeeds.length > 0) {
    matched = matched.filter(item => {
      // 선택한 고민 중 하나라도 포함하고 있으면 매칭
      return item.needs.some(need => checkedNeeds.includes(need));
    });
  }

  // 매칭된 결과가 없을 경우 해당 신분의 전체 프로그램 추천
  if (matched.length === 0) {
    matched = BENEFIT_DATABASE.filter(item => item.targetStatus.includes(selectedStatus));
  }

  // 렌더링
  const resultContainer = document.getElementById('surveyResultContainer');
  const listContainer = document.getElementById('matchedProgramsList');
  const titleElem = document.getElementById('surveyResultTitle');
  const introElem = document.getElementById('surveyResultIntro');

  const statusNames = {
    startup: "예비창업자 / 스타트업",
    smallbiz: "소상공인 / 골목상권 자영업자",
    sme: "중소 제조·기술기업 대표님",
    citizen: "일반 국민 / 소비자"
  };

  titleElem.innerHTML = `🎉 <span style="color: #0076d6;">[${statusNames[selectedStatus]}]</span> 맞춤 지원 프로그램 (${matched.length}건)`;
  introElem.innerText = checkedNeeds.length > 0 
    ? "선택하신 주요 고민과 현황을 종합 분석하여 중기부에서 즉시 지원받으실 수 있는 핵심 사업들을 선별했습니다."
    : "고객님의 현재 현황에 가장 적합한 중기부의 대표 필수 지원사업들을 추천해 드립니다.";

  listContainer.innerHTML = matched.map(prog => `
    <div class="matched-item-card">
      <div class="matched-card-top">
        <span class="matched-category-tag">${prog.category}</span>
        <h4>${prog.title}</h4>
        <p>${prog.desc}</p>
      </div>
      <div class="matched-detail-meta">
        <div><strong>• 지원 대상:</strong> ${prog.target}</div>
        <div><strong>• 핵심 혜택:</strong> <span style="color:#0076d6; font-weight:700;">${prog.benefit}</span></div>
      </div>
      <a href="${prog.portalUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-apply">
        ${prog.portalName} 바로 신청하기 ↗
      </a>
    </div>
  `).join('');

  resultContainer.style.display = 'block';

  // 결과 위치로 부드럽게 스크롤
  resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 설문 초기화
function resetSurvey() {
  const form = document.getElementById('benefitSurveyForm');
  if (form) form.reset();
  const resultContainer = document.getElementById('surveyResultContainer');
  if (resultContainer) {
    resultContainer.style.display = 'none';
  }
  const selfCheckSection = document.getElementById('self-check');
  if (selfCheckSection) {
    selfCheckSection.scrollIntoView({ behavior: 'smooth' });
  }
}
