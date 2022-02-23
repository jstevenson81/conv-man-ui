import { IUxPod } from "../models/entities/base/IUxPod";
import { IApiResponse } from "../models/responses/IApiResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export default class PodSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.pod);
  }
  getAllPods = async (): Promise<IApiResponse<IUxPod>> => {
    let response: IApiResponse<IUxPod>;
    try {
      const axiosResp = await this.runGet<IUxPod>({
        action: ServerConfig.ords.customActions.gets.pods,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
