import { IConvManError } from "../../errors/IOracleApiError";
import { IOracleAutoRestItem } from "../interfaces/ords/autoRest/base/IOracleAutoRestItem";
import { IOracleAutoRestResponse } from "../interfaces/ords/autoRest/base/IOracleAutoRestResponse";
import { IOracleLink } from "../interfaces/ords/base/IOracleLink";
import { IPutPostDeleteResp } from "../interfaces/responses/IPutPostDeleteResp";


export class PutPostDeleteRespose<T extends IOracleAutoRestItem> implements IPutPostDeleteResp<T> {
  data: IOracleAutoRestResponse<T>;
  error: IConvManError;

  constructor() {
    this.data = { hasMore: false, count: 0, item: null, limit: 0, links: new Array<IOracleLink>(), offset: 0 };
    this.error = {
      message: "",
      name: "",
      code: "",
      instance: "",
      requestPath: "",
      stack: "",
      title: "",
      type: "API_GET_EXCEPTION",
    };
  }
}
