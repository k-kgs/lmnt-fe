# Kayam FE — Implementation Tasks

Implements `design.md`. Ordered to match the root build-order stages (`dev/.adlc/spec/kayam-web-prototype/design.md` §8) so FE and BE work lands in the same testable increments.

## Stage 1 — Foundation
- [ ] T1. Scaffold Vite + React + TypeScript project; install MUI, React Query, React Router, PostHog JS SDK.
- [ ] T2. `kayamTheme.ts` — palette + typography tokens per `design.md` §5.
- [ ] T3. `lib/posthog.ts` — init on app load; wire `identify()` into the auth success path once BE auth exists.
- [ ] T4. `api/config.ts` — `useConfig()` hook; a minimal screen that fetches and dumps the config response, to prove the FE↔BE contract works before building real UI on top of it (matches root task T8).
- [ ] T5. Deploy skeleton to Vercel/Netlify pointed at the deployed BE skeleton; confirm the round-trip in production (root task T7).

## Stage 2 — Core Loop (all four seeded verticals)
- [ ] T6. Onboarding screens: Welcome → Choose Your Path (Join Challenge / Set My Own Goal) → path-specific setup → permission moment → first check-in.
- [ ] T7. `components/checkin/CheckinForm.tsx` + all field components (`NumberField`, `TextField`, `SelectField`, `PhotoField`, `ExerciseListField`) per `design.md` §2.
- [ ] T8. `lib/imageCompress.ts` — capped-dimension resize + JPEG re-encode; unit tests against fixture images.
- [ ] T9. Pre-signed upload flow (`design.md` §4) wired into `PhotoField`.
- [ ] T10. Home/dashboard screen: streak, coin balance, camera-first CTA, before/after in-place update on successful check-in.
- [ ] T11. Integration test: full onboarding → check-in → dashboard loop against a mocked config response covering at least two verticals (e.g. Reading and Weight) to prove the generic renderer actually generalizes.
- [ ] T12. Manual mobile smoke test across all four verticals (Reading, Fitness/Gym, Weight, Diet) on a real device.

## Stage 3 — Wallet + Redemption
- [ ] T13. Wallet home: coin balance + ₹ equivalent, transaction history.
- [ ] T14. Redeem hub: vouchers list + expert-consultation list, both sourced from `redemption_items` in config.
- [ ] T15. Voucher redemption flow: redeem → code/confirmation screen.
- [ ] T16. Expert booking flow: expert list → slot pick → confirmation (no real calendar/video integration, per root scope).
- [ ] T17. Client-side balance check before allowing a redemption attempt (in addition to BE's authoritative check).

## Stage 4 — Progress/Insights + Community
- [ ] T18. Progress screen: trend chart + "on pace" insight, rendered from BE aggregate response.
- [ ] T19. Scope-of-improvement screen: weekday/weekend (or vertical-specific) breakdown + insight text from BE response.
- [ ] T20. Community: challenge detail + friends-only leaderboard.

## Stage 5 — Polish
- [ ] T21. Full mobile responsiveness pass across every screen built in stages 2-4.
- [ ] T22. Visual QA against the Claude Design mockups for palette/type/spacing consistency.
- [ ] T23. Final production deploy for feedback distribution.
