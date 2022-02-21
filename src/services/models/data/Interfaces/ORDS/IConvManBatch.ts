import { IOracleItem } from "../OracleApi/IOracleItem";

export interface IConvManBatch extends IOracleItem {
  batch_name: string;
  last_updated: string;
  pod_name: string;
  pod_url: string;
}

export interface ICreateBatchRequest {
  ux_batch_request_id?: number;
  pod_url: string;
  cnv_batch: string;
  created_by: string;
}
