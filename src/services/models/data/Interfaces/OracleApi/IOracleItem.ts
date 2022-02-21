import { ICnvSpreadsheet } from "../ORDS/AutoRest/ICnvSpreadsheet";
import { IUxBatchRequest } from "../ORDS/AutoRest/IUxBatchRequest";
import { IUxPod } from "../ORDS/AutoRest/IUxPod";
import { IUxPodEmail } from "../ORDS/AutoRest/IUxPodEmail";
import { ILink } from "./IOracleLink";

export interface IPPDResp {
  links?: ILink[];
}

export interface IUxPodPPDResp extends IUxPod, IPPDResp {}
export interface IUxPodEmailPPDResp extends IUxPodEmail, IPPDResp {}
export interface ICnvSpPPDResp extends ICnvSpreadsheet, IPPDResp {}
export interface IBatchPPDResp extends IUxBatchRequest, IPPDResp {}

export interface IOracleApiResponse {}

export interface IGetResponse<T> {
  items: Array<T>;
}

export interface IAutoRestItem {
  links?: ILink[];
}
