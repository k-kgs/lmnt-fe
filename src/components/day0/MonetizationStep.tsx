import { Stack } from '@mui/material';
import { StepCard } from './StepCard';
import { OptionButton } from './OptionButton';
import { MONETIZATION_OPTIONS, type SurveyAnswers } from '../../hooks/useSurveyFlow';
import { useAutoAdvance } from '../../hooks/useAutoAdvance';

export function MonetizationStep({
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
  const handlePick = (value: string) => advance(() => onAnswer({ monetization: value }));

  return (
    <StepCard
      eyebrow="Being honest about money"
      question="What if there was something with premium challenges and coaching, like that? How would you want to access it?"
      onBack={onBack}
    >
      <Stack gap={1.25} mt={2.25}>
        {MONETIZATION_OPTIONS.map((opt) => (
          <OptionButton
            key={opt.t}
            label={opt.t}
            icon={opt.icon}
            selected={answers.monetization === opt.t}
            onClick={() => handlePick(opt.t)}
          />
        ))}
      </Stack>
    </StepCard>
  );
}
