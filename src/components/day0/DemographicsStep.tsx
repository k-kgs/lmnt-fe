import { Box, Typography } from '@mui/material';
import { StepCard } from './StepCard';
import { ChipRow } from './ChipOption';
import { AGE_OPTIONS, GENDER_OPTIONS, type SurveyAnswers } from '../../hooks/useSurveyFlow';

export function DemographicsStep({
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
  return (
    <StepCard
      eyebrow="Almost there · totally optional"
      question="A little about you"
      onContinue={onNext}
      onBack={onBack}
    >
      <Box mt={2}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>Age group</Typography>
        <ChipRow
          options={AGE_OPTIONS.map((a) => ({ value: a, label: a }))}
          selected={answers.age}
          onSelect={(v) => onAnswer({ age: v })}
        />
      </Box>
      <Box mt={3}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>Gender</Typography>
        <ChipRow
          options={GENDER_OPTIONS.map((g) => ({ value: g, label: g }))}
          selected={answers.gender}
          onSelect={(v) => onAnswer({ gender: v })}
        />
      </Box>
    </StepCard>
  );
}
