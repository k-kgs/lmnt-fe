import { useCallback, useEffect, useMemo, useReducer } from 'react';

// Faithful port of the state machine validated in idea/survey/day0-checkin-v2.html.
// Branching rules, question copy, and persona logic are locked from that prototype —
// this is translation to React idioms, not a redesign.

export type ScreenKey =
  | 'welcome'
  | 'trackPick'
  | 'pivot'
  | 'branchPositive'
  | 'branchNegative'
  | 'branchNeutral'
  | 'rewardKano'
  | 'monetization'
  | 'demographics'
  | 'waitlist'
  | 'result';

export type Track = 'run' | 'gym' | 'weight' | 'other';
export type Satisfaction = 'very' | 'somewhat' | 'neutral' | 'frustrated' | 'veryfrustrated';
export type Branch = 'positive' | 'negative' | 'neutral';
export type KanoValue = 'like' | 'must' | 'neutral' | 'live' | 'dislike';
export type EmailChoice = 'given' | 'skipped';

export interface SurveyAnswers {
  track?: Track;
  trackOther?: string;
  pivotImportance?: string;
  pivotSatisfaction?: Satisfaction;
  branch?: Branch;
  positiveReason?: string;
  neutralReason?: string;
  negativeReasons?: string[];
  rewardKano?: KanoValue;
  monetization?: string;
  age?: string;
  gender?: string;
  email?: string;
  emailChoice?: EmailChoice;
}

export const TRACK_META: Record<Track, { label: string; icon: string }> = {
  run: { label: 'running, walking or trekking', icon: 'footprints' },
  gym: { label: 'your gym / workout routine', icon: 'dumbbell' },
  weight: { label: 'managing your weight', icon: 'scale' },
  other: { label: 'your routine', icon: 'plus-circle' },
};

export const TRACK_OPTIONS: { value: Track; icon: string; label: string }[] = [
  { value: 'run', icon: 'footprints', label: 'Running, walking\nor trekking' },
  { value: 'gym', icon: 'dumbbell', label: 'Gymming' },
  { value: 'weight', icon: 'scale', label: 'Managing my\nweight' },
  { value: 'other', icon: 'plus-circle', label: 'Something else' },
];

export const SHORT_IMPORTANCE = ['Extremely', 'Quite', 'Neutral', 'Not much', 'Not at all'];

export const SHORT_SATISFACTION: { v: Satisfaction; t: string }[] = [
  { v: 'very', t: 'Very' },
  { v: 'somewhat', t: 'Somewhat' },
  { v: 'neutral', t: 'Neutral' },
  { v: 'frustrated', t: 'Frustrated' },
  { v: 'veryfrustrated', t: 'Very frustrated' },
];

export const KANO5: { v: KanoValue; t: string; icon: string }[] = [
  { v: 'like', t: 'Love it', icon: 'heart' },
  { v: 'must', t: 'Expect it', icon: 'check-circle' },
  { v: 'neutral', t: 'Neutral', icon: 'circle-dashed' },
  { v: 'live', t: 'Meh, either way', icon: 'minus-circle' },
  { v: 'dislike', t: 'Dislike it', icon: 'thumbs-down' },
];

export const POSITIVE_OPTIONS = [
  { v: 'routine', t: 'A solid routine', icon: 'calendar-check' },
  { v: 'reminders', t: 'Reminders', icon: 'bell' },
  { v: 'partner', t: 'An accountability partner', icon: 'users' },
  { v: 'tracking', t: 'Tracking progress', icon: 'line-chart' },
  { v: 'other', t: 'Other', icon: 'plus-circle' },
];

export const NEUTRAL_OPTIONS = [
  { v: 'plan', t: 'A clearer plan', icon: 'map' },
  { v: 'accountability', t: 'More accountability', icon: 'users' },
  { v: 'rewards', t: 'Better rewards', icon: 'award' },
  { v: 'time', t: 'More time or energy', icon: 'battery-low' },
  { v: 'unsure', t: 'Not sure yet', icon: 'help-circle' },
];

