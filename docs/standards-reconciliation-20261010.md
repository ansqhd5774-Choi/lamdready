# 95개 기준 재대조와 미완료 61개 실행 묶음

2026-10-10. 현재 main 5287f92 및 실제 파일·저장된 공개 증거 대조. 이번 담당은 조회·문서 작성만 수행했으며 새 Provider 조회·GUI·배포·원장 수정은 하지 않았다. 시작 변경 상태는 docs/incomplete-61-progress-20261010.md 미추적 1개였으며 보존했다.

현재 원장: 95개, 적용 대상93개, IMPLEMENTED_SCOPED32개, STANDARD_DEFINED43개, DEFERRED16개, PROVIDER_VERIFICATION_ERROR2개, EXCLUDED2개. C/H 중복 포함 숫자이며 독립 기능95개 또는 full완료32개를 뜻하지 않는다. runtimeVerified=false는 전체 후보 완료 미주장 계약으로 유지한다.

## 중복과 실제 실행 단위

| 실행 묶음 | 관련 ID | 미완료 핵심 |
|---|---|---|
| 검색 의도·실용 정보 | C1/C2/C5/H1 | 공개 글별 제목과 실제 질문·답 대조 |
| 중복·URL 보호 | C3/C35/C51/H3/H30 | 검색 의도 중복 검수 및 이전 공유 주소 영향 |
| 탐색·관련·허브 | C6/C7/H19/H20 | 도달 검증과 내용상 연결 품질은 별개 |
| 근거·조건·충돌 | C8/C12/C13/C14/H4/H5/H8 | 원천3개 조회 이후 실제 주장 대조 |
| Bing·IndexNow | C22/H13/C23/H14 | Bing 미인증; Blogger 키 경로 결정 |
| SEO·렌더링 | C27/C30/H16/H17 | 공개 URL 전수 metadata와 검색 제공자 렌더링 |
| 브랜드·이미지·로딩 | C32/C34/C36/C37/H24 | 브랜드는 실제 이전; 전체 글 이미지권리·waterfall 잔여 |
| 성능·접근성 | C38/C40/C41/H25 | 실험실·실사용 구분, 전 경로 키보드·확대·대비 |
| 검색 성과 | C42/C43/C44/H29 | 검색 표본 대기, 표본 없이 성과 판단 금지 |
| 분석·UTM·홍보 | C45/C48/C49/C50/H27/H28 | 계정 설정·수집 검증·채널 승인; 외부 게시 임의 실행 금지 |
| 실행·증거·복구 | C9/C52/C53/C54/C56/C57/H31 | 현재 범위는 실제 증거 존재; 글별 변경 근거 및 타 운영 작업 잔여 |
| 신뢰·비용·일정·기준 | C60/C61/C62/C63/H26/H32 | 연락처·실제 일정·예산 알림·조항 연결 |
| 사용 성공 구분 | C11 | copy_success와 official_link_click 증거 있음; 제출 성공 미검증 |

## 원장 수정 추천

아래 IMPLEMENTED_SCOPED 추천은 현재 실행의 한정된 구현 증거만 추가하는 것이다. 전체 기준 완료나 runtimeVerified=true 변경을 추천하지 않는다. 나머지 상태는 유지하면서 note/evidence를 최신화한다.

