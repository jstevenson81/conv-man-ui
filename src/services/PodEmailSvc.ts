import { IUxPodEmail } from "../models/entities/base/IUxPodEmail";
import { IApiResponse } from "../models/responses/IApiResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export default class PodEmailSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.podEmails);
  }
  getAllPodEmails = async (): Promise<IApiResponse<IUxPodEmail>> => {
    let response: IApiResponse<IUxPodEmail>;
    try {
      const axiosResp = await this.runGet<IUxPodEmail>({
        action: ServerConfig.ords.customActions.gets.podEmails,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