export const STRUGGLE_OPTIONS = [
  { v: 'motivation', t: 'Lack of motivation or accountability', icon: 'battery-low' },
  { v: 'forgetting', t: 'Forgetting to log or track progress', icon: 'clock' },
  { v: 'goals', t: 'Goals are too ambitious or lack structure', icon: 'target' },
  { v: 'boring', t: 'Existing apps feel monotonous or boring', icon: 'moon' },
  { v: 'reward', t: 'Lack of tangible reward or recognition', icon: 'award' },
  { v: 'other', t: 'Other', icon: 'plus-circle' },
];

export const MONETIZATION_OPTIONS = [
  { t: "I'd stick with the free version", icon: 'unlock' },
  { t: "Pay a small monthly subscription if it's genuinely good", icon: 'credit-card' },
  { t: 'Earn premium access by redeeming in-app coins', icon: 'coins' },
  { t: 'One-time purchase, no subscription', icon: 'package' },
];

export const AGE_OPTIONS = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+', 'Prefer not to say'];
export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export const BASE_COINS = 50;
export const EMAIL_BONUS_COINS = 50;

const SCREEN_RANK: Record<Exclude<ScreenKey, 'welcome' | 'result'>, number> = {
  trackPick: 1,
  pivot: 2,
  branchPositive: 3,
  branchNegative: 3,
  branchNeutral: 3,
  rewardKano: 4,
  monetization: 5,
  demographics: 6,
  waitlist: 7,
};
export const TOTAL_QUESTIONS = 7;

export function trackLabel(answers: SurveyAnswers): string {
  if (answers.track === 'other' && answers.trackOther) return answers.trackOther.toLowerCase();
  return answers.track ? TRACK_META[answers.track].label : 'your routine';
}

export function kanoScore(v: KanoValue | undefined): number {
  const order: Record<KanoValue, number> = { like: 2, must: 2, neutral: 0, live: -1, dislike: -2 };
  return v ? order[v] : 0;
}

export function branchFromSatisfaction(sat: Satisfaction | undefined): Branch {
  if (sat === 'very' || sat === 'somewhat') return 'positive';
  if (sat === 'neutral') return 'neutral';
  return 'negative';
}

export interface Persona {
  key: 'streaker' | 'optimizer' | 'comeback' | 'starter';
  icon: string;
  name: string;
  colorToken: 'sunrise' | 'plum' | 'sky' | 'sage';
  line: string;
  tip: string;
}

export function computePersona(answers: SurveyAnswers): Persona {
  const rewardLovesIt = kanoScore(answers.rewardKano) >= 2;

  if (answers.branch === 'positive' && rewardLovesIt) {
    return {
      key: 'streaker',
      icon: 'flame',
      name: 'The Streaker',
      colorToken: 'sunrise',
      line: "You've already got momentum — you just need something that keeps proving it to you.",
      tip: "day0's streak-freeze days are built for people exactly like you: consistency without burnout.",
    };
  }
  if (answers.branch === 'positive') {
    return {
      key: 'optimizer',
      icon: 'bar-chart-3',
      name: 'The Quiet Optimizer',
      colorToken: 'plum',
      line: "You don't need hype, you need proof — real numbers, not vibes.",
      tip: "day0's verified check-ins exist for exactly this: data you can actually trust, including your own.",
    };
  }
  if (answers.branch === 'negative') {
    return {
      key: 'comeback',
      icon: 'repeat',
      name: 'The Comeback Kid',
      colorToken: 'sky',
      line: "You don't quit trying — you just haven't had a system that quits believing in you either.",
      tip: "day0 never resets your progress to zero. Miss a day, the streak bends — it doesn't break.",
    };
  }
  return {
    key: 'starter',
    icon: 'sprout',
    name: 'The Starter',
    colorToken: 'sage',
    line: "You're closer to your best self than you think — you just need the right nudge at the right time.",
    tip: "Your first challenge on day0 starts smaller than you'd expect — on purpose.",
  };
}

