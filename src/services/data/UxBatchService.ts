import { DateTime } from "luxon";
import { ServerConfig } from "../../ServerConfig";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { ICreateBatchRequest } from "../models/data/Interfaces/ORDS/IConvManBatch";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class UxBatchService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.batchRequest);
  }
  createBatchRequest = async ({
    pod_url,
    cnv_batch,
    created_by,
  }: ICreateBatchRequest): Promise<IApiResponse<ICreateBatchRequest>> => {
    const nowAsJson = DateTime.now().toJSON().toString();
    return await this.runPost<ICreateBatchRequest>({
      body: { pod_url, cnv_batch, created_by, created_on: nowAsJson, updated_by: created_by, updated_on: nowAsJson },
      contentType: "application/json",
    });
  };
}
