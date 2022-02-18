import { IApiResponse } from "../../../../services/models/data/Interfaces/Local/IApiResponse";
import { ICnvValError } from "../../../../services/models/data/Interfaces/ORDS/ICnvValError";
import { ICnvValErrorAttr } from "../../../../services/models/data/Interfaces/ORDS/ICnvValErrorAttr";


export type IConvManRowsCols = {
  rows: IApiResponse<ICnvValError>;
  columns: IApiResponse<ICnvValErrorAttr>;
};
