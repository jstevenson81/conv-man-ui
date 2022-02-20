import { IConvManFile } from "./IConvManFileInputState";

export interface IConvManFileInputProps {
  label: string;
  onFileChange(file: IConvManFile): void;
};
