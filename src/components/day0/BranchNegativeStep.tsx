import { Stack } from '@mui/material';
import { StepCard } from './StepCard';
import { OptionButton } from './OptionButton';
import { STRUGGLE_OPTIONS, type SurveyAnswers } from '../../hooks/useSurveyFlow';

export function BranchNegativeStep({
  answers,
  onAnswer,
  onNext,
  onBack,
}: {
  answers: SurveyAnswers;
  onAnswer: (patch: Partial<SurveyAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const current = answers.negativeReasons || [];

  const toggle = (value: string) => {
    const idx = current.indexOf(value);
    if (idx > -1) {
      onAnswer({ negativeReasons: current.filter((v) => v !== value) });
    } else if (current.length < 3) {
      onAnswer({ negativeReasons: [...current, value] });
    }
  };

  return (
    <StepCard
      eyebrow="What gets in the way"
      question="What usually knocks you off track?"
      helper="Pick up to 3."
      onContinue={onNext}
      continueDisabled={current.length === 0}
      onBack={onBack}
    >
      <Stack gap={1.25} mt={2.25}>
        {STRUGGLE_OPTIONS.map((opt) => (
          <OptionButton
            key={opt.v}
            label={opt.t}
            icon={opt.icon}
            selected={current.includes(opt.v)}
            onClick={() => toggle(opt.v)}
            multi
          />
        ))}
      </Stack>
    </StepCard>
  );
}
