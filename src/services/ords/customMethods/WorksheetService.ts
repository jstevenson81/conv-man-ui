import { ApiResponse } from "../models/data/implementation/ApiResponse";
import IWorksheet from "../models/data/interfaces/ords/IWorksheet";
import { ServerConfig } from "../../../ServerConfig";
import { OracleRestServiceBase } from "../../data/base/OracleRestServiceBase";

export class WorksheetService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getAll(): Promise<ApiResponse<IWorksheet>> {
    let response = new ApiResponse<IWorksheet>();
    try {
      const axiosResponse = await this.runGetManyCustom<IWorksheet>(
        ServerConfig.ords.customActions.gets.worksheets
      );
      response.oracleResponse = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "API_GET_EXCEPTION" });
    }
    return response;
  }
}
