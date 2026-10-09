# 홍보용 원고와 UTM 초안

2026-10-10. 준비 원고이며 게시·외부 발송·분석 연결은 하지 않았다. 채널 미확정 상태다. 각 채널 규칙·게시 권한·글자수·링크 정책 확인 후 실제 채널에 맞게 편집한다. 유료 홍보 예산은0이며 새 광고 집행은 이 초안에 포함하지 않는다.

## 여행 준비 도구 원고

일본 입국 신고서의14개 항목을 번호별로 확인하고 작성 내용을 준비하세요. 이름 영문 변환, 생년월일 선택, 거주 국가·도시 선택과 항목별 복사를 제공합니다. 실제 신고 제출은 공식 Visit Japan Web에서 진행합니다. 영문 이름은 여권 표기와 대조해야 합니다.

원문: https://landready-assets.ansqhd5774.workers.dev/trip?lang=ko&origin=KR&destination=JP
홈: https://landready.blogspot.com/
공식 제출: https://www.vjw.digital.go.jp/main/

입력·변환·복사는 작성 준비 기능이다. 공식 제출·승인·입국 가능·규정 충족을 보장하는 표현을 사용하지 않는다. 작성 도구의 intentional noindex를 홍보 때문에 변경하지 않는다.

## UTM 명명표

| 필드 | 초안 규칙 | 예시 / 적용 조건 |
|---|---|---|
| utm_source | 실제 채널의 소문자 slug만 사용 | naver_cafe / kakao / newsletter 등은 후보일 뿐 현재 사용 채널 아님 |
| utm_medium | 실제 방식 구분 | community / messaging / email / social; 광고 집행 없으면 paid 사용 금지 |
| utm_campaign | 목적과 콘텐츠 묶음 | landready_jp_preparation 또는 legacy_content_202610; 실제 게시 시 확정 |
| utm_content | 원고 식별자 | jp_entry_14_fields / post_01_amaranth; 사용자·계정·입력값 제외 |
| utm_term | 현재 사용하지 않음 | 실제 검색광고 없는 상태에서 검색어를 임의 수집하지 않음 |

초안 링크에 가상의 채널 값을 붙여 발행하지 않는다. 채널 결정 후 기존 query lang/origin/destination을 보존하고 URLSearchParams로 UTM만 추가한다. canonical은 UTM을 포함하지 않으며 입력 이름·주소·전화·생년월일·서명·개인식별정보를 URL에 넣지 않는다. 공식 Visit Japan Web 링크에는 자체 홍보용 UTM을 붙이지 않는다. UTM이 있는 링크를 만들었다는 사실은 실제 유입 수집 성공이 아니다.

게시 실행 원장 필드: draft_id / original_url / channel / utm_source / utm_medium / utm_campaign / utm_content / permission_scope / posted_at / posted_url / public_check / visits_measurement_state. 실제 게시 전 중복 게시 URL 여부 확인. 실패 시 사이트·게시함을 먼저 확인하고 무조건 재전송하지 않는다.

## 기존 건강·뷰티 글 중립 원고19개

아래는 영어 원문 본문 주제를 요약한 문장이다. 효능·치료·섭취량의 의학적 검증 결과가 아니며 보장 표현을 추가하지 않는다. 건강·뷰티와 관련된 채널에서만 후보로 검토하고 여행 준비 홍보에 끼워 넣지 않는다. 기존 제목은 원문 식별용이며 제목 자체의 효과 보장을 신규 홍보 문구로 재사용하지 않는다.

### post_01 — Amaranth

This article discusses amaranth, including history, nutrients, recipes and freshness.

