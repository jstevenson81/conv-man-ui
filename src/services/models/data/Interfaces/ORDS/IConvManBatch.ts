import { IOracleItem } from "../OracleApi/IOracleItem";

export interface IConvManBatch extends IOracleItem {
  last_updated: string;
  batch_name: string;
}
