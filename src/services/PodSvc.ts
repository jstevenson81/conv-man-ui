import { IUxPod } from "../models/entities/base/IUxPod";
import { IApiResponse } from "../models/responses/IApiResponse";
import { IUxPodAutoRestResponse } from "../models/responses/IBatchAutoRestResponse";
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

  createPod = async (pod: IUxPod): Promise<IApiResponse<IUxPod>> => {
    let response = this.initApiResponse<IUxPod>();
    try {
      const axiosResp = await this.runPost<IUxPodAutoRestResponse, IUxPod>({
        body: pod,
        contentType: "application/json",
      });
      response.entities[0] = axiosResp.data;
    } catch (e) {
      response = this.handleError<IUxPod>({ e, code: "POST", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
