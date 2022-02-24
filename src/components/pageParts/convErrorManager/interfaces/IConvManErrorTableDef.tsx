import { IConvManCol } from "../../../../interfaces/IConvManCol";
import { IValidationError } from "../../../../models/entities/api/IValidationError";

export type IConvManErrorTableDef = {
  columns: Array<IConvManCol<IValidationError>>;
  data: Array<IValidationError>;
  key: number;
  objectKey: string;
  sheetName: string;
};
