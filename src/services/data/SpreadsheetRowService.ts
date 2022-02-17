import _ from "lodash";
import Papa from "papaparse";
import { fileURLToPath } from "url";
import { IConvManFileInputState } from "../../components/forms/interfaces/IConvManFileInputState";
import { ServerConfig } from "../../ServerConfig";
import ExcelService from "../ExcelService";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class SpreadsheetService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.spreadsheetRows);
  }

  async saveFile(config: {
    file: IConvManFileInputState;
    podId: number;
    batchName: string;
    createdBy: string;
    sheet: string;
  }): Promise<any> {
    const excel = new ExcelService();
    const spRows = excel.sheetToCsv({ workbook: config.file, sheetToRead: config.sheet, batchName: config.batchName });
    const csv = Papa.unparse(spRows);
    return await this.runPost<any>({
      action: ServerConfig.ords.customActions.batchload,
      body: csv,
      contentType: "text/csv",
    });
  }
}
