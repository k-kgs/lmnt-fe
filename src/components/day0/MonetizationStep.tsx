import { Stack } from '@mui/material';
import { StepCard } from './StepCard';
import { OptionButton } from './OptionButton';
import { MONETIZATION_OPTIONS, type SurveyAnswers } from '../../hooks/useSurveyFlow';

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
  const handlePick = (value: string) => {
    onAnswer({ monetization: value });
    setTimeout(onNext, 220);
  };

  return (
    <StepCard
      eyebrow="Being honest about money"
      question="What if there was something with premium challenges and coaching, like that — how would you want to access it?"
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
