import { useEffect, type ReactNode } from 'react';
import { Box, keyframes } from '@mui/material';
import { Day0Shell } from '../../components/day0/Day0Shell';
import { WelcomeStep } from '../../components/day0/WelcomeStep';
import { TrackPickStep } from '../../components/day0/TrackPickStep';
import { TrackingMethodStep } from '../../components/day0/TrackingMethodStep';
import { PivotStep } from '../../components/day0/PivotStep';
import { ChipQuestionStep } from '../../components/day0/ChipQuestionStep';
import { BranchNegativeStep } from '../../components/day0/BranchNegativeStep';
import { RewardKanoStep } from '../../components/day0/RewardKanoStep';
import { MonetizationStep } from '../../components/day0/MonetizationStep';
import { DemographicsStep } from '../../components/day0/DemographicsStep';
import { WaitlistStep } from '../../components/day0/WaitlistStep';
import { ResultStep } from '../../components/day0/ResultStep';
import { useSurveyFlow, POSITIVE_OPTIONS, NEUTRAL_OPTIONS, computePersona } from '../../hooks/useSurveyFlow';
import { useCheckpointSurveyResponse } from '../../api/survey';

const stepIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

function StepTransition({ animKey, children }: { animKey: string; children: ReactNode }) {
  return (
    <Box
      key={animKey}
      sx={{
        animation: `${stepIn} 320ms cubic-bezier(0.16, 1, 0.3, 1)`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }}
    >
      {children}
    </Box>
  );
}

export function SurveyScreen() {
  const { screen, answers, clientId, canGoBack, progress, goTo, goBack, setAnswers, restart, goToNextFromPivot } =
    useSurveyFlow();
  const checkpoint = useCheckpointSurveyResponse();

  // Fires on every screen transition, not just completion — a respondent who
  // quits at question 4 still leaves a completed=false row behind server-side
  // (see api/survey.ts). Resuming after a refresh re-fires for the same
  // clientId, which is a harmless no-op upsert of the same data.
  useEffect(() => {
    checkpoint.mutate({
      ...answers,
      clientId,
      lastScreen: screen,
      completed: screen === 'result',
      personaKey: screen === 'result' ? computePersona(answers).key : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, clientId]);

  const handleRestart = () => {
    restart();
  };

  return (
    <Day0Shell progressPct={progress.pct} progressLabel={progress.label}>
      <StepTransition animKey={screen}>
      {screen === 'welcome' && <WelcomeStep onNext={() => goTo('trackPick')} />}

      {screen === 'trackPick' && (
        <TrackPickStep
          answers={answers}
          onAnswer={setAnswers}
          onNext={() => goTo('trackingMethod')}
          onBack={canGoBack ? goBack : undefined}
        />
      )}

      {screen === 'trackingMethod' && (
        <TrackingMethodStep answers={answers} onAnswer={setAnswers} onNext={() => goTo('pivot')} onBack={goBack} />
      )}

      {screen === 'pivot' && (
        <PivotStep answers={answers} onAnswer={setAnswers} onNext={goToNextFromPivot} onBack={goBack} />
      )}

      {screen === 'branchPositive' && (
        <ChipQuestionStep
          multi
          max={3}
          eyebrow="Good to know"
          question="What's kept you consistent?"
          options={POSITIVE_OPTIONS}
          selected={answers.positiveReasons || []}
          onToggle={(v) => {
            const current = answers.positiveReasons || [];
            const next = current.includes(v) ? current.filter((r) => r !== v) : [...current, v];
            setAnswers({ positiveReasons: next });
          }}
          onNext={() => goTo('rewardKano')}
          onBack={goBack}
        />
      )}

      {screen === 'branchNeutral' && (
        <ChipQuestionStep
          multi
          max={3}
          eyebrow="Good to know"
          question={'What would help you go from “okay” to elite?'}
          options={NEUTRAL_OPTIONS}
          selected={answers.neutralReasons || []}
          onToggle={(v) => {
            const current = answers.neutralReasons || [];
            const next = current.includes(v) ? current.filter((r) => r !== v) : [...current, v];
            setAnswers({ neutralReasons: next });
          }}
          onNext={() => goTo('rewardKano')}
          onBack={goBack}
        />
      )}

      {screen === 'branchNegative' && (
        <BranchNegativeStep
          answers={answers}
          onAnswer={setAnswers}
          onNext={() => goTo('rewardKano')}
          onBack={goBack}
        />
      )}

      {screen === 'rewardKano' && (
        <RewardKanoStep
          answers={answers}
          onAnswer={setAnswers}
          onNext={() => goTo('monetization')}
          onBack={goBack}
        />
      )}

      {screen === 'monetization' && (
        <MonetizationStep
          answers={answers}
          onAnswer={setAnswers}
          onNext={() => goTo('demographics')}
          onBack={goBack}
        />
      )}

      {screen === 'demographics' && (
        <DemographicsStep
          answers={answers}
          onAnswer={setAnswers}
          onNext={() => goTo('waitlist')}
          onBack={goBack}
        />
      )}

      {screen === 'waitlist' && (
        <WaitlistStep onAnswer={setAnswers} onNext={() => goTo('result')} onBack={goBack} />
      )}

      {screen === 'result' && <ResultStep answers={answers} onRestart={handleRestart} />}
      </StepTransition>
    </Day0Shell>
  );
}
