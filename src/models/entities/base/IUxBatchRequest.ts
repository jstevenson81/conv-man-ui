import { IEntity } from "./IEntity";

export interface IUxBatchRequest extends IEntity {
  ux_batch_request_id: number | null;
  pod_url: string;
  cnv_batch: string;
  created_by: string;
  created_on: string | null;
  updated_on: string | null;
  updated_by: string | null;
}
