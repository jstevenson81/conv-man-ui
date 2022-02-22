import { IConvManError } from "../../../errors/IOracleApiError";
import { IOracleModuleItem } from "../ORDS/module/base/IOracleModuleItem";
import { IOracleModuleResponse } from "../ORDS/module/base/IOracleModuleResponse";

export interface IGetResp<TItemType extends IOracleModuleItem> {
  data: IOracleModuleResponse<TItemType>;
  error: IConvManError | null;
}
