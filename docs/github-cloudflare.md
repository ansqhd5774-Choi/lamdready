# GitHub / Cloudflare 연결

공개 사이트는 https://landready.blogspot.com/ 이며 Blogger에서 유지한다.
GitHub 공개 저장소: https://github.com/ansqhd5774-Choi/lamdready

Cloudflare Worker 이름: `lamdready-assets`.
Git production branch: `main`.
Build command: `npm run check && npm test && npm run build`.
Deploy command: `npx wrangler deploy`.
Root directory: `/`.

## 공개 경로
- `/`: Blogger 홈으로 302 이동.
- `/health`: 배포 상태 확인 JSON. 실제 규정 데이터 제공 여부는 false.
- `/assets/lamdready.css`, `/assets/lamdready.js`, `/assets/manifest.json`: Git 소스에서 생성한 공개 자산.

현재 Blogger 테마는 인라인 CSS/JS를 사용한다. Cloudflare 저장소 연결은 Blogger 테마 자동 게시를 수행하지 않는다.
GitHub push는 Cloudflare 자산 배포용이며, Blogger 수정은 별도 저장·공개 검증이 필요하다.

## 로컬 검증
`npm ci`, `npm run check`, `npm test`, `npm run build`, `npx wrangler deploy --dry-run`.
규정 fixture와 Worker 라우팅 테스트 12개 통과. dry-run 성공은 실제 배포 증거가 아니다.

## 비공개 운영 파일
원본 테마·확인 태그는 `backups/`, 게시된 전체 XML은 `theme/lamdready-blogger-r1.xml`에 로컬 보관하며 Git에서 제외한다.
`scripts/build-theme.mjs`는 로컬 원본 백업이 필요하다. Git clone만으로 Blogger XML을 재생성할 수 없다.
Cloudflare 빌드는 `scripts/build-assets.mjs`만 사용하여 운영 백업을 요구하지 않는다.

## 공식 문서
- https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/
- https://developers.cloudflare.com/workers/static-assets/binding/
