import { IUxBatchRequest } from "../../entities/IUxBatchRequest";
import { IOracleModuleItem } from "../base/IOracleModuleItem";

export interface IBatchWithPodName extends IUxBatchRequest, IOracleModuleItem {
  pod_name: string;
}
