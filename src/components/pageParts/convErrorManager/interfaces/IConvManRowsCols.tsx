import { IApiResponse } from "../../../../interfaces/Local/IApiResponse";
import { IValidationError } from "../../../../services/models/entities/api/IValidationError";
import { ICnvValErrorAttr } from "../../../../interfaces/ords/ICnvValErrorAttr";


export type IConvManRowsCols = {
  rows: IApiResponse<IValidationError>;
  columns: IApiResponse<ICnvValErrorAttr>;
};
