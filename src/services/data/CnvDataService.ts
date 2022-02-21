import { ApiResponse } from "../models/data/Impl/ApiResponse";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { ICnvValError } from "../models/data/Interfaces/ORDS/ICnvValError";
import { ICnvValErrorAttr } from "../models/data/Interfaces/ORDS/ICnvValErrorAttr";
import { ServerConfig } from "../../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class CnvDataService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getAttributes(): Promise<ApiResponse<ICnvValErrorAttr>> {
    let response = new ApiResponse<ICnvValErrorAttr>();
    try {
      let axiosResp = await this.runGetManyWithAction<ICnvValErrorAttr>(
        ServerConfig.ords.customActions.gets.attributes
      );
      axiosResp = await this.getMore(axiosResp);
      response.oracleResponse = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  }

  async getErrorsByBatch(batch: string): Promise<IApiResponse<ICnvValError>> {
    let response = new ApiResponse<ICnvValError>();
    try {
      const action = ServerConfig.ords.customActions.gets.errorsByBatch.replace("{{batch}}", batch);
      // get the initial response
      let axiosResp = await this.runGetManyWithAction<ICnvValError>(action);
      // do we have more?
      axiosResp = await this.getMore(axiosResp);
      response.oracleResponse = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  }
}
