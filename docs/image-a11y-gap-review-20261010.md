# 이미지 누락 분류·정적 접근성 검산 — 2026-10-10

이 문서는 기존 `artifacts/seo-links-audit.json`의 이미지 누락을 수정 위치별로 분류하고 현재 소스의 명시 색상·컨트롤 크기를 검산한 결과다. Blogger·Worker·CSS 수정, GUI 저장, 배포, 실제 브라우저 렌더링 검증은 수행하지 않았다. 공개 HTML 3개에서 태그 주변 문맥을 확인했고, 해당 작업의 원자료는 `artifacts/image-tag-context.json`이다.

## 이미지 누락은 25개 독립 이미지가 아니다

기존 점검 범위는 홈·22개 글, 총 23문서다. HTML 이미지 태그는 반복 합계 275개, alt 속성 누락 25개, width/height 누락 23개다. 고유 누락 이미지 소스는 3개다.

| 분류 | 태그 위치·파일 | 해당 공개 글 URL | 누락과 판단 | 최소 수정 대상 |
| --- | --- | --- | --- | --- |
| Blogger 생성 공통 추천글 이미지 | `#footer-1 #FeaturedPost1 .post-summary > img.image`, `Amaranth-1.webp` | [홈](https://landready.blogspot.com/)과 기존 22개 글에 반복. 본문 원글은 [Amaranth 글](https://landready.blogspot.com/2023/11/lets-succeed-in-dieting-with-amaranth.html) | 같은 공통 태그가 문서별 23회 alt·width·height 누락. 글마다 본문을 고칠 문제가 아니다. | 현재 GUI 테마의 FeaturedPost1 이미지 생성 태그를 수정하는 후보 |
| 본문 삽화 | 글 본문 `.separator a[imageanchor] > img`, `Cell.webp` | [Wheatgrass 글](https://landready.blogspot.com/2023/11/wheatgrass-benefits-and-effects-when.html) | alt만 누락. width 266 / height 200 / lazy 지정은 이미 있음. 도입 뒤, 2번째 본문 제목 직전 이미지다. | 이 글의 본문 이미지 1개. 실제 그림 내용을 읽고 alt를 작성해야 하며 파일명만으로 의학적 의미를 만들어 넣지 않는다. |
| 본문 삽화 | 글 본문 `.separator a[imageanchor] > img`, `Practice.webp` | [Chin fat 글](https://landready.blogspot.com/2023/11/if-you-want-to-lose-chin-fat-solve-it.html) | alt만 누락. width 320 / height 217 / lazy 지정은 이미 있음. 본문 10번째 제목 직전 이미지다. | 이 글의 본문 이미지 1개. 실제 그림을 확인한 뒤 의미 있는 대체 텍스트 또는 장식 판단을 한다. |
| 기존 아이콘 | `resources.blogblog.com/img/icon18_email.gif` | 기존 원장 24회 반복 | `alt=''`가 존재하므로 누락 25개에 포함되지 않는다. 이메일 아이콘의 주변 링크 접근 가능한 이름까지 이번 분류만으로 확인하지 않았다. | 이미지 alt 누락 수정 대상은 아니다. 링크 이름이 다른 방식으로 제공되는지 별도 확인 대상 |
| 일본 양식 앞·뒤 | `worker/japan-entry.js`의 `.jp-card-photo img`, `.jp-card-back img` | 일본 여행 준비 경로 | 앞·뒤 의미 있는 alt 및 width 1684 / height 1191 지정. 앞면 high priority, 뒷면 lazy. | 기존 속성 유지. HTML 속성 존재는 모바일 가독성·픽셀 표시·사용 권리 전체 검증과 구분 |
| SVG 장식·복사 도형 | `worker/trip.js`, `worker/japan-fields.js`, `worker/japan-entry.js` | 준비 페이지의 로고·방향·복사 버튼 | SVG의 `aria-hidden=true`, 상위 링크·버튼의 aria-label이 소스에서 확인됨. `<img>` alt 누락 원장과 별도 대상이다. | 장식 도형에 불필요한 중복 설명을 추가하지 않는다. 실제 보조기기 발화 검증은 미실행 |

특히 Amaranth의 **본문 이미지**는 이미 `alt='Amaranth'`, width 237 / height 320, lazy 지정이 있다. 누락된 태그는 같은 이미지를 다시 사용하는 **푸터 추천 위젯**이다. 공개 HTML의 태그 문맥으로 두 위치를 구분했다.

### 공통 위젯의 구체적 위치

`backups/blogger-theme-seo-patched-20261010.xml` 2209행은 `<img class='image' expr:src='data:postFirstImage'/>`이다. 같은 FeaturedPost1 content 범위에서 `data:postTitle`이 제목에 사용되므로 대체 텍스트를 연결하는 최소 후보는 `expr:alt='data:postTitle'`다. 이 백업은 위치를 찾기 위한 참고이며, 실제 수정 시에는 현재 GUI 테마를 다시 읽어 기존 사용자 변경을 보존해야 한다.

현재 공개 태그의 실제 이미지 URL은 `artifacts/image-tag-context.json`에 들어 있다. 해당 URL을 직접 디코딩한 결과 **237×320**, JPEG, 30,052B다. 확장자는 `.webp`지만 HTTP Content-Type과 디코딩 형식은 JPEG다. 증거는 `artifacts/footer-image-dimensions.json`이다. `useMostRecentPost=true`이므로 이 치수를 모든 미래 대표 이미지의 실제 비율로 보장할 수 없다. 고정 치수 적용은 현재 대표 이미지 범위로 한정하거나 향후 대표 이미지 변경 시 함께 갱신해야 한다.

본문 삽화 두 개는 장식이라고 단정하지 않았다. 정보 이미지에는 의미에 맞는 대체 텍스트를 제공하고 장식 이미지에는 빈 alt를 적용한다는 판단 기준은 [W3C 비텍스트 콘텐츠 설명](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)에 따른다. 이번에 실제 본문 그림의 의미·권리까지 검수한 것은 아니다.

## 명시 CSS 색상쌍 검산

대상은 변경 전 `theme/landready.css`의 일본 준비 페이지 마지막 명시 규칙이다. 상대 휘도 sRGB 식으로 불투명 색상쌍만 계산했다. 선언 순서·상속·실제 computed style·사용자 설정·반투명 배경의 전체 합성 결과는 측정하지 않았다. 증거 `artifacts/static-contrast-audit.json`.

| 용도 | 전경 / 배경 | 대비 | 정적 판정 |
| --- | --- | ---: | --- |
| 본문·입력 | `#10283c` / `#ffffff` | 15.099 | 일반 문자 기준 이상 |
| 보조 설명 | `#617184` / `#ffffff` | 4.996 | 일반 문자 기준 이상 |
| 입력 placeholder | `#738291` / `#ffffff` | 3.939 | **일반 문자 4.5 미달 후보** |
| 빈 결과 안내 | `#738291` / `#e9f6f7` | 3.562 | **일반 문자 4.5 미달 후보** |
| 실제 결과 | `#10283c` / `#e9f6f7` | 13.654 | 일반 문자 기준 이상 |
| 활성 복사 도형 | `#17636f` / `#e9f6f7` | 6.225 | 대비가 확보된 명시 색상쌍 |
| 예시 칩 | `#99630d` / `#fff3df` | 4.617 | 일반 문자 기준 이상 |
| 오류 안내 | `#a34230` / `#ffffff` | 6.214 | 일반 문자 기준 이상 |
| 포커스 색 | `#21848d` / `#ffffff` | 4.421 | 문자 판정 대상과 구분. 주변 대비·표시 영역 실제 확인 필요 |
| 입력 외곽선 | `#cddfe6` / `#ffffff` | 1.373 | 이것이 컨트롤을 식별하는 유일한 단서인지는 실제 화면에서 판단해야 함 |

11–14px 굵은 글자는 WCAG의 큰 글자 예외로 간주하지 않았다. 일반 문자는 4.5:1이고 placeholder도 문자 대비 점검에 포함된다는 근거는 [W3C 최소 대비 설명](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)이다. 이 표만으로 사이트 전체 WCAG 적합성을 선언하지 않는다. 비활성 복사 버튼 opacity `.3`은 활성 버튼과 상태를 구분해 평가해야 한다.

최소 수정 후보는 CSS 191행 `input::placeholder,textarea::placeholder`와 194행 `output:empty:before`의 `#738291`이다. 기존 보조 설명색 `#617184`로 바꾸면 흰 배경 4.996, 결과 배경 4.5176729로 4.5 이상이다. 수치는 임계값 판단을 위해 반올림하기 전 계산으로 확인했다. 실제 수정·배포는 이 보고서에 포함하지 않는다.

## 터치·포커스의 정적 확인

- 입력·선택·날짜 열기·날짜 완료/취소·지역 추천 항목은 소스상 높이 또는 최소 높이 44px다. textarea는 최소 66px다.
- 복사·지역 목록 화살표는 32×44px다. [W3C WCAG 2.2 최소 타깃 크기](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)의 24×24px보다 작지 않다. 44×44px와 같은 더 높은 목표를 달성했다고 주장하지 않는다.
- 날짜 dialog 최대 폭 360px, 화면폭에서 32px를 뺀 크기를 선언한다. 선언이 있다고 모든 확대·방향·키보드 화면에서 넘침이 없다고 단정하지 않는다.
- 날짜·목록 화살표·일부 선택 요소의 focus-visible 및 입력 그룹 focus-within 규칙이 있다. 입력 자체의 `outline:none`은 그룹 포커스 표시와 함께 실제 렌더링에서 확인해야 한다.
- 보조 설명 11px는 사용자가 승인한 compact 디자인의 기존 값이다. 이 정적 검사만으로 읽기 편함·200% 확대·브라우저 최소글자 설정·보조기기 탐색의 성공을 선언하지 않는다.

**DONE:** 반복 누락 25/23의 실제 위치 분류, 현재 추천 이미지 실제 치수 확인, 명시 색상쌍 계산, 소스상 터치·포커스 규칙 확인.

**NEXT:** 공통 위젯 수정은 현재 테마 소스에서 진행하고 본문 삽화 2개는 실제 이미지의 의미를 확인한 후 수정한다. placeholder 색상 후보는 적용 후 computed style·PC·모바일에서 검증한다. 이 문서에서는 파일·GUI·배포 변경이나 실제 렌더링 완료를 보고하지 않는다.
