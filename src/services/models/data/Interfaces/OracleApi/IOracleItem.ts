import { ICnvSp } from "../ORDS/AutoRest/ICnvSpreadsheet";
import { IUxBatchRequest } from "../ORDS/AutoRest/IUxBatchRequest";
import { IUxPod } from "../ORDS/IUxPod";
import { IUxPodEmail } from "../ORDS/IUxPodEmail";
import { ILink } from "./IOracleLink";

export interface IModuleItem {}

export interface IPPDResp {
  links?: ILink[];
}

export interface IUxPodPPDResp extends IUxPod, IPPDResp {}
export interface IUxPodEmailPPDResp extends IUxPodEmail, IPPDResp {}
export interface ICnvSpPPDResp extends ICnvSp, IPPDResp {}
export interface IBatchPPDResp extends IUxBatchRequest, IPPDResp {}

export interface IOracleApiResponse {}

export interface IGetResponse<T extends IOracleModuleItem> {
  items: Array<T>;
}

export interface IAutoRestItem {
  links?: ILink[];
}
