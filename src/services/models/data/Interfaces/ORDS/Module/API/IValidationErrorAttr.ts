import { IOracleModuleItem } from "../base/IOracleModuleItem";


export interface IValidationErrorAttr extends IOracleModuleItem {
  cnv_data_column: string;
  display_name: string;
  obj_key: string;
}
