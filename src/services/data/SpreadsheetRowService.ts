import Papa from "papaparse";
import { IConvManFile } from "../../components/forms/interfaces/IConvManFileInputState";
import { ServerConfig } from "../../ServerConfig";
import ExcelService from "../ExcelService";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { ICnvSpreadsheet } from "../models/data/Interfaces/ORDS/ICnvSpreadsheet";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class CnvSpreadsheetService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.spreadsheetRows);
  }

  async saveFile(config: {
    file: IConvManFile;
    podUrl: string;
    batchName: string;
    createdBy: string;
    sheet: string;
  }): Promise<IApiResponse<any>> {
    const excel = new ExcelService();
    const spRows = excel.sheetToCsv({ workbook: config.file, sheetToRead: config.sheet, batchName: config.batchName });
    const csv = Papa.unparse(spRows);
    const batchReqResp = await this.runPost<any>({
      body: { ...config },
      contentType: "application/json",
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
