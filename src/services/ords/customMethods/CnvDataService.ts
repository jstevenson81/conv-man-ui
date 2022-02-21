import { IValidationError } from "../../models/data/interfaces/ords/module/api/IValidationError";
import { ServerConfig } from "../../../ServerConfig";
import { OracleRestServiceBase } from "../../data/base/OracleRestServiceBase";
import { IValidationErrorAttr } from "../../models/data/interfaces/ords/module/api/IValidationErrorAttr";
import { IGetResp } from "../../models/data/interfaces/responses/IGetResp";
import { GetResponse } from "../../models/data/implementation/GetResponse";

export class CnvDataService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getAttributes(): Promise<IGetResp<IValidationErrorAttr>> {
    let response: IGetResp<IValidationErrorAttr> = new GetResponse<IValidationErrorAttr>();
    try {
      let axiosResp = await this.runGetManyWithAction<IValidationErrorAttr>(
        ServerConfig.ords.customActions.gets.attributes
      );
      axiosResp = await this.getMore(axiosResp);
      response.data = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  }

  async getErrorsByBatch(batch: string): Promise<IGetResp<IValidationError>> {
    let response = new GetResponse<IValidationError>();
    try {
      const action = ServerConfig.ords.customActions.gets.errorsByBatch.replace("{{batch}}", batch);
      // get the initial response
      let axiosResp = await this.runGetManyWithAction<IValidationError>(action);
      // do we have more?
      axiosResp = await this.getMore(axiosResp);
      response.data = axiosResp.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  }
}
