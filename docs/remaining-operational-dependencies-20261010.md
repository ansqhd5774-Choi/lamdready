# 여행 사이트 남은 운영 의존 조건

2026-10-10 여행범위 정정. 현재공개대상은LandReady홈과여행준비폼이다. artifacts/legacy-post-removal-20261010.json에서삭제22개공개404/removed=true,publicPostCount=0,PASS_PUBLIC_REMOVAL확인했다. 건강글metadata/alt/홍보/건강원문검수는현재남은조건에서제외한다.95원장status/숫자는변경하지않는다.

| 조건 | 관련 ID | 현재 준비·남은실행 | 완료증거 / 중단조건 |
|---|---|---|---|
| 오류접수연락처없음 | C60/H26 | 사용자가연락처없다고답함. 여행소개/공식근거/검수수정원칙준비. 반복요청/가짜폼생성금지 | 실제접수수단이생길때시험1회수신/처리. 개인정보발송금지. 그전이묶음만대기 |
| 일정미확정 | C62/H32 | 여행public/inventory/source 검사와checkpoint기반실행조건. 주기/시각/비용/통지조건미확정 | 승인일정설정후실제첫실행/결과. 일정저장만반복성공으로보고금지 |
| 여행검색표본없음 | C42/C43/C44/H29 | 현재여행URL의검색어/노출/클릭/기간/변경일확보필요. 삭제건강글성과제외 | 실제표본과비교기간. 표본없음을전체BLOCKER/삭제근거로쓰지않음 |
| 분석실수집미검증 | C45/H27 | 현재여행사이트기존설정/네트워크와허용이벤트수신확인필요. include/script존재만으로계정연동판정금지 | 개인정보없는실제시험수신·운영자/중복/결측/지연구분. 새계정임의생성금지 |
| 실사용성능표본없음 | C38/H25 | 여행홈/폼실험실·화면결과와실사용CWV분리 | 실험실점수를실사용INP/CWV성공으로대체금지 |
| 여행홍보채널미확정 | C48/C49/C50/H28 | promotion-drafts-20261010.md여행1원고/UTM준비. 게시0회 | 실제채널/규칙/게시범위후승인된게시URL/날짜/유입각각확인. 삭제19원고게시금지 |
| 여행주장-공식근거연결 | C8/C12/C13/C14/H4/H5/H8 | 양식14항목·디지털청·세관3원천의문구/위치/검수일/적용범위/불확실성연결 | 양식준비·비자적격성·세관판정구분. 조회200을규정판정성공으로보고금지 |
| Bing소유확인미완료 | C22/H13 | 저장상태등록유지미인증. 실제현재상태먼저읽기 | 새증거가있을때만검증재개. 동일오류/중복등록금지. 소유/제출/색인분리 |
| Google/네이버수집색인미검증 | C20/C21/C24/H10/H11/H12 | 삭제후글0의sitemap과현재여행홈상태를제공자리포트에서확인 | 등록/제출/수집/색인/노출/유입분리. 과거22글검사를현재수집증거로쓰지않음 |
| IndexNow지원경로 | C23/H14 | Blogger소유키경로·지원·예산확인후적용여부결정 | 공식지원/키소유응답. noindex폼을대체색인대상으로변경금지 |
| 여행탐색·이미지잔여 | C6/C7/C34/C36/C37/H19/H20/H24 | 현재여행홈/폼/공식안내/여행자산만대상목록화 | 실제현재링크/alt/치수/디코딩/권리. 삭제건강링크313개/이미지139개를현재잔여로검사하지않음 |

## 기존 공식 링크 재사용

새원문조회없이기존site-operations/review-sources의링크를재사용했다. 최신규정·전체검수완료를주장하지않는다.

- [일본입국기록양식](https://www.moj.go.jp/isa/content/930002136.pdf)
- [Visit Japan Web 공식안내](https://www.digital.go.jp/en/services/visit_japan_web-en)
- [실제공식제출](https://www.vjw.digital.go.jp/main/)
- [일본세관입국자안내](https://www.customs.go.jp/english/summary/passenger.htm)
- [Google noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [IndexNow](https://www.indexnow.org/documentation)
- [GeoNames도시원천](https://download.geonames.org/export/dump/cities15000.zip):기존CC BY4.0범위,모든도시목록아님.

## 현재값 없는 조건 처리

연락처없음은이미답변된조건이므로반복요청하지않는다. 일정/분석/외부게시조건이필수인해당단계만대기하며여행기술·UI·공식근거·탐색검사는계속한다. 빈값에가짜연락처·일정·수신성공·유입을채워완료처리하지않는다.

## 과거 실행 오류 이력

이전건강22글검수·metadata/alt개선·19홍보준비는현재여행작업으로확대한오류였다. 과거증거는보존하되현재작업목록에서제외한다. 이번정정은복구/재게시/건강주장수정승인이아니다. 실제삭제증거를무효화하거나재삭제하지않는다. GUI·배포·commit·95원장상태/숫자수정없음.
