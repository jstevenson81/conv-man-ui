import { DateTime } from "luxon";
import Papa from "papaparse";

import { IConvManFile } from "../components/forms/interfaces/IConvManFileInputState";
import { IBatchWithPodName } from "../models/entities/api/IBatchWithPodName";
import { IUxBatchRequest } from "../models/entities/base/IUxBatchRequest";
import { IApiResponse } from "../models/responses/IApiResponse";
import { IBatchAutoRestResponse } from "../models/responses/IBatchAutoRestResponse";
import { ICreateBatchResponse } from "../models/responses/ICreateBatchResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";
import ExcelSvc from "./ExcelSvc";

export class BatchRequestSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.batchRequests);
  }
  createBatchRequest = async ({
    pod_url,
    cnv_batch,
    created_by,
  }: IUxBatchRequest): Promise<IApiResponse<IUxBatchRequest>> => {
    let response: IApiResponse<IUxBatchRequest> = this.initApiResponse<IUxBatchRequest>();
    try {
      const nowAsJson = DateTime.now().toJSON().toString();
      const body: IUxBatchRequest = {
        pod_url,
        cnv_batch,
        created_by,
        created_on: nowAsJson,
        updated_by: created_by,
        updated_on: nowAsJson,
        ux_batch_request_id: null,
      };
      const axiosResponse = await this.runPost<IBatchAutoRestResponse, IUxBatchRequest>({
        body,
        contentType: "application/json",
      });
      response.entities[0] = axiosResponse.data;
    } catch (e) {
      response = this.handleError<IUxBatchRequest>({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
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

    const batchReqResp = await this.createBatchRequest({
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
      response.spreadsheetCreateResponse = await this.constructEntities(createSpResp);
    } catch (e) {
      response.spreadsheetCreateResponse = this.handleError({ e, code: "POST", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };

  getAllBatches = async (): Promise<IApiResponse<IBatchWithPodName>> => {
    let response: IApiResponse<IBatchWithPodName>;

    try {
      const axiosResp = await this.runGet<IBatchWithPodName>({
        action: ServerConfig.ords.customActions.gets.batches,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities<IBatchWithPodName>(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
