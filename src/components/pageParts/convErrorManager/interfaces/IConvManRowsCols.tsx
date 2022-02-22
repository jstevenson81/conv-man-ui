import { IApiResponse } from "../../../../services/models/data/interfaces/Local/IApiResponse";
import { IValidationError } from "../../../../services/models/data/interfaces/ORDS/module/api/IValidationError";
import { ICnvValErrorAttr } from "../../../../services/models/data/interfaces/ords/ICnvValErrorAttr";


export type IConvManRowsCols = {
  rows: IApiResponse<IValidationError>;
  columns: IApiResponse<ICnvValErrorAttr>;
};