| ID | 기존 상태 | 추천 상태 | 완료 범위와 잔여 조건 |
|---|---|---|---|
| C1 | STANDARD_DEFINED | STANDARD_DEFINED | 작성 도구 제목·14개 입력 항목·공식 제출 안내 구현; 잔여: 공개 글별 검색 의도·핵심 정보·입력 안내 대조 |
| C2 | STANDARD_DEFINED | STANDARD_DEFINED | 작성 도구 제목·14개 입력 항목·공식 제출 안내 구현; 잔여: 공개 글별 검색 의도·핵심 정보·입력 안내 대조 |
| C3 | STANDARD_DEFINED | STANDARD_DEFINED | 기존 URL 유지 원칙 존재; 이번 이름 변경에서 글22개 보존; 잔여: 전체 글의 검색 의도 중복 판별·통합 필요 여부 기록 |
| C5 | STANDARD_DEFINED | STANDARD_DEFINED | 작성 도구 제목·14개 입력 항목·공식 제출 안내 구현; 잔여: 공개 글별 검색 의도·핵심 정보·입력 안내 대조 |
| C6 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 링크 및 홈에서22개 글 도달 확인; 잔여: 여행 관련 글·허브 콘텐츠와 다음 질문 연결 검토; 기존 건강 글 임의 변경 금지 |
| C7 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 링크 및 홈에서22개 글 도달 확인; 잔여: 여행 관련 글·허브 콘텐츠와 다음 질문 연결 검토; 기존 건강 글 임의 변경 금지 |
| C8 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 원천3개 조회 및 해시 이력 있음; 잔여: 원천별 주장·조건 매핑과 실제 내용 검수; 조회 성공은 검수 아님 |
| C9 | STANDARD_DEFINED | STANDARD_DEFINED | Git commit·작업별 증거 기록 존재; 잔여: 글별 주요 변경 이유·근거 추적 연결 |
| C11 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | 복사 성공과 공식 이동만 분리; 공식 제출 성공 미검증 |
| C12 | STANDARD_DEFINED | STANDARD_DEFINED | 대상·불명확한 정보 표시 원칙 존재; 잔여: 여행 적용 항목의 대상·효력·조건 근거 검수; 쿠폰 보상 그대로 적용 금지 |
| C13 | STANDARD_DEFINED | STANDARD_DEFINED | 대상·불명확한 정보 표시 원칙 존재; 잔여: 여행 적용 항목의 대상·효력·조건 근거 검수; 쿠폰 보상 그대로 적용 금지 |
| C14 | STANDARD_DEFINED | STANDARD_DEFINED | 충돌 처리·안전 변경 우선 원칙 존재; 잔여: 출처3개 실제 검수 및 충돌·변경 사례 처리 기록 |
| C22 | PROVIDER_VERIFICATION_ERROR | PROVIDER_VERIFICATION_ERROR | 공개 태그 있음, Bing 기존 등록 유지·Not verified 확인; 잔여: 제공자 인증 오류 해소 후 소유 확인·사이트맵 제출; 동일 오류 무조건 재시도 금지 |
| C23 | DEFERRED | DEFERRED | Blogger root key 경로 제약 기록; 작성 도구 의도적 noindex; 잔여: Blogger 지원 가능한 소유권·키 경로 검토 후 적용 여부 결정 |
| C27 | STANDARD_DEFINED | STANDARD_DEFINED | 작성 도구 canonical 및 의도적 noindex 테스트·공개 확인; 잔여: Blogger 홈·글·정적 페이지 robots/noindex/canonical 전수 대조 |
| C30 | STANDARD_DEFINED | STANDARD_DEFINED | 공개 HTML anchor에서22개 글 도달 확인; 잔여: 검색 제공자의 실제 본문·쿠폰 해당 없음·출처 렌더링 확인 |
| C32 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | LandReady 명칭·호스트·저장소 변경 및 실제 자동배포 확인; 전체 글 이미지 브랜드 미검수 |
| C34 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 양식·GeoNames 출처, alt·크기 및 자산검사 있음; 잔여: 전체 공개 글 이미지 관련성·권리·설명·응답 검수 |
| C35 | STANDARD_DEFINED | STANDARD_DEFINED | Blogger22개 글 URL 보존, Github rename; 이전 Worker는 사용자 지시로 종료; 잔여: 남은 외부 공유의 이전 Worker URL 영향 확인; 404를 자동 정상으로 간주하지 않음 |
| C36 | STANDARD_DEFINED | STANDARD_DEFINED | 앞면 highpriority·뒷면 lazy·defer/module·정적 용량 검사; 잔여: 실제 브라우저 waterfall과 홈 blocking script 영향 측정 및 필요한 최소 최적화 |
| C37 | STANDARD_DEFINED | STANDARD_DEFINED | 앞면 highpriority·뒷면 lazy·defer/module·정적 용량 검사; 잔여: 실제 브라우저 waterfall과 홈 blocking script 영향 측정 및 필요한 최소 최적화 |
| C38 | DEFERRED | DEFERRED | 정적 자산 용량만 측정; Lighthouse/실사용 CWV 없음; 잔여: 실험실 LCP/CLS 등과 실제 사용자 INP/CWV를 구분해 측정 |
| C40 | STANDARD_DEFINED | STANDARD_DEFINED | 360/390/1280 넘침·44px높이·날짜창 배치 확인; picker 키보드 구현; 잔여: 키보드 전 경로·확대·대비·포커스·버튼 간섭·전체 글 UI 및 실제 성능 검사 |
| C41 | STANDARD_DEFINED | STANDARD_DEFINED | 360/390/1280 넘침·44px높이·날짜창 배치 확인; picker 키보드 구현; 잔여: 키보드 전 경로·확대·대비·포커스·버튼 간섭·전체 글 UI 및 실제 성능 검사 |
| C42 | DEFERRED | DEFERRED | Google 등록·제출 완료; 저장된 마지막 상태 가져올 수 없음/데이터 처리 중; 잔여: 실제 검색어·노출·클릭 표본 확보, 비교 기간 및 변경일 정의; 실시간 재조회 미실행 |
| C43 | DEFERRED | DEFERRED | Google 등록·제출 완료; 저장된 마지막 상태 가져올 수 없음/데이터 처리 중; 잔여: 실제 검색어·노출·클릭 표본 확보, 비교 기간 및 변경일 정의; 실시간 재조회 미실행 |
| C44 | DEFERRED | DEFERRED | Google 등록·제출 완료; 저장된 마지막 상태 가져올 수 없음/데이터 처리 중; 잔여: 실제 검색어·노출·클릭 표본 확보, 비교 기간 및 변경일 정의; 실시간 재조회 미실행 |
| C45 | DEFERRED | DEFERRED | 페이지 메모리 copy/link 집계는 구현; 잔여: 분석 계정·중복·운영자·결측·지연·고유 방문자·재방문 실제 수집 검사 |
| C48 | STANDARD_DEFINED | STANDARD_DEFINED | UTM 이름 통일 원칙 존재; 잔여: 실제 사용할 채널·캠페인별 이름과 원문 URL 매핑 |
| C49 | DEFERRED | DEFERRED | 홍보 원칙 존재; 외부 게시 실행 없음; 잔여: 홍보할 콘텐츠·채널·게시 승인 범위 확정 후 실제 URL·유입 기록 |
| C50 | DEFERRED | DEFERRED | 홍보 원칙 존재; 외부 게시 실행 없음; 잔여: 홍보할 콘텐츠·채널·게시 승인 범위 확정 후 실제 URL·유입 기록 |
| C51 | STANDARD_DEFINED | STANDARD_DEFINED | 유입만으로 삭제하지 않는 원칙 존재; 잔여: 글별 유효성·중복·독자 효용 판단; 통합·삭제 별도 범위 확인 |
| C52 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | 작업별 구현·검사·배포·Runtime 분리 기록; 장기 운영 결과는 별도 |
| C53 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | 현재 승인 작업의 담당 역할 분리; 모든 운영 조직 정책 완료를 뜻하지 않음 |
| C54 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | 현재 도구 가용성·측정 수단 부재·제공자 오류 분리 기록 |
| C56 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | 링크 checkpoint 재사용 및 기존 검색 등록 확인; 다른 작업 전수 미검증 |
| C57 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | 링크 잔여193개 재개·완료 증거; 모든 운영 실패 복구 완료 아님 |
| C60 | DEFERRED | DEFERRED | 오류 접수 상태 원칙 존재, 공개 연락처 설정 없음; 잔여: 연락처 또는 접수 수단 확정 후 소개·검수·수정 원칙·오류 신고 페이지 구현 |
| C61 | STANDARD_DEFINED | STANDARD_DEFINED | 유료 기능 예산0·조회 제한·무재시도 원칙, 계정 사용량 읽기 확인; 잔여: 조회/집계 중단 조건 적용 범위와 실제 예산 알림 동작 확인; 한도 여유와 지출 승인 구분 |
| C62 | DEFERRED | DEFERRED | 검사 스크립트와 점검 주기 제안 있음; 잔여: 실제 실행 일정·대상·통지·비용 범위 설정 및 반복 실행 확인 |
| C63 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 문서 링크·확인일·개정 이력 존재; 잔여: 각 기준과 공식 문서 조항 연결·개정 검토 |
| H1 | STANDARD_DEFINED | STANDARD_DEFINED | 작성 도구 제목·14개 입력 항목·공식 제출 안내 구현; 잔여: 공개 글별 검색 의도·핵심 정보·입력 안내 대조 |
| H3 | STANDARD_DEFINED | STANDARD_DEFINED | 기존 URL 유지 원칙 존재; 이번 이름 변경에서 글22개 보존; 잔여: 전체 글의 검색 의도 중복 판별·통합 필요 여부 기록 |
| H4 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 원천3개 조회 및 해시 이력 있음; 잔여: 원천별 주장·조건 매핑과 실제 내용 검수; 조회 성공은 검수 아님 |
| H5 | STANDARD_DEFINED | STANDARD_DEFINED | 충돌 처리·안전 변경 우선 원칙 존재; 잔여: 출처3개 실제 검수 및 충돌·변경 사례 처리 기록 |
| H8 | STANDARD_DEFINED | STANDARD_DEFINED | 충돌 처리·안전 변경 우선 원칙 존재; 잔여: 출처3개 실제 검수 및 충돌·변경 사례 처리 기록 |
| H13 | PROVIDER_VERIFICATION_ERROR | PROVIDER_VERIFICATION_ERROR | 공개 태그 있음, Bing 기존 등록 유지·Not verified 확인; 잔여: 제공자 인증 오류 해소 후 소유 확인·사이트맵 제출; 동일 오류 무조건 재시도 금지 |
| H14 | DEFERRED | DEFERRED | Blogger root key 경로 제약 기록; 작성 도구 의도적 noindex; 잔여: Blogger 지원 가능한 소유권·키 경로 검토 후 적용 여부 결정 |
| H16 | STANDARD_DEFINED | STANDARD_DEFINED | 작성 도구 canonical 및 의도적 noindex 테스트·공개 확인; 잔여: Blogger 홈·글·정적 페이지 robots/noindex/canonical 전수 대조 |
| H17 | STANDARD_DEFINED | STANDARD_DEFINED | 공개 HTML anchor에서22개 글 도달 확인; 잔여: 검색 제공자의 실제 본문·쿠폰 해당 없음·출처 렌더링 확인 |
| H19 | DEFERRED | DEFERRED | 공식 링크 및 홈에서22개 글 도달 확인; 잔여: 여행 관련 글·허브 콘텐츠와 다음 질문 연결 검토; 기존 건강 글 임의 변경 금지 |
| H20 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 링크 및 홈에서22개 글 도달 확인; 잔여: 여행 관련 글·허브 콘텐츠와 다음 질문 연결 검토; 기존 건강 글 임의 변경 금지 |
| H24 | STANDARD_DEFINED | STANDARD_DEFINED | 공식 양식·GeoNames 출처, alt·크기 및 자산검사 있음; 잔여: 전체 공개 글 이미지 관련성·권리·설명·응답 검수 |
| H25 | STANDARD_DEFINED | STANDARD_DEFINED | 360/390/1280 넘침·44px높이·날짜창 배치 확인; picker 키보드 구현; 잔여: 키보드 전 경로·확대·대비·포커스·버튼 간섭·전체 글 UI 및 실제 성능 검사 |
| H26 | STANDARD_DEFINED | STANDARD_DEFINED | 오류 접수 상태 원칙 존재, 공개 연락처 설정 없음; 잔여: 연락처 또는 접수 수단 확정 후 소개·검수·수정 원칙·오류 신고 페이지 구현 |
| H27 | DEFERRED | DEFERRED | 페이지 메모리 copy/link 집계는 구현; 잔여: 분석 계정·중복·운영자·결측·지연·고유 방문자·재방문 실제 수집 검사 |
| H28 | DEFERRED | DEFERRED | 홍보 원칙 존재; 외부 게시 실행 없음; 잔여: 홍보할 콘텐츠·채널·게시 승인 범위 확정 후 실제 URL·유입 기록 |
| H29 | DEFERRED | DEFERRED | Google 등록·제출 완료; 저장된 마지막 상태 가져올 수 없음/데이터 처리 중; 잔여: 실제 검색어·노출·클릭 표본 확보, 비교 기간 및 변경일 정의; 실시간 재조회 미실행 |
| H30 | STANDARD_DEFINED | STANDARD_DEFINED | 유입만으로 삭제하지 않는 원칙 존재; 잔여: 글별 유효성·중복·독자 효용 판단; 통합·삭제 별도 범위 확인 |
| H31 | STANDARD_DEFINED | IMPLEMENTED_SCOPED | C52/C53/C54/C56/C57 중복; 현재 실행·복구 범위만 확인 |
| H32 | DEFERRED | DEFERRED | 검사 스크립트와 점검 주기 제안 있음; 잔여: 실제 실행 일정·대상·통지·비용 범위 설정 및 반복 실행 확인 |

