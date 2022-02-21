import { ILink } from "../Interfaces/OracleApi/IOracleLink";
import { IUxPod } from "../Interfaces/ORDS/IUxPod";

export class UxPod implements IUxPod {
  uxp_ux_pod_email_id: number;
  ux_pod_id: number;
  pod_name: string;
  pod_url: string;
  links?: ILink[];

  constructor() {
    this.ux_pod_id = 0;
    this.uxp_ux_pod_email_id = 0;
    this.ux_pod_id = 0;
    this.pod_name = "";
    this.pod_url = "";
    this.links = new Array<ILink>();
  }
}
