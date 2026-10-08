# 로컬 데이터 러너 R2

로컬 PC 수집 -> local-data 원본/이력 저장 -> 검증 -> 공개 JSON만 GitHub main 전송 -> 기존 Cloudflare Builds 배포 -> Worker 저장 데이터 제공.
Worker는 외부 데이터 제공처를 호출하지 않으며 API 인증키도 사용하지 않는다. 원본과 키는 Git 공개 제외. 환율 요청은 항상 local-runner-snapshot으로 표시하고 7일 초과 자료는 503으로 중단한다.

실행: 프로젝트에서 `powershell -File scripts/run-data.ps1` 한 번.
다른 PC는 Node 22 이상으로 `node scripts/run-data.mjs` 실행. main/원격 주소/깨끗한 작업 트리를 확인하고 수집, 검사, 제한된 데이터 파일 커밋, push를 순서대로 수행한다. 실패하면 push하지 않으며 로컬 파일을 남긴다. 원격 거절은 강제 push하지 않는다.

외교부 인증키는 로컬 프로세스 환경변수 MOFA_SERVICE_KEY에만 제공한다. 채팅/소스/Git/Cloudflare에 저장하지 않는다. 키가 없으면 환율만 수집하며 여행경보 KEY_MISSING을 게시한다. 공개 응답은 정해진 필드만 허용한다. 부분 수집/페이지 누락은 정상으로 처리하지 않는다.

정기 스케줄은 아직 등록하지 않았다. PC가 꺼지면 갱신되지 않는다. 배포 성공과 실제 /api/status, /api/fx 확인을 구분한다. Cloudflare Git 연동은 코드 배포와 동일한 기존 공식 경로를 사용한다.

기존 공식 HTML 원문 수집 scripts/collect-data.mjs는 수동 검수용이다. 외부 403 원천을 반복/우회하지 않는다. 원문 수집은 규정 승인이나 자동 판정이 아니다.
