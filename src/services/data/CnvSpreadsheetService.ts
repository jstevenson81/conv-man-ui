import Papa from "papaparse";
import { IConvManFile } from "../../components/forms/interfaces/IConvManFileInputState";
import { ServerConfig } from "../../ServerConfig";
import ExcelService from "../ExcelService";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";
import { UxBatchService } from "./UxBatchService";

export class CnvSpreadsheetService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.spreadsheets);
  }

  async saveFile({
    file,
    podUrl,
    batchName,
    createdBy,
    sheet,
  }: {
    file: IConvManFile;
    podUrl: string;
    batchName: string;
    createdBy: string;
    sheet: string;
  }): Promise<IApiResponse<any>> {
    const excel = new ExcelService();
    const spRows = excel.sheetToCsv({ workbook: file, sheetToRead: sheet, batchName: batchName });
    const csv = Papa.unparse(spRows);

    const uxBatchSvc = new UxBatchService();
    const batchReqResp = await uxBatchSvc.createBatchRequest({
      pod_url: podUrl,
      cnv_batch: batchName,
      created_by: createdBy,
    });

    return batchReqResp && batchReqResp.error
      ? batchReqResp
      : await this.runPost<any>({
          action: ServerConfig.ords.customActions.posts.batchload,
          body: csv,
          contentType: "text/csv",
        });
  }
}
