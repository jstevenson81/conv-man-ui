import { IOracleLink } from "../Interfaces/IOracleLink";
import { IUxPodEmail } from "../Interfaces/ORDS/IUxPodEmail";

export class UxPodEmail implements IUxPodEmail {
  ux_pod_email_id: number;
  email_domain: string;
  links: IOracleLink[];

  constructor() {
    this.ux_pod_email_id = 0;
    this.email_domain = "";
    this.links = new Array<IOracleLink>();
  }
}
