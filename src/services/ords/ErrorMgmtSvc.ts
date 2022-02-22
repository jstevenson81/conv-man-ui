import { ServerConfig } from "../../ServerConfig";
import { GetResponse } from "../models/data/implementation/GetResponse";
import { IValidationErrorAttr } from "../models/data/interfaces/ORDS/module/api/IValidationErrorAttr";
import { IGetResp } from "../models/data/interfaces/responses/IGetResp";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";


export default class ErrorMgmtSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }
  getAllAttrs = async (): Promise<IGetResp<IValidationErrorAttr>> => {
    const response = new GetResponse<IValidationErrorAttr>();
    try {
      const axiosResp = await this.runGet<IValidationErrorAttr>({
        action: ServerConfig.ords.customActions.gets.attributes,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response.data = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
