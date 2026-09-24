import { StepCard } from './StepCard';
import { ChipRow, type ChipDef } from './ChipOption';

export function ChipQuestionStep({
  eyebrow,
  question,
  options,
  selected,
  onSelect,
  onBack,
}: {
  eyebrow: string;
  question: string;
  options: { v: string; t: string; icon?: string }[];
  selected?: string;
  onSelect: (value: string) => void;
  onBack?: () => void;
}) {
  const chipDefs: ChipDef[] = options.map((o) => ({ value: o.v, label: o.t, icon: o.icon }));
  return (
    <StepCard eyebrow={eyebrow} question={question} onBack={onBack}>
      <ChipRow options={chipDefs} selected={selected} onSelect={onSelect} />
    </StepCard>
  );
}
