import { IValidationError } from "../../../../models/entities/api/IValidationError";
import { IValidationErrorAttr } from "../../../../models/entities/api/IValidationErrorAttr";
import { IApiResponse } from "../../../../models/responses/IApiResponse";


export type IConvManRowsCols = {
  rows: IApiResponse<IValidationError>;
  columns: IApiResponse<IValidationErrorAttr>;
};
