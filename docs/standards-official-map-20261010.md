# 운영 기준의 공식 근거와 적용 범위

확인일 2026-10-10. 이 표는 현재 여행 홈과 작성 준비 도구에 적용하는 기준의 근거다. 쿠폰 사용 성공, 건강 효과, 입국 적격성, 검색 색인 성공을 대신 입증하지 않는다. 도구 예산·재시도·업무 역할은 LandReady 자체 운영 정책으로 구분한다.

| 영역 / 후보 | 공식 문서 | 현재 적용 / 한계 |
|---|---|---|
| 검색 의도·실용성·중복·저성과 C1/C2/C3/C5/C51/H1/H3/H30 | [Google 사용자 중심 콘텐츠](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | 여행 준비 목적의 도구 제공, 기존 경로 수정. 검색 순위만을 목적으로 글 수를 늘리거나 날짜를 변경하지 않는다. 현재 공개 글 0개라 저성과 글 선정 대상은 없다. 사용자 승인 삭제는 저성과 삭제 판단과 별개다. |
| 탐색 C6/C7/H19/H20 | [Google SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | 홈 경로 선택, 폼의 홈 복귀·공식 제출·입국/세관/안전 링크. 별도 허브 페이지 수는 요구하지 않는다. |
| 제목·대표 주소 C25/C26/C35/H16/H21 | [제목 링크](https://developers.google.com/search/docs/appearance/title-link), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | 실제 화면 목적과 검색용 정보 일치, 검증된 국가 코드만 canonical에 포함. 사용자 요청으로 폐기한 이전 주소의 외부 링크 유지까지 보장하지 않는다. |
| 차단·사이트맵 C19/C27/C28/H15/H16 | [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [사이트맵](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | 작성 도구의 noindex 유지. 현재 공개 글과 sitemap 글 URL 각각 0. 제출·수집·색인·노출은 별도 상태다. |
| 이미지 C34/C36/H24 | [Google 이미지 안내](https://developers.google.com/search/docs/appearance/google-images), [법무성 자료 이용](https://www.moj.go.jp/hisho06_00280.html) | 의미 있는 양식 alt, 치수, 지연 로딩, 공식 출처와 자체 가공 표시. 전체 이미지의 권리 판단을 HTTP 성공으로 대체하지 않는다. |
| 확대·키보드·터치 C39/C40/C41/H25 | [W3C 글자 확대](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [키보드](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [최소 타깃](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | 4개 너비·Tab·방향키·날짜 버튼 검사. 전체 WCAG 인증이나 실제 200% 확대 성공은 주장하지 않는다. |
| 성능 C37/C38/H25 | [Web Vitals](https://web.dev/articles/vitals) | 초기 로딩·실험실/브라우저 관찰과 실제 사용자 CWV를 분리한다. 실제 표본은 대기다. |
| 검색 상태·성과 C20/C21/C22/C24/C42/C43/C44/H10/H11/H12/H13/H29 | [Search Console](https://support.google.com/webmasters/answer/9128668), [네이버 가이드](https://searchadvisor.naver.com/guide), [Bing 도움말](https://www.bing.com/webmasters/help) | 등록·소유·제출 증거와 미인증·데이터 처리 상태를 분리. 수집을 기다린다는 이유로 재등록·재제출하지 않는다. |
| 변경 알림 검토 C23/H14 | [IndexNow](https://www.indexnow.org/documentation?hl=en) | 같은 호스트의 다른 keyLocation도 허용됨. Blogger에서 유효한 키 파일 경로 미확보, 알림 전송 0. noindex 도구를 대체 색인 대상으로 사용하지 않는다. |
| 홍보 태그 C48 | [Google 캠페인 URL](https://support.google.com/analytics/answer/10917952) | `promotionLink`는 고정된 비개인 식별 태그와 경로를 보존. 실제 게시·수신·유입은 별도다. |
| 근거 C8/C12/C13/C14/H4/H5/H8/C63 | [입국 기록 양식](https://www.moj.go.jp/isa/content/930002136.pdf), [디지털청](https://www.digital.go.jp/en/policies/visit_japan_web), [세관](https://www.customs.go.jp/english/summary/passenger.htm) | `travel-claim-source-map-20261010.md`의 1~14 연결과 범위 검수. 면세·비자·개인별 적격성 자동 판정은 없다. |

개인 입력 비전송, 점검 최대 35요청·동시 3·20초·재시도 0, 유료 허용 예산 0, 실패 지점 확인, 신고·홍보·일정 승인 범위는 자체 정책이다. 이 수치가 공식 기관이 요구한 유일한 표준이라고 표현하지 않는다. 현재 공개 연락처·일정·홍보 채널은 미정이며 임의 생성하지 않는다.

개정: 2026-10-10 현재 여행 범위와 공식 근거 연결 최초 작성. 링크 존재와 문서의 전체 조항 최신 검수는 별도이며 이번 직접 열람은 사용자 중심 콘텐츠·제목·이미지·글자 확대 문서다. 기존 noindex·sitemap·IndexNow·양식 검수 증거를 재사용했다. 다른 링크는 공식 참고 경로로 제공했다.
