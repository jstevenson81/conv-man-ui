import { IOracleMoreLinks } from "../../base/IOracleMoreLinks";
import { IOracleModuleItem } from "./IOracleModuleItem";


export interface IOracleModuleResponse<T extends IOracleModuleItem> extends IOracleMoreLinks {
  items: Array<T>;
}
