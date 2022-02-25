import _ from "lodash";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import { IConvManFile } from "../components/forms/interfaces/IConvManFileInputState";
import { IConvManErrorTableDef } from "../components/pageParts/convErrorManager/interfaces/IConvManErrorTableDef";
import { CnvSpreadsheet } from "../models/entities/base/CnvSpreadsheet";
import { ICnvSpreadsheet } from "../models/entities/base/ICnvSpreadsheet";

export default class ExcelSvc {
  //#region Parsing a sheet to CSV methods
  sheetToCsv(config: { workbook: IConvManFile; sheetToRead: string; batchName: string, createdBy: string; }): Array<ICnvSpreadsheet> {
    const wb = XLSX.read(config.workbook.data);
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[config.sheetToRead]);
    const arr = new Array<ICnvSpreadsheet>();

    Papa.parse(csv, {
      complete: (csvData) => {
        let i = 0;
        csvData.data.forEach((d) => {
          // we want to start with the 6th index
          if (i > 5) {
            const row = this.createSpreadsheetRow(d, config.batchName, config.createdBy, config.sheetToRead);

            arr.push(row);
          }
          i++;
        });
      },
    });
    return arr;
  }

  createSpreadsheetRow(row: any, batchName: string, createdBy: string, sheetName: string): ICnvSpreadsheet {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => {
      return String.fromCharCode(x);
    });
    let i = 0;
    let timesThroughAlphabet = 0;
    const columns = _.keysIn(row);
    const spRow = new CnvSpreadsheet();
    columns.forEach((col: string) => {
      let colName: string = "column_";
      if (timesThroughAlphabet === 0) colName += alphabet[i];
      else if (timesThroughAlphabet === 1) colName += alphabet[timesThroughAlphabet].toLowerCase() + alphabet[i];
      colName = colName.toLowerCase();
      if (row[col].indexOf("MERGE|") === -1) {
        spRow[colName] = row[col];
      }
      // increment i and the times through alphabet
      i++;
      if (i === alphabet.length) timesThroughAlphabet++;
    });
    spRow.cnv_batch = batchName;
    spRow.spreadsheet_name = sheetName;
    spRow.created_by = createdBy;

    return spRow;
  }

  //#endregion

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
}