8개 상태 전환을 모두 채택하면 IMPLEMENTED_SCOPED40개/미완료53개/제외2개가 된다. 이는 root가 실제 증거 연결·원장 검사를 마친 뒤만 보고할 수 있는 제안 수치다. 현재 확정 원장은32/61/2이다.

## stale 상태와 증거

- C32: 이전 일반 기준 정의보다 실제 브랜드 변경·배포 증거가 앞서 있다. artifacts/landready-rename-final-evidence.md 및 landready-git-deployment-ready.png: main5287f92, Cloudflare Ready, 공개 홍→HONG 검증. 예전 Worker를 종료한 것은 사용자 명시 요청이었다. 기존 주소404를 URL 보존 성공으로 바꾸지 않는다.
- C56/C57/H31: scripts/resume-links.mjs는 동일 checkedAt checkpoint만 허용(CHECKPOINT_MISMATCH_STOP), 완료URL 제외, 최대200개·동시3·20초·무재시도·chunk 저장. docs/operations-parallel-20261010.md와 artifacts/link-audit-resume.json의 잔여193개/총313개/실패0 실행 증거를 재사용한다. 최종 결과 저장은 직접 writeFile이며 chunk 저장만 tmp→rename이다. 모든 저장이 원자적이라는 과장 금지.
- Bing: data/search-status.json registration=REGISTERED_UNVERIFIED_CONFIRMED. 등록 UNKNOWN·로그인 필요는 오래된 상태다. 인증과 현재 도메인 사이트맵은 미완료. 같은 제공자 오류 재시도 금지.
- Cloudflare: 로그인·Git 연결 대기는 해소된 실제 증거가 있다. 자동배포 설정을 아직 대기라고 쓰지 않는다.
- Google/네이버: 현재 저장된 증거만 재사용. 수집·색인·노출 실시간 상태는 이번 담당이 재조회하지 않았다.

