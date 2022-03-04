import { AxiosResponse } from "axios";

import { IConvOpInput } from "../models/entities/base/IConvOpInput";
import { IConvOpResponse } from "../models/responses/IConvOpResponse";
import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export default class ConvOpsSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.convPackage);
  }

  executeConversionOp = async (config: IConvOpInput, action: string): Promise<AxiosResponse<IConvOpResponse>> => {
    try {
      const response = await this.runPost<IConvOpResponse, IConvOpInput>({
        action: action,
        contentType: "application/json",
        body: { ...config },
      });
      if (response.data["~ret"] && response.data["~ret"] !== "SUCCESS")
        throw new Error(
          `The action ${action} failed to execute.  This means the conversion attempt was not successful.  Please try to submit your ${action} again.`
        );

      return response;
    } catch (e) {
      throw e;
    }
  };

  executeBatchPackage = async (config: IConvOpInput): Promise<any> => {
    let response = this.initApiResponse();
    try {
      await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.moveToCnv);
      await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.updateDateCnv);
      const validateResponse = await this.executeConversionOp(
        config,
        ServerConfig.ords.customActions.posts.validateCnv
      );
      console.log(validateResponse);
      response.entities.push(validateResponse.data);
    } catch (e) {
      response = this.handleError({ e, code: "POST", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
