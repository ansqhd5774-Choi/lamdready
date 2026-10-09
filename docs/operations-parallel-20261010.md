# 동시 점검 결과

2026-10-10. 사용자 동시 진행 승인에 따라 링크 점검과 자산 점검을 병렬 실행. 기존 글·테마·디자인 변경 없음.

- 링크: 피드 공개 글 22개 모두 홈 시작 anchor graph 도달. 120 URL 응답 검사 실패 0. 탐색40페이지·전체120대상·동시3·각20초·무재시도. 최초 내부 대상311개 중193개 미검사였으나 기존 체크포인트에서 이어서193개 조회 완료. 총고유313 URL(내부링크311 +feed/sitemap2), HTTP실패0, 기존선정대상 미검사0. 추가 링크 확장탐색 없음. artifacts/link-audit-resume.json. 카테고리 직접 연결14글은 제한된 탐색 결과이며 나머지 고립을 의미하지 않는다. 외부 링크·이미지·soft404 미검사. artifacts/link-audit.json.
- 자산: home22개 decoded 합계516609B, trip12개2989948B. 조회 대상 전부200. 압축 전송량·실제 모바일 로딩시간이 아니다. home5개 외부 스크립트 allowlist 밖 미조회. trip 합계에는 공통CSS 배경2637535B 포함. 실제 DOM ::before display:none 확인하여 화면에 사용되는 배경 이미지로 단정하지 않는다. 동적KR도시6813B는 정적 인벤토리 제외.
- 초기 로딩: trip 스크립트 parser blocking0, CSS1, front243588B 크기1684×1191 highpriority. reverse lazy1개 별도 제외. home parser blocking script2개 및 CSS2개 확인; 측정 없이 변경하지 않았다.
- 모바일: 공개 작성 도구360×800, 내용폭345(scrollbar15), document scrollWidth345/clientWidth345. 모든 노출 input/select/copy 높이44px. copy/dropdown 폭32px. 날짜dialog left16/right329/width313. artifacts/parallel-mobile-360.png 및 parallel-mobile-360-date.png. 홈360px도 scrollWidth360/clientWidth360 가로 넘침 없음(artifacts/parallel-home-360.png). 기존390px/1280px Runtime 증거 재사용. 화면설정 원복.
- 성능 제약: Lighthouse CLI/package 및 Playwright package 없음. 추가 설치·유료 실행 없음. 실험실 LCP/INP/CLS와 실제 사용자 CWV는 미측정. AUTOMATION_BLOCKED는 해당 측정 수단 범위이며 서비스 실패 증거가 아니다.

원장: H18 및 C39 범위 적용으로 총32 IMPLEMENTED_SCOPED,61 미완료,2 제외. C38 성능 실제 측정은 DEFERRED 유지. HTTP 성공은 검색 색인이나 내용 정확성의 증거가 아니다.

다음: 외부 링크·soft404 의미 검사, 실제 브라우저 waterfall/성능 측정 수단, Google 수집 오류·Bing 미인증 해소. 관련 계정·자료가 필요한 부분을 전체 서비스 장애로 확대하지 않는다.

검증: node --test 전체38 PASS, package check 번들 Node PASS. 링크120·잔여193 및 성능 자산 조회 실행 모두 실패0. resume 수정 후 구문검사만 실행했고 동일 네트워크검사를 반복하지 않았다. resume은 동일 checkpoint의 이전 결과를 재사용하고 chunk별 원자적 저장, checkpoint 불일치 STOP. 실행 코드만 추가했으며 공개 UI 배포 검증을 새로 수행했다고 주장하지 않는다.
