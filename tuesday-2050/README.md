# 「2050년 6월의 어느 화요일」 — 3분 비주얼라이제이션 필름

Remotion 프로젝트. **1920×1080, 30fps, 180초 (5400프레임)**, 8컷 구성.
Ken Burns 슬로우 줌 + 1.5초 크로스페이드(1~7컷), 7→8컷은 하드컷.

> **현재 상태: 스캐폴딩 완료 (플레이스홀더로 렌더 검증됨).**
> 실제 이미지와 음악이 없어 각 컷은 자리표시(placeholder) 카드로 렌더됩니다.
> 아래 두 가지가 준비되면 실제 컷 생성 → 최종 렌더로 넘어갑니다:
> 1. `refs/` 에 주인공 사진 10장
> 2. `GEMINI_API_KEY` 환경변수 (Nano Banana / Gemini 2.5 Flash Image)

---

## 진행 순서

### 1단계 — 이미지 생성 (키 필요)
```bash
export GEMINI_API_KEY=...        # 아직 미설정
cp <사진들> refs/                 # 주인공 본인 10장
npm run gen                       # 컷당 3장 → candidates/cut1..7/
```
`scripts/generate-cuts.mjs` 가 `refs/` 사진을 레퍼런스로 넣어 각 컷의 프롬프트
(48세 나이 변환 + 실사 스펙 포함)로 3장씩 생성합니다. **컷8은 암전 자막이라 생성 안 함.**

생성물을 보고 컷별로 1장씩 고른 뒤:
```bash
mkdir -p public/finals
cp candidates/cut1/candidate_2.png public/finals/cut1.jpg   # 예시
```
그리고 `src/config.ts` 의 `FINALS` 배열에 고른 컷 id를 추가하면 해당 컷이
플레이스홀더 대신 실제 이미지로 바뀝니다.

### 2단계 — 컴포지션 (완료)
8컷 조립, Ken Burns(컷당 3~5% 줌인 + 미세 팬), 크로스페이드, 한글 자막 오버레이,
음악 볼륨 오토메이션이 모두 `src/` 에 구현되어 있습니다.

### 3단계 — 프리뷰 & 렌더
```bash
npm run studio     # Remotion Studio 프리뷰
npm run render     # → out/tuesday-2050.mp4
```

---

## 음악
`assets/README.md` 참고. `assets/music.mp3` → `public/music.mp3` 복사 후
`src/config.ts` 의 `HAS_MUSIC = true`. 볼륨 오토메이션(덕킹/피크/페이드아웃)은
`MUSIC_KEYS` / `MUSIC_VOLS` 에 컷 타이밍 기준으로 이미 설정돼 있습니다.
**아직 음악 파일이 없습니다 — 필요하면 Pixabay에서 받아올 수 있습니다.**

## 한글 폰트
`public/fonts/` 에 로컬 woff2로 포함 (렌더 시 gstatic 미접속).
자막 문구를 바꾸면 `scripts/fetch-fonts.mjs` 의 `CAPTION_TEXT` 에 글자를 추가하고
다시 실행하세요 (서브셋 폰트라 사용한 글자만 포함됨).

## 렌더 브라우저 (이 실행 환경)
샌드박스가 Remotion의 Chrome 다운로드를 막으므로 사전 설치된 크로미움을 사용:
```bash
npm run render -- --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## 구조
```
src/
  config.ts        # 컷 정의·타이밍·음악 키프레임 (단일 진실 공급원)
  Root.tsx         # Composition 등록 (Tuesday2050, 1920x1080, 5400f)
  Film.tsx         # TransitionSeries 조립 + 음악
  fonts.ts         # 로컬 한글 폰트 로드
  components/
    Scene.tsx        # 컷 1개 = 이미지 + 자막
    KenBurnsImage.tsx# 슬로우 줌/팬
    Caption.tsx      # 4종 자막(chyron/wall/framed/title)
scripts/
  generate-cuts.mjs      # Nano Banana 이미지 생성 (1단계)
  generate-placeholders.mjs # 자리표시 카드 생성
  fetch-fonts.mjs        # 한글 폰트 로컬 다운로드(서브셋)
refs/         # 주인공 사진 (미커밋)
candidates/   # 생성 후보 (미커밋)
public/finals/# 선택된 최종 8장
```
