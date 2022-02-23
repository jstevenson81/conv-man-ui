import _ from "lodash";
import { IValidationError } from "../models/entities/api/IValidationError";
import { IValidationErrorAttr } from "../models/entities/api/IValidationErrorAttr";
import { IUxBatchRequest } from "../models/entities/base/IUxBatchRequest";
import { IApiResponse } from "../models/responses/IApiResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export default class ErrorMgmtSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }
  getErrorAttributes = async (): Promise<IApiResponse<IValidationErrorAttr>> => {
    let response: IApiResponse<IValidationErrorAttr>;
    try {
      const axiosResp = await this.runGet<IValidationErrorAttr>({
        action: ServerConfig.ords.customActions.gets.attributes,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };

  getErrorsByBatch = async (batch: string): Promise<IApiResponse<IValidationError>> => {
    let response: IApiResponse<IValidationError>;
    try {
      const action = ServerConfig.ords.customActions.gets.errorsByBatch.replace("{{batch}}", batch);
      // get the initial response
      let axiosResp = await this.runGet<IValidationError>({
        action: action,
        pathOrEntity: ServerConfig.ords.entities.customMethods,
      });
      response = await this.constructEntities(axiosResp);
    } catch (e) {
      response = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
