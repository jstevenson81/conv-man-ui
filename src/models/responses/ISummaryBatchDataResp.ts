import { ISummaryRow } from "../entities/api/ISummaryRow";
import { IConvManError } from "../errors/IConvManError";

export interface ISummaryDataResp {
  totalErrorRows: ISummaryRow[];
  totalRows: ISummaryRow[];
  error: IConvManError;
}
