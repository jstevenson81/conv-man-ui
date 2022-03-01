import { IUxBatchRequest } from "../entities/base/IUxBatchRequest";
import { IUxPod } from "../entities/base/IUxPod";
import { IOracleAutoRestResponse } from "./IOracleAutoRestResponse";

export interface IBatchAutoRestResponse extends IOracleAutoRestResponse, IUxBatchRequest {}
export interface IUxPodAutoRestResponse extends IOracleAutoRestResponse, IUxPod {}
