import { useEffect, useRef } from 'react';
import { Day0Shell } from '../../components/day0/Day0Shell';
import { WelcomeStep } from '../../components/day0/WelcomeStep';
import { TrackPickStep } from '../../components/day0/TrackPickStep';
import { PivotStep } from '../../components/day0/PivotStep';
import { ChipQuestionStep } from '../../components/day0/ChipQuestionStep';
import { BranchNegativeStep } from '../../components/day0/BranchNegativeStep';
import { RewardKanoStep } from '../../components/day0/RewardKanoStep';
import { MonetizationStep } from '../../components/day0/MonetizationStep';
import { DemographicsStep } from '../../components/day0/DemographicsStep';
import { WaitlistStep } from '../../components/day0/WaitlistStep';
import { ResultStep } from '../../components/day0/ResultStep';
import { useSurveyFlow, POSITIVE_OPTIONS, NEUTRAL_OPTIONS, computePersona } from '../../hooks/useSurveyFlow';
import { useSubmitSurveyResponse } from '../../api/survey';

export function SurveyScreen() {
  const { screen, answers, canGoBack, progress, goTo, goBack, setAnswers, restart, goToNextFromPivot } =
    useSurveyFlow();
  const submit = useSubmitSurveyResponse();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (screen === 'result' && !submittedRef.current) {
      submittedRef.current = true;
      submit.mutate({ ...answers, personaKey: computePersona(answers).key });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const handleRestart = () => {
    submittedRef.current = false;
    restart();
  };

  return (
    <Day0Shell progressPct={progress.pct} progressLabel={progress.label}>
      {screen === 'welcome' && <WelcomeStep onNext={() => goTo('trackPick')} />}

      {screen === 'trackPick' && (
        <TrackPickStep
          answers={answers}
          onAnswer={setAnswers}
          onNext={() => goTo('pivot')}
          onBack={canGoBack ? goBack : undefined}
        />
      )}

      {screen === 'pivot' && (
        <PivotStep answers={answers} onAnswer={setAnswers} onNext={goToNextFromPivot} onBack={goBack} />
      )}

      {screen === 'branchPositive' && (
        <ChipQuestionStep
          eyebrow="Good to know"
          question="What's kept you consistent?"
          options={POSITIVE_OPTIONS}
          selected={answers.positiveReason}
          onSelect={(v) => {
            setAnswers({ positiveReason: v });
            setTimeout(() => goTo('rewardKano'), 240);
          }}
          onBack={goBack}
        />
      )}

      {screen === 'branchNeutral' && (
        <ChipQuestionStep
          eyebrow="Good to know"
          question={'What would help you go from “okay” to elite?'}
          options={NEUTRAL_OPTIONS}
          selected={answers.neutralReason}
          onSelect={(v) => {
            setAnswers({ neutralReason: v });
            setTimeout(() => goTo('rewardKano'), 240);
          }}
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
    </Day0Shell>
  );
}
