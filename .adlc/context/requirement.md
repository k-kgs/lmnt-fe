Frontend for the Kayam web prototype. Mobile-first, React + MUI (use MUI and other design libraries to make the UI appealing).

Renders the Kayam wireframes (built in Claude Design): onboarding (join-a-challenge vs set-my-own-goal), verification/check-in, daily loop/home dashboard, wallet & redemption (vouchers + expert consultation booking), community/leaderboard, and progress/insights (trend charts, scope-of-improvement).

Must render check-in forms and vertical content generically from backend-served config (`GET /api/config`) rather than hardcoding which verticals/challenges/redemption items exist — see the root `.adlc/spec/kayam-web-prototype/design.md` for the full config contract this depends on.

Camera-based check-in should use the browser camera (getUserMedia / file input capture) since verification is mocked for this phase — no real photo AI check, just upload + auto-approve.

Photos must be compressed and size-capped client-side before upload (Canvas API resize + JPEG re-encode, hard size limit with a retry message if exceeded).

Needs PostHog wired in for behavioral analytics (screen views, key taps, funnels, session replay), identified to the logged-in user.

Deployed to Vercel or Netlify (free tier, no card).

Full architecture context and the tables/contracts this depends on live in `dev/.adlc/spec/kayam-web-prototype/`.
