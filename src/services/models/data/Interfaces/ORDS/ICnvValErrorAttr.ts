import { IOracleItem } from "../OracleApi/IOracleItem";


export interface ICnvValErrorAttr extends IOracleItem {
  cnv_data_column: string;
  display_name: string;
  obj_key: string;
}
