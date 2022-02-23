import { DateTime } from "luxon";
import { IBatchWithPodName } from "../models/entities/api/IBatchWithPodName";
import { IUxBatchRequest } from "../models/entities/base/IUxBatchRequest";
import { IApiResponse } from "../models/responses/IApiResponse";
import { IBatchAutoRestResponse } from "../models/responses/IBatchAutoRestResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class BatchRequestSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.batchRequests);
  }
  create = async ({ pod_url, cnv_batch, created_by }: IUxBatchRequest): Promise<IApiResponse<IUxBatchRequest>> => {
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