## 기존 분석 코드 확인과 개인정보 범위

theme/lamdready-blogger-r1.xml에 AdSense async script와 Blogger google-analytics include가 있다. 파일명은 여전히 이전 철자를 포함하므로 활성 연결인지 또는 과거 보존본인지는 별도 대조 대상이다. 광고 script 존재는 광고 계정 활성·승인·수익의 증거가 아니며 Analytics include 존재도 측정 ID 설정·계정 연결·실제 수집의 증거가 아니다. 이 담당은 비공개 테마 백업이나 개인정보 원자료를 읽지 않았다.

theme/entry-events.js는 페이지 메모리 집계만 수행하며 입력값·URL·저장소·네트워크 전송을 사용하지 않는다. 허용 이벤트는 copy_success(14개 field ID)와 official_link_click뿐이다. local source+기존 공개 copy/click 증거가 있고 고유 방문자·재방문·운영자 제외·중복·결측·지연·장기 보관 통계는 구현하지 않았다. 해당 이벤트에 이름·생년월일·주소·전화·서명 또는 입력 문자열을 붙이면 안 된다. DOM data-lr-action-counts에는 집계값만 있다.

새 분석 계정·외부 게시·접수 서비스·일정 생성은 이 문서 작성으로 실행하거나 승인 범위를 확대하지 않는다. 기존 제공자 연결 여부는 실제 설정/네트워크 증거로 후속 확인해야 한다.

## 검증

미완료 표61개 모두 ID 대조했고 기존95개 unique ID 및93 eligible을 확인했다. 이 담당은 코드 변경·test/build 실행·commit/push·새 공개 검증을 하지 않았다. 근거는 위에서 지정한 실제 파일과 docs/incomplete-61-progress-20261010.md, docs/standards-95.json, data/search-status.json이다.

## Root 실행 반영

8개 전환 제안을 실제 원장에 반영했다. 현재 범위 적용40/미완료53/제외2이며 runtimeVerified=false는 유지한다. 이전 철자 XML은 ignored 과거 보존본이다. 현재 Blogger GUI에서 새로 캡처한 테마는 theme/landready-blogger-r1.xml이며 5개 카테고리 도메인만 수정 후 저장했다. 전체 저장 원자성을 주장하지 않는다.
