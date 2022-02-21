import { ApiResponse } from "../models/data/implementation/ApiResponse";
import { UxPod } from "../models/data/implementation/UxPod";
import { IUxPod } from "../models/data/interfaces/ords/IUxPod";
import { ServerConfig } from "../../../ServerConfig";
import { OracleRestServiceBase } from "../../data/base/OracleRestServiceBase";

export class PodService extends OracleRestServiceBase {

  constructor() {
    super(ServerConfig.ords.entities.pod)
  }


  async getAllPods(): Promise<ApiResponse<IUxPod>> {
    let response = new ApiResponse<UxPod>();
    try {
      const axiosResponse = await this.runGetMany<IUxPod>();
      response.oracleResponse = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "API_GET_EXCEPTION" });
    }
    return response;
  }
  async getOnePod(id: number): Promise<ApiResponse<IUxPod>> {
    let response = new ApiResponse<IUxPod>();
    try {
      const axiosResponse = await this.runGetOne<IUxPod>(id.toString());
      response.singleOracleItem = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "API_GET_EXCEPTION" });
    }
    return response;
  }
}
