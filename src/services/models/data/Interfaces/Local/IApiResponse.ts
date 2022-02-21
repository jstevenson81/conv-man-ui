import { IOracleItem } from "../OracleApi/IOracleItem";
import { IOracleApiError } from "../../../errors/IOracleApiError";
import { IOracleResponse } from "../OracleApi/IOracleResponse";

export interface IApiResponse<T> {
  singleOracleItem?: T;
  oracleResponse?: IOracleResponse<T>;
  error?: IOracleApiError;
}
