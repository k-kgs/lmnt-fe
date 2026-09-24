import { Box, Stack, TextField, Typography } from '@mui/material';
import { StepCard } from './StepCard';
import { OptionButton } from './OptionButton';
import { ChipRow } from './ChipOption';
import {
  TRACKING_TOOL_OPTIONS,
  TRACKING_APP_FEEDBACK_OPTIONS,
  SHORT_SATISFACTION,
  type Satisfaction,
  type SurveyAnswers,
} from '../../hooks/useSurveyFlow';

export function TrackingMethodStep({
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
  const showOtherInput = answers.trackingTool === 'other';
  const showAppFeedback = answers.trackingTool === 'app';
  const ready = !!(answers.trackingTool && answers.trackingSatisfaction);

  const pickTool = (value: string) => {
    onAnswer(
      value === answers.trackingTool
        ? {}
        : { trackingTool: value, trackingToolOther: undefined, trackingAppFeedback: undefined },
    );
  };

  return (
    <StepCard eyebrow="Getting specific" onContinue={onNext} continueDisabled={!ready} onBack={onBack}>
      <Typography variant="h4" sx={{ fontSize: 22, lineHeight: 1.25, fontWeight: 600, mb: 0.75 }}>
        How do you currently track your progress?
      </Typography>
      <Stack gap={1.25} mt={1.5}>
        {TRACKING_TOOL_OPTIONS.map((opt) => (
          <OptionButton
            key={opt.v}
            label={opt.t}
            icon={opt.icon}
            selected={answers.trackingTool === opt.v}
            onClick={() => pickTool(opt.v)}
          />
        ))}
      </Stack>
      {showOtherInput && (
        <TextField
          fullWidth
          autoFocus
          placeholder="Tell us in a few words"
          value={answers.trackingToolOther || ''}
          onChange={(e) => onAnswer({ trackingToolOther: e.target.value })}
          sx={{ mt: 1.75 }}
        />
      )}

      <Box mt={3.5}>
        <Typography variant="h4" sx={{ fontSize: 22, lineHeight: 1.25, fontWeight: 600, mb: 0.25 }}>
          How satisfied are you with your progress and consistency overall?
        </Typography>
        <ChipRow
          options={SHORT_SATISFACTION.map((o) => ({ value: o.v, label: o.t }))}
          selected={answers.trackingSatisfaction}
          onSelect={(v) => onAnswer({ trackingSatisfaction: v as Satisfaction })}
        />
      </Box>

      {showAppFeedback && (
        <Box mt={3}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 700, mb: 0.25 }}>
            Since you use an app — how do you feel about it? <Box component="span" sx={{ fontWeight: 500, opacity: 0.6 }}>(optional)</Box>
          </Typography>
          <ChipRow
            options={TRACKING_APP_FEEDBACK_OPTIONS.map((o) => ({ value: o.v, label: o.t }))}
            selected={answers.trackingAppFeedback}
            onSelect={(v) => onAnswer({ trackingAppFeedback: v })}
          />
        </Box>
      )}
    </StepCard>
  );
}
