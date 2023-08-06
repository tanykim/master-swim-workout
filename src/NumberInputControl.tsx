import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

interface Props {
  width: number;
  max: number;
  min: number;
  defaultValue: number;
  step?: number;
  variant?: string;
  onChange: (arg: string) => void;
}
export default function NumberInputControl({
  width,
  max,
  min,
  defaultValue,
  step = 1,
  variant,
  onChange,
}: Props) {
  return (
    <NumberInput
      maxW={width}
      max={max}
      min={min}
      step={step}
      size="sm"
      defaultValue={defaultValue}
      variant={variant}
      onChange={(value) => onChange(value)}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
