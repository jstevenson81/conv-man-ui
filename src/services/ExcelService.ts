import _ from "lodash";
import Papa from "papaparse";
import { IConvManFile } from "../components/forms/interfaces/IConvManFileInputState";
import { CnvSpreadsheet } from "../models/entities/base/CnvSpreadsheet";
import * as XLSX from "xlsx";
import { ICnvSpreadsheet } from "../models/entities/base/ICnvSpreadsheet";

export default class ExcelSvc {
  sheetToCsv(config: { workbook: IConvManFile; sheetToRead: string; batchName: string }): Array<ICnvSpreadsheet> {
    const wb = XLSX.read(config.workbook.data);
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[config.sheetToRead]);
    const arr = new Array<ICnvSp>();

    Papa.parse(csv, {
      complete: (csvData) => {
        let i = 0;
        csvData.data.forEach((d) => {
          // we want to start with the 6th index
          if (i > 4) {
            arr.push(this.createSpreadsheetRow(d, config.batchName));
          }
          i++;
        });
      },
    });
    return arr;
  }

  createSpreadsheetRow(row: any, batchName: string): ICnvSp {
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
