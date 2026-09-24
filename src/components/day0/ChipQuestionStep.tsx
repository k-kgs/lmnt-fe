import { StepCard } from './StepCard';
import { ChipRow, type ChipDef } from './ChipOption';

type Option = { v: string; t: string; icon?: string };

interface BaseProps {
  eyebrow: string;
  question: string;
  options: Option[];
  onBack?: () => void;
}

interface SingleSelectProps extends BaseProps {
  multi?: false;
  selected?: string;
  onSelect: (value: string) => void;
}

interface MultiSelectProps extends BaseProps {
  multi: true;
  selected: string[];
  onToggle: (value: string) => void;
  max?: number;
  helper?: string;
  onNext: () => void;
}

export function ChipQuestionStep(props: SingleSelectProps | MultiSelectProps) {
  const chipDefs: ChipDef[] = props.options.map((o) => ({ value: o.v, label: o.t, icon: o.icon }));

  if (props.multi) {
    const { selected, onToggle, max, helper, onNext, onBack, eyebrow, question } = props;
    return (
      <StepCard
        eyebrow={eyebrow}
        question={question}
        helper={helper ?? (max ? `Pick up to ${max}.` : 'Pick all that apply.')}
        onBack={onBack}
        onContinue={onNext}
        continueDisabled={selected.length === 0}
      >
        <ChipRow
          options={chipDefs}
          selected={selected}
          onSelect={(v) => {
            const isSelected = selected.includes(v);
            if (isSelected || !max || selected.length < max) onToggle(v);
          }}
        />
      </StepCard>
    );
  }

  const { selected, onSelect, onBack, eyebrow, question } = props;
  return (
    <StepCard eyebrow={eyebrow} question={question} onBack={onBack}>
      <ChipRow options={chipDefs} selected={selected} onSelect={onSelect} />
    </StepCard>
  );
}
