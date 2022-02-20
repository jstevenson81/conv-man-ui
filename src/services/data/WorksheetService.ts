import { ApiResponse } from "../models/data/Impl/ApiResponse";
import IWorksheet from "../models/data/Interfaces/ORDS/IWorksheet";
import { ServerConfig } from "../../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class WorksheetService extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.customMethods);
  }

  async getAll(): Promise<ApiResponse<IWorksheet>> {
    let response = new ApiResponse<IWorksheet>();
    try {
      const axiosResponse = await this.runGetManyWithAction<IWorksheet>(
        ServerConfig.ords.customActions.gets.getAllWorksheets
      );
      response.oracleResponse = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "GET", reqType: "API_GET_EXCEPTION" });
    }
    return response;
  }
}
