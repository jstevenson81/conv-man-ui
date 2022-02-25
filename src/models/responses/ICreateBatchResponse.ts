import { IUxBatchRequest } from "../entities/base/IUxBatchRequest";
import { IApiResponse } from "./IApiResponse";
import { IBulkLoadResponse } from "./IBulkLoadResponse";

export interface ICreateBatchResponse {
  batchCreateResponse: IApiResponse<IUxBatchRequest>;
  spCreateResp: IBulkLoadResponse;
}
