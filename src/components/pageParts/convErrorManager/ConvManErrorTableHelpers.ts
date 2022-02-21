import _ from "lodash";
import { CnvDataService } from "../../../services/ords/customMethods/CnvDataService";
import { IConvManCol } from "../../../services/models/data/interfaces/IConvManCol";
import { IValidationError } from "../../../services/models/data/interfaces/ords/module/api/IValidationError";
import { ICnvValErrorAttr } from "../../../services/models/data/interfaces/ords/ICnvValErrorAttr";
import { IConvManErrorTableDef } from "./interfaces/ICnvErrorTable";
import { IConvManRowsCols } from "./interfaces/IConvManRowsCols";

const getData = async (batchName: string): Promise<IConvManRowsCols> => {
  const svc = new CnvDataService();
  const data = await svc.getErrorsByBatch(batchName);
  const attrs = await svc.getAttributes();
  return { rows: data, columns: attrs };
};

const getTableCols = (attrs: Array<ICnvValErrorAttr>, row: IValidationError): Array<IConvManCol<IValidationError>> => {
  const cols: Array<IConvManCol<IValidationError>> = new Array<IConvManCol<IValidationError>>();
  _.keysIn(row).forEach((key: string) => {
    const header = _.find(attrs, (attr: ICnvValErrorAttr) => {
      return (
        attr.cnv_data_column.toUpperCase() === key.toUpperCase() &&
        row.obj_key.toUpperCase() === attr.obj_key.toUpperCase()
      );
    });
    if (header && header.display_name) {
      cols.push({ Header: header.display_name, accessor: key, id: key });
    }
  });
  return cols;
};

const buildTables = async (batchName: string): Promise<Array<IConvManErrorTableDef>> => {
  const { rows, columns } = await getData(batchName);
  if (_.isEmpty(rows.oracleResponse!.items)) return [];
  if (_.isEmpty(columns.oracleResponse!.items))
    throw new Error("The database services returned no attributes.  Errors cannot be built without attributes.");

  let table: IConvManErrorTableDef = { data: [], columns: [], sheetName: "", objectKey: "", key: 0 };
  const tables: Array<IConvManErrorTableDef> = [];

  const orderedRows = _.orderBy(rows.oracleResponse!.items, ["spreadsheet_name"]);
  let spName: string = "";
  orderedRows.forEach((row) => {
    if (spName === row.spreadsheet_name) {
      table.data.push(row);
    } else {
      if (spName !== "") tables.push(table);
      table = {
        data: [row],
        columns: getTableCols(columns.oracleResponse!.items, row),
        sheetName: row.spreadsheet_name,
        objectKey: row.obj_key,
        key: row.stg_key_id,
      };
      table.columns.unshift({ accessor: "stg_error_msg", Header: "Error Message", id: "stg_error_msg" });
    }
    spName = row.spreadsheet_name;
  });
  return tables;
};

export type IPieChartData = {
  name: string;
  value: number;
};

export const buildErrorPieData = (data: Array<IConvManErrorTableDef>): Array<IPieChartData> => {
  const pieData: Array<IPieChartData> = [];
  data.forEach((table) => {
    pieData.push({ name: table.sheetName, value: table.data.length });
  });
  return pieData;
};

export default buildTables;
