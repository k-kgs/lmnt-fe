import { Stack } from '@mui/material';
import { StepCard } from './StepCard';
import { OptionButton } from './OptionButton';
import { KANO5, type KanoValue, type SurveyAnswers } from '../../hooks/useSurveyFlow';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';

export function RewardKanoStep({
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
  const advance = useAutoAdvance(onNext);
  const handlePick = (value: KanoValue) => advance(() => onAnswer({ rewardKano: value }));

  return (
    <StepCard
      eyebrow="How this would work"
      question="How would you feel about earning coins just for showing up consistently, redeemable for real rewards?"
      onBack={onBack}
    >
      <Stack gap={1.25} mt={2.25}>
        {KANO5.map((opt) => (
          <OptionButton
            key={opt.v}
            label={opt.t}
            icon={opt.icon}
            selected={answers.rewardKano === opt.v}
            onClick={() => handlePick(opt.v)}
          />
        ))}
      </Stack>
    </StepCard>
  );
}
