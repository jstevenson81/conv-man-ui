import { HTMLInputTypeAttribute } from "react";

export interface IConvManInputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  name: string;
  value: any;
  placeHolder: string;
  onInputChange(value: string, name: string): void;
}
