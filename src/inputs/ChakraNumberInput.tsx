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
  value: number;
  step?: number;
  variant?: string;
  onChange: (arg: string) => void;
}
export default function NumberInputControl({
  width,
  max,
  min,
  value,
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
      value={value}
      variant={variant}
      onChange={(value) => onChange(value)}
      backgroundColor="white"
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
