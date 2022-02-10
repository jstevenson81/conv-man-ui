import _ from "lodash";
import { ApiResponse } from "../../models/data/Impl/ApiResponse";
import { IApiResponse } from "../../models/data/Interfaces/Local/IApiResponse";
import { ICnvValError } from "../../models/data/Interfaces/ORDS/ICnvValError";
import { ICnvValErrorAttr } from "../../models/data/Interfaces/ORDS/ICnvValErrorAttr";
import { ServerConfig } from "../../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";
import { IConvManCol } from "../../models/data/Interfaces/Local/IConvManCol";

export class CnvDataService extends OracleRestServiceBase {
  async getAttributes(): Promise<ApiResponse<ICnvValErrorAttr>> {
    let response = new ApiResponse<ICnvValErrorAttr>();
    try {
      let axiosResp = await this.runGetManyWithAction<ICnvValErrorAttr>(ServerConfig.ords.customActions.getAllAttr);
      axiosResp = await this.getMore(axiosResp);
      response.oracleResponse = axiosResp.data;
    } catch (e) {
      response.error = this.handleError(e, "GET", "ORDS_API_EXCEPTION");
    }
    return response;
  }

  async getErrorsByBatch(batch: string): Promise<IApiResponse<ICnvValError>> {
    let response = new ApiResponse<ICnvValError>();
    try {
      const action = ServerConfig.ords.customActions.getErrorsByBatch.replace("{{batch}}", batch);
      // get the initial response
      let axiosResp = await this.runGetManyWithAction<ICnvValError>(action);
      // do we have more?
      axiosResp = await this.getMore(axiosResp);
      response.oracleResponse = axiosResp.data;
    } catch (e) {
      response.error = this.handleError(e, "GET", "ORDS_API_EXCEPTION");
    }
    return response;
  }

  getCols(errors: IApiResponse<ICnvValError>, attrs: IApiResponse<ICnvValErrorAttr>): Array<IConvManCol<ICnvValError>> {
    const cols = new Array<IConvManCol<ICnvValError>>();
    const firstRow = _.first(errors.oracleResponse?.items);
    _.each(_.keysIn(firstRow), (key: string) => {
      const header = _.find(attrs.oracleResponse?.items, (attr: ICnvValErrorAttr) => {
        return (
          attr.cnv_data_column.toUpperCase() === key.toUpperCase() &&
          attr.obj_key.toUpperCase() === firstRow?.obj_key.toUpperCase()
        );
      });
      if (header && header.display_name) cols.push({ Header: header.display_name, id: key, accessor: key });
    });
    return cols;
  }
}


