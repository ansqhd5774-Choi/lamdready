# API와 공식 데이터 확정 R1

기준일: 2026-10-09 KST. 공개 GitHub 저장소 운영.

| 분야 | 확정 원천 | 인증/사용 범위 | 현재 구현 |
|---|---|---|---|
| 여행 예산 환율 | Frankfurter v2 / ECB | 키 없음, 일일 참고환율 | 실제 8통화 수집, Cloudflare API와 환산 UI |
| 여행경보 | 외교부 국가·지역별 여행경보 (15076237) | 활용승인 및 공공데이터포털 인증키 | 서버 어댑터 구현, 키와 Provider 실응답 미검증 |
| 입국 준비·세관 | 일본·싱가포르·태국·호주 공식 기관 | 공개 HTML, 원문/약관 준수 | 8개 원천 수집 시도, 해시·시각·HTTP 상태 기록 |
| 한국 귀국 세관·검역 | 관세청·농림축산검역본부 공식 안내 | 원문 검수 필요 | 기존 공식 링크 유지, 자동 판정 미확정 |
| 세관 신고 환율 | 각 관할 세관의 공식 적용환율 | 일반 참고환율과 별도 | 미연결; 예산 환율을 세관 계산에 사용 금지 |
| 한국수출입은행 환율 | 공식 환율 API (3068846) | 은행 발급 authkey 필요 | 예비 원천 확정, 중복 연결은 보류 |
| 비자·수하물·의약품 | 각국 이민·세관·검역 및 이용 항공사 | 통합 무료 공공 API 확인되지 않음 | 공식 원문 검수 방식; 추정 판정 금지 |

## 환율 계약

`GET /api/fx?base=USD&quotes=KRW,JPY`.
EUR 원천 환율을 한 번 수집해 교차 환산한다. 작은 KRW 기준 값의 소수점 반올림 오차를 줄이기 위해 EUR 원천을 사용한다.
8통화: EUR, KRW, USD, JPY, SGD, THB, AUD, CNY. 필요 범위부터 확장한다.
`sourceDate`는 환율 관측일, `fetchedAt`은 실제 수집시각이며 별개다.
캐시 1시간. 실패 시 저장 snapshot을 명시하고, 기준일 7일 초과 자료는 503과 rates=null로 중단한다.
은행 환전/카드 수수료와 관할 세관 환율은 포함하지 않는다. customsRate=false.
금액은 브라우저에서 계산하며 서버에는 통화 코드만 요청한다.
별도 정기 작업은 생성하지 않았다. API 요청 시 최신 자료 수집과 캐시, `npm run collect`로 bounded 원문 수집을 수행한다.

## 여행경보 계약

`GET /api/travel-advice?country=JP` (초기 JP/SG/TH/AU).
Cloudflare Secret `MOFA_SERVICE_KEY`에 디코딩된 인증키를 저장한다. URL 전체·키를 로그/응답/Git에 남기지 않는다.
키 없으면 KEY_MISSING/503, 오류면 UNVERIFIED/503, 정상 응답의 data가 비면 NO_DATA. 경보 없음이나 안전으로 바꾸지 않는다.
Provider 요청: 공식 TravelAlarmService2/getTravelAlarmList2, ServiceKey, returnType=JSON, numOfRows=10, pageNo=1, 국가코드 EQ.
실제 키와 운영 응답 확인 전에는 어댑터를 검증된 여행경보 서비스로 표시하지 않는다.

## 원문 수집

`data/source-status.json`은 수집 결과 메타데이터이며 규정 데이터가 아니다.
원본 HTML은 `artifacts/source-snapshots/`에 보관하고 Git 공개 제외.
fetchedAt과 reviewedAt을 분리. 수집된 HTML은 FETCHED_UNREVIEWED이며 규정 승인으로 사용하지 않는다.
HTTP 403/404 등은 우회하지 않고 원문 수동 검수로 남긴다.
`GET /api/countries`, `/api/sources`, `/api/status`로 연결 상태와 원천을 확인한다.

## 공식 근거

- https://frankfurter.dev/
- https://www.data.go.kr/data/15076237/openapi.do
- https://www.data.go.kr/data/3068846/openapi.do
- 초기 4개 국가 공식 링크: data/countries.js
