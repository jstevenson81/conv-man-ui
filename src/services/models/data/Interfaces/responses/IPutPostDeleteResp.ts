import { IConvManError } from "../../../errors/IOracleApiError";
import { IOracleAutoRestItem } from "../ords/autoRest/base/IOracleAutoRestItem";
import { IOracleAutoRestResponse } from "../ords/autoRest/base/IOracleAutoRestResponse";

export interface IPutPostDeleteResp<TItemType extends IOracleAutoRestItem> {
  data: IOracleAutoRestResponse<TItemType>;
  error: IConvManError | null;
}
