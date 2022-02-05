import _ from "lodash";
import { ApiResponse } from "../../models/data/Impl/ApiResponse";
import { IOracleResponse } from "../../models/data/Interfaces/OracleApi/IOracleResponse";
import { ICnvValErrorAttr } from "../../models/data/Interfaces/ORDS/ICnvValErrorAttr";
import { ServerConfig } from "../../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class CnvDataService extends OracleRestServiceBase {
  async getAttributes(): Promise<ApiResponse<ICnvValErrorAttr>> {
    let response = new ApiResponse<ICnvValErrorAttr>();
    try {
      let axiosResp = await this.runGetManyWithAction<ICnvValErrorAttr>(ServerConfig.ords.customActions.getAllAttr);
      response.collection = axiosResp.data;

      // do we have more?
      while (axiosResp.data.hasMore) {
        const moreLink = _.find(axiosResp.data.links, (link) => {
          return link.rel.toUpperCase() === "NEXT";
        });
        if (moreLink && moreLink.href) {
          axiosResp = await this.runGetManyAbsUrl<ICnvValErrorAttr>(moreLink.href);
          const existingItems = response.collection.items;
          response.collection = axiosResp.data;
          response.collection.items = [...existingItems, ...axiosResp.data.items];
        }
      }
    } catch (e) {
      response.error = this.handleError(e, "GET", "ORDS_API_EXCEPTION");
    }
    return response;
  }
}
