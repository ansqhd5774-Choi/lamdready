# LandReady 분석 수집 준비

2026-10-10. C45/H27 전체 완료가 아니라 실제 제공자 설정 및 연결 준비 단계다.

- 기존 Analytics 계정 내 **LandReady** 속성 생성 완료. 기존 Tistory 속성/스트림은 변경하지 않았다.
- 웹 스트림 **LandReady Home**, URL `https://landready.blogspot.com`, 측정 ID `G-CVSFDTG9KF` 생성 후 관리 화면에서 재확인했다.
- 향상된 측정 OFF, 연결된 사이트 태그 0. 생성 직후 수신 없음 상태였으며, 연결 후 실제 수신을 아래와 같이 확인했다.
- `scripts/prepare-home-analytics.mjs`로 현재 실제 Blogger 테마 백업에서 홈 전용 코드를 준비했다. 광고 저장/사용자 데이터/개인화 거부, Google signals 비활성, 고정 홈 URL/제목 및 빈 referrer, 자동 조회 OFF 후 단일 page_view. Worker 작성폼에는 추가하지 않는다.
- 원본 및 수정본 XML 구문 검사 PASS, 변환 스크립트 JS 구문 검사 PASS.
- 사용자가 **홈 방문 측정 연결**을 명시적으로 승인한 뒤 GUI에서 현재 테마를 저장했다. 붙여넣은 XML과 준비본을 클립보드로 정확히 대조했다.
- 공개 홈의 gtag 스크립트 1개, 관찰 새로고침의 page_view 요청 1개 및 Google 수집 응답 204. 고정 홈 URL, 빈 referrer, 올바른 측정 ID를 확인했다. 원시 요청의 식별자/텔레메트리는 저장하지 않았다.
- LandReady 제공자 화면의 지난 30분 활성 사용자 **1명**으로 실제 수신을 확인했다. 이번 시험 방문은 운영 검증 방문으로 기록하며 일반 이용자 성과로 해석하지 않는다. 처음 열린 홈 방문까지 포함한 누적 조회수와 관찰 새로고침 1회의 요청수를 혼동하지 않는다.
- Worker 작성폼 14항목 유지, GA/Tag Manager script 0개. 실제 공개 감사 20요청 PASS, 공개 글 0개/예전 글 없음/noindex 유지.
- 장기 지연·결측, 운영자 필터의 지속 운영, 실제 유입 성과는 아직 미검증. C45/H27은 수집 경로를 확보했지만 전체 운영 완료로 바꾸지 않는다.

## 재개 지점

### 운영자 구분 추가 검증

`scripts/prepare-operator-exclusion.mjs`로 실제 저장된 테마와 일치하는 원본에서 최소 수정 후 GUI 저장했다. XML 검사 PASS. 운영자는 `https://landready.blogspot.com/#lr-operator`를 1회 열면 해당 브라우저의 localStorage에 식별정보 없는 제외 플래그를 저장한다. 이후 일반 홈 새로고침도 측정에서 제외한다. 복구는 `https://landready.blogspot.com/#lr-visitor`를 1회 연다. 브라우저 저장소 초기화/다른 브라우저에서는 다시 설정해야 한다. 프로필 전체나 IP를 자동 식별한 필터가 아니다.

실제 관찰: 운영자 모드 collect0, hash 없는 홈 재방문 collect0, 일반 방문 복구 후 page_view1/응답204. 시험 방문은 일반 사용자 성과로 간주하지 않는다. 검사 후 작업 브라우저는 운영자 제외로 돌려놓았다. 증거 `artifacts/operator-exclusion-runtime-20261010.json`, `operator-home-proof-20261010.png`. GA 기본 Internal Traffic 필터는 테스트 상태이며 활성 제외로 바꾸지 않았다. IP 규칙을 임의 생성하지 않았다.

Search Console 후속 실적 확인은 3개월/웹 범위에서 여전히 처리 중/데이터 없음. 임의 유입 수치나 오래된 건강 글 표본으로 대체하지 않는다.

사용자가 **정기 실행 없이 수동 점검**을 선택했다. 예약/자동화 미생성은 사용자 선택이며 설정 누락이 아니다. 이후 필요 시 수동 공개 감사와 제공자 화면 확인으로 진행한다. 외부 홍보 채널은 별도 지정되지 않았다.

새 속성/스트림 생성과 테마 연결은 반복하지 않는다. 다음 단계는 이미 연결된 전용 속성에서 운영자 구분과 집계 지연/결측을 확인하는 것이다. 실시간 수신을 장기 결측/지연 검증 완료로 확대하지 않는다.

증거: `artifacts/landready-ga-stream-created-20261010.png`, `landready-ga-received-20261010.png`, `landready-ga-home-request-20261010.json`. 비공개 백업: `backups/blogger-theme-before-landready-ga-20261010.xml`, `backups/blogger-theme-after-landready-ga-20261010.xml`.
