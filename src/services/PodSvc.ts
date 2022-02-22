import { ServerConfig } from "../../ServerConfig";
import { GetResponse } from "../models/data/implementation/GetResponse";
import { IGetPod } from "../models/entities/api/IGetPod";
import { IGetResp } from "../../interfaces/responses/IGetResp";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";


export default class PodSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.pod);
  }
  getAll = async (): Promise<IGetResp<IGetPod>> => {
    const response = new GetResponse<IGetPod>();
    try {
      const axiosResp = await this.runGet<IGetPod>({
        action: ServerConfig.ords.customActions.gets.pods,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response.data = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}


