import _ from "lodash";
import { IConvManCol } from "../../../interfaces/IConvManCol";
import { IValidationError } from "../../../models/entities/api/IValidationError";
import { IValidationErrorAttr } from "../../../models/entities/api/IValidationErrorAttr";
import ErrorMgmtSvc from "../../../services/ErrorMgmtSvc";
import { IConvManErrorTableDef } from "./interfaces/IConvManErrorTableDef";
import { IConvManRowsCols } from "./interfaces/IConvManRowsCols";

const getData = async (batchName: string): Promise<IConvManRowsCols> => {
  const svc = new ErrorMgmtSvc();
  const data = await svc.getErrorsByBatch(batchName);
  const attrs = await svc.getErrorAttributes();
  console.log(attrs);
  return { rows: data, columns: attrs };
};

const getTableCols = (
  attrs: Array<IValidationErrorAttr>,
  row: IValidationError
): Array<IConvManCol<IValidationError>> => {
  const cols: Array<IConvManCol<IValidationError>> = new Array<IConvManCol<IValidationError>>();
  _.keysIn(row).forEach((key: string) => {
    const header = _.find(attrs, (attr: IValidationErrorAttr) => {
      return (
        attr.cnv_data_column.toUpperCase() === key.toUpperCase() &&
        row.obj_key.toUpperCase() === attr.obj_key.toUpperCase()
      );
    });
    if (header && header.display_name) {
      console.log({ header, key });
      cols.push({
        Header: header.display_name,
        accessor: key,
        id: key,
        headerText: header.display_name,
        hdlColumnText: header.hdl_column_name,
      });
    }
  });
  return cols;
};

const buildTables = async (batchName: string): Promise<Array<IConvManErrorTableDef>> => {
  const { rows, columns } = await getData(batchName);
  if (_.isEmpty(rows.entities)) return [];
  if (_.isEmpty(columns.entities))
    throw new Error("The database services returned no attributes.  Errors cannot be built without attributes.");

  let table: IConvManErrorTableDef = { data: [], columns: [], sheetName: "", objectKey: "", key: 0 };
  const tables: Array<IConvManErrorTableDef> = [];

  const orderedRows = _.orderBy(rows.entities, ["spreadsheet_name"]);
  let spName: string = "";
  orderedRows.forEach((row) => {
    if (spName === row.spreadsheet_name) {
      table.data.push(row);
    } else {
      if (spName !== "") tables.push(table);
      table = {
        data: [row],
        columns: getTableCols(columns.entities, row),
        sheetName: row.spreadsheet_name,
        objectKey: row.obj_key,
        key: row.stg_key_id,
      };
      table.columns.unshift({
        accessor: "stg_error_msg",
        Header: "Error Message",
        id: "stg_error_msg",
        headerText: "Error Message",
        hdlColumnText: "Error Message",
      });
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
