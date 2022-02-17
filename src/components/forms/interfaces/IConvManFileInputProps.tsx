import { IConvManFileInputState } from "./IConvManFileInputState";

export interface IConvManFileInputProps {
  label: string;
  onFileChange(file: IConvManFileInputState): void;
};
