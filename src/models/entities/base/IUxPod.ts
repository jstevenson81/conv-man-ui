import { IEntity } from "./IEntity";

export interface IUxPod extends IEntity {
  ux_pod_id: number | null;
  uxp_ux_pod_email_id: number;
  pod_name: string;
  pod_url: string;
}
