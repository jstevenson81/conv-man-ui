import { DateTime } from "luxon";

import { IBatchWithPodName } from "../models/entities/api/IBatchWithPodName";
import { IHasErrors } from "../models/entities/api/IHasErrors";
import { ISummaryRowByHdl } from "../models/entities/api/ISummaryRowByHdl";
import { IUxBatchRequest } from "../models/entities/base/IUxBatchRequest";
import { IApiResponse } from "../models/responses/IApiResponse";
import { IBatchAutoRestResponse } from "../models/responses/IBatchAutoRestResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class BatchRequestSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.batchRequests);
  }

  //#region batch creation
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

  //#endregion

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

  getTotalBatchLines = async (batchName: string): Promise<IApiResponse<ISummaryRowByHdl>> => {
    let totalRowResp: IApiResponse<ISummaryRowByHdl>;

    try {
      const axiosRespErr = await this.runGet<ISummaryRowByHdl>({
        action: ServerConfig.ords.customActions.gets.totalRowsPerBatch.replace("{{batch}}", batchName),
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      totalRowResp = await this.constructEntities<ISummaryRowByHdl>(axiosRespErr);
    } catch (e) {
      totalRowResp = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }

    return totalRowResp;
  };

  getErrorCount = async (batchName: string): Promise<IApiResponse<IHasErrors>> => {
    let errorCountResp: IApiResponse<IHasErrors>;

    try {
      const axiosRespErr = await this.runGet<IHasErrors>({
        action: ServerConfig.ords.customActions.gets.hasErrorsByBatch.replace("{{batch}}", batchName),
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      errorCountResp = await this.constructEntities<IHasErrors>(axiosRespErr);
    } catch (e) {
      errorCountResp = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }

    return errorCountResp;
  };
}
