import { IOracleItem } from "../OracleApi/IOracleItem";

export default interface IWorksheet extends IOracleItem {
  spreadsheet_name: string;
}
