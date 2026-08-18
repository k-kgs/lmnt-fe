# Kayam FE — Requirements

Source: `.adlc/context/requirement.md`. Depends on the cross-cutting contract in `dev/.adlc/spec/kayam-web-prototype/design.md` §3 (config-driven content) and §5 (upload flow).

## 1. Overview

A mobile-first React + MUI single-page app implementing all Kayam wireframe flows, rendering verticals/challenges/redemption content from backend config rather than hardcoding it, with client-side photo compression and PostHog-based behavioral tracking.

## 2. User Stories & Acceptance Criteria

### US-1: App boot fetches config, not constants
- AC1: On load, the app calls `GET /api/config` and caches the result (React Query) before rendering any vertical/challenge/redemption-dependent screen.
- AC2: No vertical list, challenge list, or redemption catalog exists as a hardcoded FE constant anywhere in the codebase.

### US-2: Generic schema-driven check-in form
- AC1: One shared form-rendering component reads a vertical's `input_schema` and renders the correct input per field `type` (`number | text | select | photo | exercise_list`).
- AC2: Reading, Fitness/Gym, Weight, and Diet check-ins are all testable through this same renderer with their seeded schemas — no per-vertical bespoke check-in screen component.
- AC3: The same screen shell (streak display, coin payoff, before/after animation) wraps every vertical's check-in regardless of which fields it renders.

### US-3: Onboarding — both paths, equal weight
- AC1: "Join a Challenge" and "Set My Own Goal" are presented as equal-weight options on one screen.
- AC2: Both paths converge to the same next step (permission/setup) without one being meaningfully longer than the other.
- AC3: The first action after setup is a real check-in, not a tutorial screen.

### US-4: Camera-based check-in capture
- AC1: Photo capture uses `MediaDevices.getUserMedia` where available, falling back to `<input type="file" capture="environment">`.
- AC2: Captured/selected photos are compressed client-side (Canvas API, capped long-edge dimension, JPEG re-encode ~75% quality) before any upload request is made.
- AC3: A photo exceeding the size cap after compression is rejected with a clear, specific retry message — not a silent failure or generic error.
- AC4: Upload happens via a pre-signed URL obtained from the BE; the FE never sends binary photo data to the BE's own API — only to the storage bucket directly.

### US-5: Streak/coin update in place
- AC1: After a successful check-in, the streak count and coin balance update on the same screen the user was already on (matching the wireframe's before/after pattern).
- AC2: No forced navigation away from the check-in screen is required to see the result.

### US-6: Wallet & redemption
- AC1: Wallet screen shows coin balance and its real-currency (₹) equivalent together, not coins alone.
- AC2: Voucher redemption and expert-consultation booking are both reachable from one redeem hub, sourced from `redemption_items` in the config response.
- AC3: A redemption that would exceed available balance is prevented client-side with a clear message (in addition to the BE's authoritative rejection).

### US-7: Progress/insights
- AC1: Trend and weekday/weekend-adherence views render from BE-computed aggregate endpoints — the FE does not recompute streak/trend math from raw check-in lists itself.
- AC2: Insight text (e.g. "on pace" / "leaking consistency" callouts) is populated from BE response data, not hardcoded per vertical.

### US-8: Behavioral analytics
- AC1: PostHog is initialized on app load and calls `identify(user_id)` immediately after login.
- AC2: Custom events fire for at minimum: `challenge_joined`, `checkin_completed`, `redemption_made`.
- AC3: Automatic screen-view/click capture is enabled (PostHog's default autocapture), not manually instrumented per element.

### US-9: Mobile-first responsive
- AC1: Every screen is designed and tested primarily at mobile viewport widths first; desktop is a secondary, not primary, target for this phase.
- AC2: The MUI theme is configured with Kayam's palette (flame/teal/gold tokens from the Claude Design mockups) applied via `createTheme`, not ad-hoc inline overrides scattered per component.

## 3. Out of Scope (FE, this phase)

- Server-side rendering / SEO.
- Native app shell (React Native, Capacitor) — pure web only.
- Offline support / service worker caching.
- Real wearable/HealthKit integration UI (mocked entirely).
- Redux or other global client-state libraries — React Query + component state only.

## 4. Resolved Design Decisions

Full rationale in `design.md`:
1. Vite + React + TypeScript, not Next.js.
2. React Query for all server state.
3. One generic schema-driven form renderer over per-vertical bespoke components.
4. MUI as the component library, themed rather than fought against for on-brand elements built as custom styled components.
