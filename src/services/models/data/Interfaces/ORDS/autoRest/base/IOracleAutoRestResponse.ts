import { IOracleMoreLinks } from "../../base/IOracleMoreLinks";
import { IOracleAutoRestItem } from "./IOracleAutoRestItem";


export interface IOracleAutoRestResponse<T extends IOracleAutoRestItem> extends IOracleMoreLinks {
  item: T | null;
}
