import { IUxPod } from "../../base/entities/IUxPod";
import { IOracleModuleItem } from "../base/IOracleModuleItem";

export interface IPodWithEmail extends IUxPod, IOracleModuleItem {
  email_domain: string;
}
