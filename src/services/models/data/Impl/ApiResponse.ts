import { IOracleApiError } from "../../errors/IOracleApiError";
import { IApiResponse } from "../Interfaces/Local/IApiResponse";
import { ILink } from "../Interfaces/OracleApi/IOracleLink";
import { IOracleResponse } from "../Interfaces/OracleApi/IOracleResponse";

export class ApiResponse<T> implements IApiResponse<T> {
  oracleResponse?: IOracleResponse<T>;
  singleOracleItem?: T;
  error?: IOracleApiError
  constructor() {
    this.oracleResponse = {
      items: new Array<T>(),
      hasMore: false,
      limit: 0,
      offset: 0,
      count: 0,
      links: new Array<ILink>(),
    };
    this.singleOracleItem = {} as T;
    this.error = {} as IOracleApiError;
  }
}
