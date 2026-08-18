# Kayam FE — Design

Implements `requirements.md`. React + TypeScript + Vite + MUI. Consumes the BE contract defined in `dev/.adlc/spec/kayam-web-prototype/design.md`.

## 1. Project Structure

```
src/
  api/              # thin fetch wrappers + React Query hooks, one file per BE resource
    config.ts       # useConfig() — GET /api/config, the app-boot fetch
    checkins.ts      # useCreateCheckin(), useUploadUrl()
    wallet.ts, redemptions.ts, community.ts, insights.ts
  theme/
    kayamTheme.ts   # createTheme() with flame/teal/gold palette tokens
  components/
    shell/           # BottomNav, ScreenShell, StatusHeader — shared chrome
    checkin/
      CheckinForm.tsx        # the generic schema-driven renderer (core of US-2)
      fields/                # NumberField, TextField, SelectField, PhotoField, ExerciseListField
    onboarding/
    wallet/
    community/
    insights/
  lib/
    imageCompress.ts # Canvas-based resize/compress utility (US-4 AC2)
    posthog.ts        # init + identify wiring
  routes/            # screen-to-screen navigation (React Router) — FE-owned, not config-driven
  App.tsx
```

## 2. The Generic Check-in Form Renderer (core piece)

```tsx
type FieldType = 'number' | 'text' | 'select' | 'photo' | 'exercise_list';

interface FieldDef {
  key: string;
  type: FieldType;
  label: string;
  unit?: string;
  options?: string[];   // for 'select'
}

function CheckinForm({ schema, onSubmit }: { schema: FieldDef[]; onSubmit: (values: Record<string, unknown>) => void }) {
  // one switch over field.type -> the matching field component
  // values accumulate in a single form state object keyed by field.key
  // photo fields route through imageCompress.ts + the pre-signed-upload flow before
  // their value becomes a URL string in the submitted payload
}
```

This is the one component every vertical's check-in screen renders through. Adding "Diet" support meant seeding a `verticals` row with a schema using `select` + `photo` — zero new FE components were required for that vertical specifically, only the underlying field-type components (`select`, `photo`) which already existed for other verticals.

## 3. Data Fetching

React Query throughout:
- `useConfig()` — fetched once, cached for the session; every screen that needs verticals/challenges/redemption_items reads from this cache, never a parallel fetch.
- Mutations (`useCreateCheckin`, `useRedeem`) invalidate the relevant queries (`streaks`, `wallet-balance`) on success so the UI reflects the update without a manual refetch call scattered per screen.

## 4. Photo Upload Flow (client side)

```
1. User captures/selects photo (getUserMedia or <input capture>)
2. imageCompress.ts: draw to canvas at capped long-edge dimension, re-encode JPEG ~0.75 quality
3. If compressed size > cap (e.g. 2MB): show retry message, do not proceed
4. Request pre-signed upload URL: POST /api/uploads/request { contentType }
5. PUT the compressed blob directly to the returned Storage URL (not through the BE)
6. Submit checkin with metric_data.photo_url = the final public URL
```
Step 5 going directly to Storage (not proxied through the Go BE) keeps the BE from ever handling photo bytes at all — it only ever issues and later references URLs.

## 5. Theme

`kayamTheme.ts` maps the Claude Design mockup tokens onto MUI's palette:
```ts
createTheme({
  palette: {
    primary:   { main: '#ff5a1f' },  // flame
    secondary: { main: '#0e7c7b' },  // teal — verification/trust states
    warning:   { main: '#b9860a' },  // gold — coin/reward states
  },
  typography: {
    fontFamily: "'Karla', -apple-system, sans-serif",
  },
})
```
Streak numerals and the circular camera CTA are custom styled components (not MUI primitives stretched to fit) — consistent with the "don't fight MUI for off-brand elements" tradeoff in the root design doc.

## 6. Analytics Wiring

```ts
// on login success:
posthog.identify(user.id);
// on key actions:
posthog.capture('challenge_joined', { challenge_id, vertical });
posthog.capture('checkin_completed', { vertical, streak_after });
posthog.capture('redemption_made', { redemption_item_id, type });
```
Autocapture handles generic screen-view/click tracking; explicit `capture()` calls are reserved for the events that map to actual funnel steps worth measuring.

## 7. Testing Strategy

- **Unit**: `imageCompress.ts` (output size/dimension assertions against fixture images), `CheckinForm` (renders correct field component per `type`, collects values correctly) — pure logic, no network.
- **Integration**: mock `GET /api/config` responses (including a schema using every field `type`) and assert the full onboarding → check-in → dashboard-update loop works against the mock, for at least two different verticals, proving the generic renderer genuinely generalizes rather than accidentally special-casing "reading."
- **Manual**: real mobile device smoke test per build-order stage (root `tasks.md` T9) — camera capture and compression specifically need real-device verification, not just a desktop browser's synthetic camera.
