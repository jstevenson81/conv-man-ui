import { IOracleItem } from "../OracleApi/IOracleItem";

export interface IUxConversionType extends IOracleItem {
  ux_conversion_type_id: number;
  conversion_type_name: string;
  template_csv_name: string;
}
