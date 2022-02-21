import { IConvManError } from "../../../errors/IOracleApiError";
import { IOracleModuleItem } from "../ords/module/base/IOracleModuleItem";
import { IOracleModuleResponse } from "../ords/module/base/IOracleModuleResponse";

export interface IGetResp<TItemType extends IOracleModuleItem> {
  data: IOracleModuleResponse<TItemType>;
  error: IConvManError | null;
}
