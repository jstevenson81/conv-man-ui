import { IOracleItem } from "../OracleApi/IOracleItem";

export interface IConvManBatch extends IOracleItem {
  batch_name: string;
  last_updated: string;
  pod_name: string;
  pod_url: string;
}
