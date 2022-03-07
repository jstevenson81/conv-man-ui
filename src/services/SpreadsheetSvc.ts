import { AxiosError } from "axios";
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

  createBatch = async (config: {
    workbook: IConvManFile;
    podUrl: string;
    batchName: string;
    createdBy: string;
    sheetToRead: string;
  }): Promise<ICreateBatchResponse> => {
    const excel = new ExcelSvc();
    const spRows = excel.sheetToCsv({ ...config });
    // we need to set this so the process knows to add and not update
    spRows.forEach((row) => {
      row.spr_key_id = null;
    });

    const batchSvc = new BatchRequestSvc();

    const batchReqResp = await batchSvc.createBatchRequest({
      pod_url: config.podUrl,
      cnv_batch: config.batchName,
      created_by: config.createdBy,
      ux_batch_request_id: null,
      created_on: null,
      updated_by: null,
      updated_on: null,
    });

    const response: ICreateBatchResponse = {
      batchCreateResponse: { entities: [], error: { message: "", name: "" } },
      spCreateResp: { data: "", links: [], status: 0, statusText: "", isError: false },
      convOpsResp: { hasErrors: false },
    };
    try {
      const csv = Papa.unparse(spRows);

      if (batchReqResp) response.batchCreateResponse = batchReqResp;
      const createSpResp = await this.runPostBatchload({
        action: ServerConfig.ords.customActions.posts.batchload,
        body: csv,
        contentType: "text/csv",
      });
      const batchLoadMsg = createSpResp.data.replace(/(\r\n|\n|\r)/gm, "");
      const hasError = batchLoadMsg.toUpperCase().indexOf("SEVERE") > -1;

      if (hasError) throw new Error(createSpResp.data);

      response.spCreateResp = createSpResp;
    } catch (e) {
      const axiosError = e as AxiosError;

      response.spCreateResp.data = axiosError && axiosError.message ? axiosError.message : (e as Error).message;
      response.spCreateResp.status = axiosError && axiosError.response ? axiosError.response.status : 500;
      response.spCreateResp.statusText =
        axiosError && axiosError.response ? axiosError.response.statusText : "No rows committed";
      response.spCreateResp.isError = true;
    }
    return response;
  };
}
