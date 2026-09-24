import { Box, ButtonBase, TextField, Typography } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { StepCard } from './StepCard';
import { Day0Icon } from './icons';
import { TRACK_OPTIONS, type SurveyAnswers, type Track } from '../../hooks/useSurveyFlow';

export function TrackPickStep({
  answers,
  onAnswer,
  onNext,
  onBack,
}: {
  answers: SurveyAnswers;
  onAnswer: (patch: Partial<SurveyAnswers>) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const showOtherInput = answers.track === 'other';

  const handlePick = (value: Track) => {
    onAnswer({ track: value });
    if (value !== 'other') {
      setTimeout(onNext, 240);
    }
  };

  return (
    <StepCard
      eyebrow="Quick start"
      question="Which best describes your focus right now?"
      onBack={onBack}
      onContinue={showOtherInput ? onNext : undefined}
      continueDisabled={showOtherInput && !(answers.trackOther && answers.trackOther.trim())}
    >
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.25} mt={2.25}>
        {TRACK_OPTIONS.map((opt) => {
          const selected = answers.track === opt.value;
          return (
            <ButtonBase
              key={opt.value}
              onClick={() => handlePick(opt.value)}
              sx={{
                flexDirection: 'column',
                gap: 1,
                py: 2.5,
                px: 1,
                borderRadius: '16px',
                border: '1.5px solid',
                borderColor: selected ? day0Tokens.sky : day0Tokens.mist,
                bgcolor: selected ? day0Tokens.skySoft : day0Tokens.surface,
                color: selected ? day0Tokens.sky : day0Tokens.ink,
                textAlign: 'center',
              }}
            >
              <Day0Icon name={opt.icon} sx={{ fontSize: 26, color: selected ? day0Tokens.sky : day0Tokens.inkSoft }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14.5, whiteSpace: 'pre-line', color: 'inherit' }}>
                {opt.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
      {showOtherInput && (
        <TextField
          fullWidth
          autoFocus
          placeholder="Tell us in a few words"
          value={answers.trackOther || ''}
          onChange={(e) => onAnswer({ trackOther: e.target.value })}
          sx={{ mt: 2 }}
        />
      )}
    </StepCard>
  );
}
