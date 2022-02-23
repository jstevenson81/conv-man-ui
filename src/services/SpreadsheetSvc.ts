import { IUniqueWorksheet } from "../models/entities/api/IUniqueWorksheet";
import { ICnvSpreadsheet } from "../models/entities/base/ICnvSpreadsheet";
import { IApiResponse } from "../models/responses/IApiResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class SpreadsheetsSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.spreadsheets);
  }

  getWorksheets = async (): Promise<IApiResponse<IUniqueWorksheet>> => {
    let response: IApiResponse<IUniqueWorksheet>;
    try {
      const axiosResp = await this.runGet<IUniqueWorksheet>({
        action: ServerConfig.ords.customActions.gets.worksheets,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities<IUniqueWorksheet>(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };

  getSpreasheetDataByBatch = async (batchName: string): Promise<IApiResponse<ICnvSpreadsheet>> => {
    let response: IApiResponse<ICnvSpreadsheet>;
    try {
      const action = ServerConfig.ords.customActions.gets.spDataByBatch.replace("{{batch}}", batchName);
      const axiosResp = await this.runGet<ICnvSpreadsheet>({
        action: action,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities<ICnvSpreadsheet>(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}

// async saveFile({
//   file,
//   podUrl,
//   batchName,
//   createdBy,
//   sheet,
// }: {
//   file: IConvManFile;
//   podUrl: string;
//   batchName: string;
//   createdBy: string;
//   sheet: string;
// }): Promise<IApiResponse<any>> {
//   const excel = new ExcelService();
//   const spRows = excel.sheetToCsv({ workbook: file, sheetToRead: sheet, batchName: batchName });
//   const csv = Papa.unparse(spRows);

//   const uxBatchSvc = new UxBatchService();
//   const batchReqResp = await uxBatchSvc.createBatchRequest({
//     pod_url: podUrl,
//     cnv_batch: batchName,
//     created_by: createdBy,
//   });

//   return batchReqResp && batchReqResp.error
//     ? batchReqResp
//     : await this.runPost<any>({
//         action: ServerConfig.ords.customActions.posts.batchload,
//         body: csv,
//         contentType: "text/csv",
//       });
// }
