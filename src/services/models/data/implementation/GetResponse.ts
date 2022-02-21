import { IConvManError } from "../../errors/IOracleApiError";
import { ILink } from "../interfaces/ords/base/IOracleLink";
import { IOracleModuleItem } from "../interfaces/ords/module/base/IOracleModuleItem";
import { IOracleModuleResponse } from "../interfaces/ords/module/base/IOracleModuleResponse";
import { IGetResp } from "../interfaces/responses/IGetResp";

export class GetResponse<T extends IOracleModuleItem> implements IGetResp<T> {
  data: IOracleModuleResponse<T>;
  error: IConvManError | null;

  constructor() {
    this.data = { count: 0, hasMore: false, items: new Array<T>(), limit: 0, links: new Array<ILink>(), offset: 0 };
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
