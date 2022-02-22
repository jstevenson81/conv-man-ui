import { IUxBatchRequest } from "../base/IUxBatchRequest";

export interface IBatchWithPodName extends IUxBatchRequest {
  pod_name: string;
}
