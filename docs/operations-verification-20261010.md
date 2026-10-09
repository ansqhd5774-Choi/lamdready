# 운영 기준 첫 적용 검증

대상 구현 commit: e23f5d9. 2026-10-10.

- 전체 후보 95개, 적용 후보 93개(중복 포함), 제외 C4/H2. 상태 원장은 문서 정의와 실제 구현을 구분한다.
- node --test: 31 PASS. 신규 메타정보/점검 스크립트 node --check PASS. scripts/build-assets.mjs PASS.
- main push 완료. 이후 실제 공개 Worker HTML에서 canonical, description, OG, WebPage JSON-LD, 기존 form, noindex 확인.
- 공개 홈·trip·sitemap·favicon·양식 앞면 5개 조회 200. `artifacts/public-audit.json`에 증거 저장. HTTP 성공은 사이트맵 전체 검산이나 색인 성공이 아님.
- 공개 브라우저 기본 902px와 모바일 390px 가로 넘침 없음. 모바일 캡처 `artifacts/operations-public-mobile.png`. 화면·입력 코드 변경 없음. 전체 접근성·현장 성능 검사를 이번 실행으로 대체하지 않는다.
- GSC Wizard Google/Bing 조회는 구독 제한으로 AUTOMATION_BLOCKED. 유료 구독·새 계정 연결·외부 홍보·반복 일정 생성 없음.
- 공개 글 전체 원장, 검색 계정 상태, 실사용 성능·분석 데이터, 운영 오류 접수 연락처는 미검증/미설정으로 유지한다.

다음 실행은 원장의 DEFERRED 항목에 필요한 실제 자료와 권한을 확인한 뒤 해당 범위부터 이어간다. 기존 디자인과 14개 입력 기능은 유지한다.