원문: [Let's succeed in dieting with Amaranth!!](https://landready.blogspot.com/2023/11/lets-succeed-in-dieting-with-amaranth.html)

### post_02 — Phytosterols

This article discusses phytosterols, including food sources, intake and side-effect questions.

원문: [Let's learn about phytosterols efficacy and diet.](https://landready.blogspot.com/2023/11/lets-learn-about-phytosterols-efficacy.html)

### post_03 — Makeup primer

This article discusses makeup primer, including application, skin types, ingredients and product selection.

원문: [Essential for perfect makeup!!! Primer!](https://landready.blogspot.com/2023/11/essential-for-perfect-makeup-primer.html)

### post_04 — Brewer’s yeast

This article discusses brewer’s yeast, including production, dietary uses, intake and supplements.

원문: [Diet and hair loss in one go with Beer Yeast!](https://landready.blogspot.com/2023/11/diet-and-hair-loss-in-one-go-with-beer.html)

### post_05 — Catechins

This article discusses catechins, including tea, food sources, intake and dietary questions.

원문: [The efficacy of catechin and the secret to diet success!!](https://landready.blogspot.com/2023/11/the-efficacy-of-catechin-and-secret-to.html)

### post_06 — Banana leaves

This article discusses banana leaves, including cultural background, cooking uses and freshness.

원문: [Secret of Banana Leaf Diet! The appeal of new foods that take care of health and the environment at the same time](https://landready.blogspot.com/2023/11/secret-of-banana-leaf-diet-appeal-of.html)

### post_09 — Tart cherry

This article discusses tart cherry, including history, nutrients and sleep and skin questions.

원문: [Revitalize Your Sleep and Skin: The Tart Cherry Revolution for Better Health](https://landready.blogspot.com/2023/11/revitalize-your-sleep-and-skin-tart.html)

### post_10 — Kakadu plum

This article discusses kakadu plum, including Australian background, nutrients and dietary uses.

원문: [Unlock the Power of Kakadu Plum: The Ultimate Guide to Australia's Vitamin C Superfruit!](https://landready.blogspot.com/2023/11/unlock-power-of-kakadu-plum-ultimate.html)

### post_11 — Arginine

This article discusses arginine, including physiological roles, food sources and circulation questions.

원문: [Unlocking the Power of Arginine: Boost Your Blood Circulation and Prevent Hypertension!](https://landready.blogspot.com/2023/11/unlocking-power-of-arginine-boost-your.html)

### post_12 — Lactoferrin

This article discusses lactoferrin, including milk sources, iron, intake and supplement questions.

원문: [Iron deficiency? Lactoferrin is responsible! No iron deficiency!](https://landready.blogspot.com/2023/11/iron-deficiency-lactoferrin-is.html)

### post_14 — Ketogenic diet

This article discusses ketogenic diet, including carbohydrate restriction, ketosis and weight-management questions.

원문: [The Ultimate Guide to Rapid Weight Loss: Unleash the Power of the Keto Diet!](https://landready.blogspot.com/2023/11/the-ultimate-guide-to-rapid-weight-loss.html)

### post_15 — Freckles / pigmentation

This article discusses freckles / pigmentation, including skin changes, possible causes and care questions.

원문: [Unveiling the Truth Behind Freckles: Understanding Pigmentation and Melanin](https://landready.blogspot.com/2023/11/unveiling-truth-behind-freckles.html)

### post_16 — Dead skin cells

This article discusses dead skin cells, including keratinization, skin changes and exfoliation.

원문: [Reveal Your Radiant Skin: Say Goodbye to Dead Skin Cells!](https://landready.blogspot.com/2023/11/reveal-your-radiant-skin-say-goodbye-to.html)

### post_17 — Acne

This article discusses acne, including causes, types and daily skin-care questions.

원문: [Here's how to completely overcome acne skin!!](https://landready.blogspot.com/2023/11/heres-how-to-completely-overcome-acne.html)

### post_18 — Hair loss

This article discusses hair loss, including causes, types, daily habits and treatment questions.

원문: [What is the key to preventing hair loss? Let's get out of hair loss in one shot!](https://landready.blogspot.com/2023/11/what-is-key-to-preventing-hair-loss.html)

### post_19 — Chin fat / jowls

This article discusses chin fat / jowls, including possible causes, skin changes and management questions.

원문: [If you want to lose chin fat, solve it with this article!!!](https://landready.blogspot.com/2023/11/if-you-want-to-lose-chin-fat-solve-it.html)

### post_20 — Wrinkles

This article discusses wrinkles, including skin aging, possible causes and daily care.

원문: [How much do you know about wrinkles???](https://landready.blogspot.com/2023/11/how-much-do-you-know-about-wrinkles.html)

### post_21 — Radiation and contaminated water

This article discusses radiation and contaminated water, including radiation, contaminated water and public safety questions.

원문: [The effects of radioactive water on our bodies!! (2023)](https://landready.blogspot.com/2023/11/the-effects-of-radioactive-water-on-our.html)

### post_22 — Sunscreen

This article discusses sunscreen, including ingredients, application and product-selection questions.

원문: [Perfect skin protection! Create brilliant skin with the best sunscreen](https://landready.blogspot.com/2023/11/perfect-skin-protection-create.html)

## 보류와 실제 게시 전 조건

Kamut·Wheatgrass·Goat milk 3개는 제목/본문 주제 충돌로 홍보 원고에서 제외했다. 2023 방사능 글은 과거 글로만 식별하며 현재 안전 판단·최신 규정 안내로 표현하지 않는다. 나머지 원고도 기존 본문 사실검증 미완료이므로 치료·질병예방·감량 보장이나 구체적 복용 권고를 덧붙이지 않는다.

검증: 원고19개는 data/post-description-candidates.json의 applyEligible=true만 선택. 여행 원고는 현재 구현 기능·공식 제출 분리 기준만 사용. 외부 게시0회, 조회·공유·실제 사용 성공 주장 없음.
