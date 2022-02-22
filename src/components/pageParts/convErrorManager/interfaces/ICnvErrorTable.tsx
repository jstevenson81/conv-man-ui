import { IConvManCol } from "../../../../services/models/data/interfaces/IConvManCol";
import { IValidationError } from "../../../../services/models/data/interfaces/ORDS/module/api/IValidationError";

export type IConvManErrorTableDef = {
  columns: Array<IConvManCol<IValidationError>>;
  data: Array<IValidationError>;
  key: number;
  objectKey: string;
  sheetName: string;
};


