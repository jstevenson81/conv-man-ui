import { ServerConfig } from "../../ServerConfig";
import { ApiResponse } from "../models/data/Impl/ApiResponse";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { IUxBatchRequest } from "../models/data/Interfaces/ORDS/AutoRest/IUxBatchRequest";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class CustomMethodService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getBatches(): Promise<IApiResponse<IUxBatchRequest>> {
    let response = new ApiResponse<IUxBatchRequest>();
    try {
      let axiosResp = await this.runGetManyWithAction<IUxBatchRequest>(
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
