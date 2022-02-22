import { IConvManError } from "../../errors/IOracleApiError";
import { IOracleLink } from "../interfaces/ords/base/IOracleLink";
import { IOracleModuleItem } from "../interfaces/ORDS/module/base/IOracleModuleItem";
import { IOracleModuleResponse } from "../interfaces/ORDS/module/base/IOracleModuleResponse";
import { IGetResp } from "../interfaces/responses/IGetResp";

export class GetResponse<T extends IOracleModuleItem> implements IGetResp<T> {
  data: IOracleModuleResponse<T>;
  error: IConvManError | null;

  constructor() {
    this.data = { count: 0, hasMore: false, items: new Array<T>(), limit: 0, links: new Array<IOracleLink>(), offset: 0 };
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
