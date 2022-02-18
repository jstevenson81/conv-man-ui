import { ServerConfig } from "../../ServerConfig";
import { ApiResponse } from "../models/data/Impl/ApiResponse";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { IConvManBatch } from "../models/data/Interfaces/ORDS/IConvManBatch";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class CustomMethodService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getBatches(): Promise<IApiResponse<IConvManBatch>> {
    let response = new ApiResponse<IConvManBatch>();
    try {
      let axiosResp = await this.runGetManyWithAction<IConvManBatch>(
        ServerConfig.ords.customActions.gets.getAllBatches
      );
      axiosResp = await this.getMore(axiosResp);
      response.oracleResponse = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  }
}
