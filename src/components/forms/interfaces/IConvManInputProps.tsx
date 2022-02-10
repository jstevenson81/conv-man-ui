import { HTMLInputTypeAttribute } from "react";

export interface IConvManInputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  name: string;
  placeHolder: string;
  onInputChange(value: string, name: string): void;
}
