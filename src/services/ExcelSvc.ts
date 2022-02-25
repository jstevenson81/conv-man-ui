import _ from "lodash";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import { IConvManFile } from "../components/forms/interfaces/IConvManFileInputState";
import { IConvManErrorTableDef } from "../components/pageParts/convErrorManager/interfaces/IConvManErrorTableDef";
import { CnvSpreadsheet } from "../models/entities/base/CnvSpreadsheet";
import { ICnvSpreadsheet } from "../models/entities/base/ICnvSpreadsheet";

export default class ExcelSvc {
  sheetToCsv(config: { workbook: IConvManFile; sheetToRead: string; batchName: string }): Array<ICnvSpreadsheet> {
    const wb = XLSX.read(config.workbook.data);
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[config.sheetToRead]);
    const arr = new Array<ICnvSpreadsheet>();

    Papa.parse(csv, {
      complete: (csvData) => {
        let i = 0;
        csvData.data.forEach((d) => {
          // we want to start with the 6th index
          if (i > 5) {
            arr.push(this.createSpreadsheetRow(d, config.batchName));
          }
          i++;
        });
      },
    });
    return arr;
  }

  jsonToBook(tables: IConvManErrorTableDef[]): XLSX.WorkBook {
    const workbook = XLSX.utils.book_new();
    tables.forEach((table) => {
      let data: Array<any> = [];
      table.data.forEach((row) => {
        let mappedRow = {};
        _.keysIn(row).forEach((key) => {
          const colHeader = _.find(table.columns, (col) => {
            return col.accessor === key;
          });
          if (colHeader) {
            mappedRow = { ...mappedRow, [colHeader.hdlColumnText]: row[key] };
          }
        });
        data.push(mappedRow);
      });
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, sheet, table.sheetName);
    });
    return workbook;
  }

  createSpreadsheetRow(row: any, batchName: string): ICnvSpreadsheet {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => {
      return String.fromCharCode(x);
    });
    let i = 0;
    let timesThroughAlphabet = 0;
    const columns = _.keysIn(row);
    const spRow = new CnvSpreadsheet();
    columns.forEach((col: any, colIdx: number) => {
      let colName: string = "COLUMN_";
      if (timesThroughAlphabet === 0) colName += alphabet[i];
      else if (timesThroughAlphabet === 1) colName += alphabet[timesThroughAlphabet] + alphabet[i];
      spRow[colName] = row[col];
      i++;
      if (i === alphabet.length) timesThroughAlphabet++;
    });
    spRow.CNV_BATCH = batchName;
    return spRow;
  }
}
