import { ISummaryRowByHdl } from "../entities/api/ISummaryRowByHdl";
import { IConvManError } from "../errors/IConvManError";

export interface ISummaryDataResp {
  totalErrorRows: ISummaryRowByHdl[];
  totalRows: ISummaryRowByHdl[];
  error: IConvManError;
}
