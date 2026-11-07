# ⚖️ OneWord (3초 의사결정 심판소 · The One-Word Verdict)

> **ONE WORD LAB — PICKLE 7일 자율 개발 실험 공식 프로젝트**  
> 끝없는 결정 장애를 3초 만에 단 하나의 단어로 종결하는 AI 극초단파 판결 웹 서비스.

---

## 🚀 프로젝트 소개

- **공식 허브:** [Notion 프로젝트 페이지](https://app.notion.com/p/ONE-WORD-LAB-PICKLE-OneWord-3-411000b759dc819c96f0c0cf16fb5984)
- **실험 기간:** 2026.11.08 (DAY 1) ~ 2026.11.14 (DAY 7)
- **개발 주체:** 피클 (Pickle) — 100% 독립 자율 개발

---

## ⚡ 빠른 실행 방법 (Local Run)

외부 빌드 도구 설치 필요 없이 브라우저에서 바로 열거나 간이 정적 웹서버로 즉시 실행됩니다.

```bash
# 1. 저장소 클론
git clone https://github.com/ju0o/7Day_Pickle.git
cd 7Day_Pickle

# 2. 로컬 웹서버 실행 (Python 표준 내장 서버)
python3 -m http.server 8080

# 3. 브라우저 접속
# http://localhost:8080
```

---

## 🎯 1차 탑재 핵심 기능 (DAY 1 / 1회차)

1. **3초 의사결정 판결 엔진 (`src/engine/verdict.js`)**:
   - 4대 카테고리(지름신, 커리어/이직, 연애/인간관계, 일상/루틴) 자동 분류
   - 3대 AI 심판관(이성 닥터 로직, 행동 캡틴 바이브, 현실 미스터 팩트)의 관점 도출
   - 오직 하나의 단어(One Word)와 촌철살인 펀치라인 자동 선고
2. **다크 네온 인터랙션 UI (`index.html`)**:
   - Tailwind CSS 기반 사이버펑크 미니멀 디자인
   - 4대 빠른 질문 프리셋 원클릭 입력
   - 3초 카운트다운 및 심판관 타이핑 연출
3. **로컬 퍼스트 & URL 공유 시스템 (`src/storage/history.js`)**:
   - LocalStorage 기반 최근 판결 30건 로컬 영구 보존
   - Base64 URL Fragment 해시 직렬화로 서버 없이도 "내 판결 결과 링크" 전송 가능

---

## 🧪 테스트 실행

```bash
python3 -m unittest discover -s tests -v
# 5 tests -> OK (100% PASS)
```

---

## 🗺️ 7일 로드맵 (DAY 1 ~ DAY 7)

- [x] **DAY 1 (11.08):** 기획 확정, Notion 허브 개설, 프로젝트 뼈대 및 기본 판결 엔진 구축
- [ ] **DAY 2 (11.09):** 네온 인터랙티브 디자인 고도화, 타이핑 애니메이션 튜닝
- [ ] **DAY 3 (11.10):** HTML5 Canvas 기반 인스타/스레드 공유 카드 1초 캡처 생성기
- [ ] **DAY 4 (11.11):** 4대 카테고리 프리셋 및 과거 판결 히스토리 로컬 스토리지 뷰어 고도화
- [ ] **DAY 5 (11.12):** Web Audio 법봉 타격음 SFX 및 가상 여론 찬반 투표 게이지
- [ ] **DAY 6 (11.13):** 모바일 반응형 터치 최적화, PWA 홈 화면 추가, 다국어 지원
- [ ] **DAY 7 (11.14):** GitHub Pages 정적 배포, 최종 도메인 검증, 릴리스 태그 발행 및 회고
