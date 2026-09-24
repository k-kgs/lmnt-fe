import { Box, Typography } from '@mui/material';
import { StepCard } from './StepCard';
import { ChipRow } from './ChipOption';
import { SHORT_IMPORTANCE, SHORT_SATISFACTION, type Satisfaction, type SurveyAnswers } from '../../hooks/useSurveyFlow';

export function PivotStep({
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
  const ready = !!(answers.pivotImportance && answers.pivotSatisfaction);

  return (
    <StepCard eyebrow="Getting specific" onContinue={onNext} continueDisabled={!ready} onBack={onBack}>
      <Box>
        <Typography variant="h4" sx={{ fontSize: 22, lineHeight: 1.25, fontWeight: 600, mb: 0.25 }}>
          How important is it to you?
        </Typography>
        <ChipRow
          options={SHORT_IMPORTANCE.map((t) => ({ value: t, label: t }))}
          selected={answers.pivotImportance}
          onSelect={(v) => onAnswer({ pivotImportance: v })}
        />
      </Box>
      <Box mt={3.5}>
        <Typography variant="h4" sx={{ fontSize: 22, lineHeight: 1.25, fontWeight: 600, mb: 0.25 }}>
          How satisfied are you with how it's going right now?
        </Typography>
        <ChipRow
          options={SHORT_SATISFACTION.map((o) => ({ value: o.v, label: o.t }))}
          selected={answers.pivotSatisfaction}
          onSelect={(v) => onAnswer({ pivotSatisfaction: v as Satisfaction })}
        />
      </Box>
    </StepCard>
  );
}
