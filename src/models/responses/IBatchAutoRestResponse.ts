import { IUxBatchRequest } from "../entities/base/IUxBatchRequest";
import { IOracleAutoRestResponse } from "./IOracleAutoRestResponse";

export interface IBatchAutoRestResponse extends IOracleAutoRestResponse, IUxBatchRequest {}