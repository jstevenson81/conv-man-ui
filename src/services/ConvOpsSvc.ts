import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export interface IConvOpProps {
  p_batch: string;
  p_hdl_line_name: string;
  p_root_obj_name: string;
}

export default class ConvOpsSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.convPackage);
  }

  executeConversionOp = async (config: IConvOpProps, action: string): Promise<any> => {
    try {
      const response = await this.runPost<any, any>({
        action: action,
        contentType: "application/json",
        body: { ...config },
      });
      return response;
    } catch (e) {
      throw e;
    }
  };

  executeBatchPackage = async (config: IConvOpProps): Promise<any> => {
    let response = this.initApiResponse();
    try {
      const moveResp = await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.moveToCnv);
      return moveResp;
    } catch (e) {
      response = this.handleError({ e, code: "POST", reqType: "ORDS_API_EXCEPTION" });
    }
    return response;
  };
}
