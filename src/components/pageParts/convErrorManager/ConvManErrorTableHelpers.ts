import _ from "lodash";

import { IConvManCol } from "../../../interfaces/IConvManCol";
import { IValidationError } from "../../../models/entities/api/IValidationError";
import { IValidationErrorAttr } from "../../../models/entities/api/IValidationErrorAttr";
import { BatchRequestSvc } from "../../../services/BatchRequestSvc";
import ErrorMgmtSvc from "../../../services/ErrorMgmtSvc";
import { IConvManErrorTableDef } from "./interfaces/IConvManErrorTableDef";
import { IConvManRowsCols } from "./interfaces/IConvManRowsCols";

export type IPieChartData = {
  name: string;
  value: number;
};

export type ISummaryData = {
  name: string;
  value: number;
};

const getData = async (batchName: string): Promise<IConvManRowsCols> => {
  const svc = new ErrorMgmtSvc();
  const data = await svc.getErrorsByBatch(batchName);
  const attrs = await svc.getErrorAttributes();
  return { rows: data, columns: attrs };
};

//#region table setup
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
  const sps = orderedRows.map((r) => {
    return r.spreadsheet_name;
  });

  const unqSps = _.uniq(sps);

  unqSps.forEach((spName) => {
    const spRows = _.filter(orderedRows, (row) => {
      return row.spreadsheet_name === spName;
    });

    if (spRows && spRows.length > 0) {
      const firstRow = spRows[0];
      table = {
        data: spRows,
        columns: getTableCols(columns.entities, firstRow),
        sheetName: firstRow.spreadsheet_name,
        objectKey: firstRow.obj_key,
        key: firstRow.stg_key_id,
      };
      table.columns.unshift({
        accessor: "stg_error_msg",
        Header: "Error Message",
        id: "stg_error_msg",
        headerText: "Error Message",
        hdlColumnText: "Error Message",
      });
      tables.push(table);
    }
  });
  return tables;
};
//#endregion

//#region build chart data

export const buildErrorPieData = (data: Array<IConvManErrorTableDef>): Array<IPieChartData> => {
  const pieData: Array<IPieChartData> = [];
  data.forEach((table) => {
    pieData.push({ name: table.sheetName, value: table.data.length });
  });
  return pieData;
};

export const buildTotalLineData = async (batchName: string): Promise<ISummaryData[]> => {
  const svc = new BatchRequestSvc();
  const data = await svc.getTotalBatchLines(batchName);
  const ret: ISummaryData[] = [];
  const ordered = _.orderBy(data.entities, "hdl_line_name");
  const hdlLineNames = ordered.map((o) => o.hdl_line_name);
  const uniqHdlLineNames = _.uniq(hdlLineNames);
  uniqHdlLineNames.forEach((hdlLine) => {
    var lines = _.filter(ordered, (o) => {
      return o.hdl_line_name === hdlLine;
    });
    const mapped: ISummaryData[] = lines.map((l) => {
      return { name: l.hdl_line_name, value: l.totalrows };
    });
    ret.push(...mapped);
  });
  return ret;
};

//#endregion

export default buildTables;
