import { IConvManFileInputState } from "./IConvManFileInputState";

export type IConvManFileInputProps = {
  label: string;
  onFileChange(file: IConvManFileInputState): void;
};
