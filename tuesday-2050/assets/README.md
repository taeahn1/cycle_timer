# assets/

## music.mp3
배경 음악 파일을 `assets/music.mp3` 로 넣은 뒤 `public/music.mp3` 로 복사하세요
(Remotion은 `public/`에서만 `staticFile()`로 읽습니다):

```bash
cp assets/music.mp3 public/music.mp3
```

그리고 `src/config.ts`의 `HAS_MUSIC` 를 `true` 로 바꾸면 음악이 켜집니다.

볼륨 오토메이션은 이미 구성되어 있습니다 (`src/config.ts`의 `MUSIC_KEYS`/`MUSIC_VOLS`):
- 컷1: 피아노 페이드인
- 컷3: 덕킹 + 약 1초 near-silence
- 컷6: 피크
- 컷8: 페이드아웃

음악 파일이 없으면 알려주세요 — Pixabay에서 무료 트랙을 받아오겠습니다.
