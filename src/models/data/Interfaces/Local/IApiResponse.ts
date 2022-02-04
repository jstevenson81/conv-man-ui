import { IOracleResponse } from "../IOracleResponse";
import { IOracleItem } from "../OracleApi/IOracleItem";
import { IOracleApiError } from "../../../errors/IOracleApiError";

export interface IApiResponse<T extends IOracleItem> {
  item?: T;
  collection?: IOracleResponse<T>;
  error?: IOracleApiError;
}
