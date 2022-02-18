import { IConvManCol } from "../../../../services/models/data/Interfaces/Local/IConvManCol";
import { ICnvValError } from "../../../../services/models/data/Interfaces/ORDS/ICnvValError";

export type IConvManErrorTableDef = {
  columns: Array<IConvManCol<ICnvValError>>;
  data: Array<ICnvValError>;
  key: number;
  objectKey: string;
  sheetName: string;
};


