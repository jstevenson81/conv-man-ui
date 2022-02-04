import { IOracleApiError } from "../../errors/IOracleApiError";
import { IApiResponse } from "../Interfaces/Local/IApiResponse";
import { IOracleItem } from "../Interfaces/OracleApi/IOracleItem";
import { IOracleLink } from "../Interfaces/IOracleLink";
import { IOracleResponse } from "../Interfaces/IOracleResponse";

export class ApiResponse<T> implements IApiResponse<T> {
  collection?: IOracleResponse<T>;
  item?: T;
  error?: IOracleApiError
  constructor() {
    this.collection = {
      items: new Array<T>(),
      hasMore: false,
      limit: 0,
      offset: 0,
      count: 0,
      links: new Array<IOracleLink>(),
    };
    this.item = {} as T;
    this.error = {} as IOracleApiError;
  }
}
