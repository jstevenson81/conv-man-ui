import { IUxBatchRequest } from "../entities/base/IUxBatchRequest";
import { IApiResponse } from "./IApiResponse";


export interface ICreateBatchResponse {
  batchCreateResponse: IApiResponse<IUxBatchRequest>;
  spreadsheetCreateResponse: IApiResponse<any>;
}
