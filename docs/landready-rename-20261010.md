# LandReady 명칭 이전

기존 활성 lamdready 표기를 landready로 이전. 공개 브랜드는 LandReady.

- GitHub 저장소를 ansqhd5774-Choi/landready로 실제 변경했고 origin 및 run-data target guard 갱신.
- npm 패키지·CSS·JS·로고 파일명·세션 키·활성 소스 URL·현재 명세 변경. 역사 기록과 비공개 백업은 원래 증거 보존. 오래된 자산 파일은 빌드에서 제거.
- Cloudflare landready-assets 신규 배포 성공. Version c084328d-6fc8-4935-9585-60c57d36f9d7. 공개 trip 및 CSS/JS/health200, HTML 이전명칭0. 홍→HONG 공개 Runtime 확인.
- Blogger 실제 최신 XML 백업 후 명칭/호스트만 수정 저장. 공개 HTML 이전명칭0/새서버참조확인. 인증태그 및 기존글 보존.
- 이전 Worker 삭제 API 성공 및 이전health404 확인. 이전주소는 더 이상 서비스하지 않는다.
- 전체38테스트·267자산검사·구문검사PASS. 사용자 탭도 새주소로 변경.

제한: 신규 Worker는 CLI로 실제배포. 기존Worker 삭제로 이전Git자동배포연결은 유지되지 않는다. 신규Git연결은 Cloudflare GUI 로그인 필요. 현재배포성공과 향후자동배포연결을 구분. Naver 목록의 이전블로그등록 삭제는 별도 확인 필요(브라우저 영구삭제 정책).

증거 artifacts/landready-renamed-live.png. 백업 backups/blogger-theme-before-landready-rename.xml 및 blogger-theme-landready-rename.xml은 비공개 유지.

후속: 네이버 이전블로그 등록1건 삭제 후 목록에서 부재 확인, 현행landready등록유지. Cloudflare 로그인된GUI에서 기존GitHub연동권한을 재사용하여 새Worker에 landready/main 연결. build npm run check && npm test && npm run build, deploy npx wrangler deploy, root /, preview build 비활성화 확인. 실제 Git push 기반 최초자동배포는 이어서 검증.
