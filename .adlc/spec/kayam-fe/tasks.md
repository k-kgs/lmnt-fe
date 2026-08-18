# Kayam FE — Implementation Tasks

Implements `design.md`. Ordered to match the root build-order stages (`dev/.adlc/spec/kayam-web-prototype/design.md` §8) so FE and BE work lands in the same testable increments.

## Stage 1 — Foundation
- [x] T1. Scaffold Vite + React + TypeScript project; install MUI, React Query, React Router, PostHog JS SDK.
- [x] T2. `kayamTheme.ts` — palette + typography tokens per `design.md` §5.
- [ ] T3. `lib/posthog.ts` — init on app load; wire `identify()` into the auth success path once BE auth exists. Stubbed as a no-op — no PostHog project/API key exists yet.
- [x] T4. `api/config.ts` — `useConfig()` hook; a minimal screen that fetches and dumps the config response, to prove the FE↔BE contract works before building real UI on top of it (matches root task T8).
- [x] T5. Deploy skeleton to Vercel/Netlify pointed at the deployed BE skeleton; confirm the round-trip in production (root task T7). Live at https://lmnt-fe.vercel.app.

## Stage 2 — Core Loop (all four seeded verticals)
- [x] T6. Onboarding screens: Welcome → Choose Your Path (Join Challenge / Set My Own Goal) → path-specific setup → permission moment → first check-in.
- [x] T7. `components/checkin/CheckinForm.tsx` + all field components (`NumberField`, `TextField`, `SelectField`, `PhotoField`, `ExerciseListField`) per `design.md` §2.
- [x] T8. `lib/imageCompress.ts` — capped-dimension resize + JPEG re-encode; unit tests against fixture images. (Pure scaling math extracted and unit-tested; jsdom has no real `<canvas>` so the browser-API-coupled parts aren't unit tested — verified live against the deployed backend instead.)
- [x] T9. Pre-signed upload flow (`design.md` §4) wired into `PhotoField`. Verified live end-to-end: join → presign → PUT to Storage → checkin with `metric_data.photo`.
- [x] T10. Home/dashboard screen: streak, coin balance, camera-first CTA, before/after in-place update on successful check-in.
- [x] T11. Integration test: full onboarding → check-in → dashboard loop against a mocked config response covering at least two verticals (e.g. Reading and Weight) to prove the generic renderer actually generalizes. (`CheckinForm.test.tsx` covers Reading's number-only schema and Fitness's text+exercise_list schema.)
- [ ] T12. Manual mobile smoke test across all four verticals (Reading, Fitness/Gym, Weight, Diet) on a real device. Needs an actual phone — not executable in this environment.

## Stage 3 — Wallet + Redemption
- [x] T13. Wallet home: coin balance + ₹ equivalent, transaction history. (₹ rate is a documented prototype-only display constant — `lmnt-be` has no real conversion rate anywhere.)
- [x] T14. Redeem hub: vouchers list + expert-consultation list, both sourced from `redemption_items` in config.
- [x] T15. Voucher redemption flow: redeem → code/confirmation screen.
- [x] T16. Expert booking flow: expert list → slot pick → confirmation (no real calendar/video integration, per root scope).
- [x] T17. Client-side balance check before allowing a redemption attempt (in addition to BE's authoritative check).

## Stage 4 — Progress/Insights + Community
- [x] T18. Progress screen: trend chart + "on pace" insight, rendered from BE aggregate response. (Trend chart is BE-driven; insight text is computed generically client-side from the adherence numbers since `lmnt-be` has no text-generation endpoint of its own.)
- [x] T19. Scope-of-improvement screen: weekday/weekend (or vertical-specific) breakdown + insight text from BE response.
- [x] T20. Community: challenge detail + friends-only leaderboard. (Full challenge leaderboard, not friends-filtered — the `follows` table was never built, per root design doc's "only build if/when community screens are reached," and friends-only wasn't asked for.)

## Stage 5 — Polish
- [~] T21. Full mobile responsiveness pass across every screen built in stages 2-4. Every screen uses consistent `maxWidth="sm"` containers; no dedicated visual QA pass possible without a working browser tool in this environment.
- [ ] T22. Visual QA against the Claude Design mockups for palette/type/spacing consistency. Not done — the mockup files aren't available in this session/repo.
- [x] T23. Final production deploy for feedback distribution. Auto-deploys to Vercel on every push to `main`.
