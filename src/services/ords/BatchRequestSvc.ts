import { DateTime } from "luxon";
import { ServerConfig } from "../../ServerConfig";
import { GetResponse } from "../models/data/implementation/GetResponse";
import { PutPostDeleteRespose } from "../models/data/implementation/PutPostDeleteRespose";
import { IUxBatchReqModel } from "../models/data/interfaces/ords/autoRest/IUxBatchReqModel";
import { IUxBatchRequest } from "../models/data/interfaces/ords/entities/IUxBatchRequest";
import { IUxPod } from "../models/data/interfaces/ords/entities/IUxPod";
import { IBatchWithPodName } from "../models/data/interfaces/ords/module/api/IBatchWithPodName";
import { IGetResp } from "../models/data/interfaces/responses/IGetResp";
import { IPutPostDeleteResp } from "../models/data/interfaces/responses/IPutPostDeleteResp";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class BatchRequestSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.batchRequests);
  }
  create = async ({
    pod_url,
    cnv_batch,
    created_by,
  }: IUxBatchRequest): Promise<IPutPostDeleteResp<IUxBatchReqModel>> => {
    const response = new PutPostDeleteRespose<IUxBatchReqModel>();
    try {
      const nowAsJson = DateTime.now().toJSON().toString();
      const axiosResponse = await this.runPost<IUxBatchReqModel>({
        body: {
          pod_url,
          cnv_batch,
          created_by,
          created_on: nowAsJson,
          updated_by: created_by,
          updated_on: nowAsJson,
          ux_batch_request_id: null,
          links: null,
        },
        contentType: "application/json",
      });
      response.data = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };

  getAll = async (): Promise<IGetResp<IBatchWithPodName>> => {
    const response = new GetResponse<IBatchWithPodName>();
    try {
      const axiosResp = await this.runGet<IBatchWithPodName>({
        action: ServerConfig.ords.customActions.gets.batches,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response.data = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}


