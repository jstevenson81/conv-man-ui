import { ServerConfig } from "../../../ServerConfig";
import { ApiResponse } from "../models/data/implementation/ApiResponse";
import { IApiResponse } from "../models/data/interfaces/Local/IApiResponse";
import { IUxBatchRequest } from "../models/data/interfaces/ords/autoRest/IUxBatchRequest";
import { OracleRestServiceBase } from "../../data/base/OracleRestServiceBase";

export class CustomMethodService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getBatches(): Promise<IApiResponse<IUxBatchRequest>> {
    let response = new ApiResponse<IUxBatchRequest>();
    try {
      let axiosResp = await this.runGetManyCustom<IUxBatchRequest>(
        ServerConfig.ords.customActions.gets.batches
      );
      axiosResp = await this.getMore(axiosResp);
      response.oracleResponse = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  }
}
