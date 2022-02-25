import Papa from "papaparse";

import { IConvManFile } from "../components/forms/interfaces/IConvManFileInputState";
import { IUniqueWorksheet } from "../models/entities/api/IUniqueWorksheet";
import { ICnvSpreadsheet } from "../models/entities/base/ICnvSpreadsheet";
import { IApiResponse } from "../models/responses/IApiResponse";
import { ICreateBatchResponse } from "../models/responses/ICreateBatchResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";
import { BatchRequestSvc } from "./BatchRequestSvc";
import ExcelSvc from "./ExcelSvc";

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

  createBatch = async ({
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
  }): Promise<ICreateBatchResponse> => {
    const excel = new ExcelSvc();
    const spRows = excel.sheetToCsv({ workbook: file, sheetToRead: sheet, batchName: batchName });
    const csv = Papa.unparse(spRows);
    const batchSvc = new BatchRequestSvc();

    const batchReqResp = await batchSvc.createBatchRequest({
      pod_url: podUrl,
      cnv_batch: batchName,
      created_by: createdBy,
      ux_batch_request_id: null,
      created_on: null,
      updated_by: null,
      updated_on: null,
    });

    const response: ICreateBatchResponse = {
      batchCreateResponse: { entities: [], error: { message: "", name: "" } },
      spreadsheetCreateResponse: { entities: [], error: { message: "", name: "" } },
    };
    try {
      if (batchReqResp) response.batchCreateResponse = batchReqResp;
      const createSpResp = await this.runPost<any, any>({
        action: ServerConfig.ords.customActions.posts.batchload,
        body: csv,
        contentType: "text/csv",
      });
      response.spreadsheetCreateResponse.entities.push({ ...createSpResp });
    } catch (e) {
      response.spreadsheetCreateResponse = this.handleError({ e, code: "POST", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
