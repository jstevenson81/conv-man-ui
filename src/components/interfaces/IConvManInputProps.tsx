import { HTMLInputTypeAttribute } from "react";

export interface IConvManInputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  name: string;
  onInputChange(value: string, name: string): void;
}