interface FlowState {
  screen: ScreenKey;
  answers: SurveyAnswers;
  history: ScreenKey[];
  // Generated once per browser and persisted alongside the rest of this state.
  // Lets the backend tell "this respondent progressed" apart from "a new
  // respondent started" via an upsert keyed on this id (see api/survey.ts) —
  // the mechanism that makes drop-off (not just completion) visible server-side.
  clientId: string;
}

type FlowAction =
  | { type: 'GO_TO'; screen: ScreenKey }
  | { type: 'GO_BACK' }
  | { type: 'SET_ANSWERS'; patch: Partial<SurveyAnswers> }
  | { type: 'RESTART' };

const STORAGE_KEY = 'day0_survey_state_v1';

function newClientId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function freshState(): FlowState {
  return { screen: 'welcome', answers: {}, history: [], clientId: newClientId() };
}

// A refresh or closed tab shouldn't lose progress — every dispatch below
// re-persists the whole state (see the effect in useSurveyFlow), and this is
// what's read back on mount. Falls back to a brand-new session on any error
// (private browsing, corrupted JSON, etc.) rather than failing to load.
function loadInitialState(): FlowState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FlowState>;
      if (parsed && parsed.screen && parsed.clientId) {
        return {
          screen: parsed.screen,
          answers: parsed.answers ?? {},
          history: parsed.history ?? [],
          clientId: parsed.clientId,
        };
      }
    }
  } catch {
    // ignore — fall through to a fresh session
  }
  return freshState();
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'SET_ANSWERS':
      return { ...state, answers: { ...state.answers, ...action.patch } };
    case 'GO_TO': {
      if (state.screen === action.screen) return state;
      return { ...state, screen: action.screen, history: [...state.history, state.screen] };
    }
    case 'GO_BACK': {
      if (state.history.length === 0) return state;
      const history = state.history.slice(0, -1);
      const screen = state.history[state.history.length - 1];
      return { ...state, screen, history };
    }
    case 'RESTART':
      // A fresh clientId, deliberately — an abandoned/completed attempt's row
      // stays exactly as it was instead of being overwritten by the retry.
      return freshState();
    default:
      return state;
  }
}

export function useSurveyFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // private browsing / storage full — resuming just won't work, no crash
    }
  }, [state]);

  const goTo = useCallback((screen: ScreenKey) => dispatch({ type: 'GO_TO', screen }), []);
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);
  const setAnswers = useCallback((patch: Partial<SurveyAnswers>) => dispatch({ type: 'SET_ANSWERS', patch }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);

  const canGoBack = state.history.length > 0;

  const progress = useMemo(() => {
    if (state.screen === 'welcome') return { pct: 0, label: 'Day 0 Check-In' };
    if (state.screen === 'result') return { pct: 100, label: 'Your result' };
    const rank = SCREEN_RANK[state.screen as Exclude<ScreenKey, 'welcome' | 'result'>];
    return { pct: Math.round((rank / TOTAL_QUESTIONS) * 100), label: `Question ${rank} of ${TOTAL_QUESTIONS}` };
  }, [state.screen]);

  const goToNextFromPivot = useCallback(() => {
    const branch = branchFromSatisfaction(state.answers.pivotSatisfaction);
    setAnswers({ branch });
    goTo(branch === 'positive' ? 'branchPositive' : branch === 'neutral' ? 'branchNeutral' : 'branchNegative');
  }, [state.answers.pivotSatisfaction, setAnswers, goTo]);

  return {
    screen: state.screen,
    answers: state.answers,
    clientId: state.clientId,
    canGoBack,
    progress,
    goTo,
    goBack,
    setAnswers,
    restart,
    goToNextFromPivot,
  };
}
