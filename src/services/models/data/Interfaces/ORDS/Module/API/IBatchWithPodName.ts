import { IUxBatchRequest } from "../../AutoRest/IUxBatchRequest";

export interface IBatchWithPodName extends IUxBatchRequest {
  pod_name: string;
}
