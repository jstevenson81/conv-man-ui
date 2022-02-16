import _ from "lodash";
import Papa from "papaparse";
import { CnvSpreadsheet } from "../../models/data/Impl/CnvSpreadsheet";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";

export class SpreadsheetService extends OracleRestServiceBase {
  constructor(httpConfig: { ordsUri: string; entity: string }) {
    super(httpConfig);
  }

  async saveFile(config: {
    fileName: string;
    parsedCsv: Papa.ParseResult<any>;
    podId: number;
    batchName: string;
    createdBy: string;
  }): Promise<any> {
    const localData = localStorage.getItem(config.fileName);
    if (!localData) throw new Error(`The file name ${config.fileName} was not found in local storage.`);

    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));

    let spRows: Array<CnvSpreadsheet> = [];
    config.parsedCsv.data.map((row, idx) => {
      let spRow = new CnvSpreadsheet();
      let i = 0;
      let timesThroughAlphabet = 0;
      const columns = _.keysIn(row);
      columns.map((col: any, colIdx: number) => {
        let colName: string = "COLUMN_";

        if (timesThroughAlphabet === 0) colName += alphabet[i];
        else if (timesThroughAlphabet === 1) colName += alphabet[timesThroughAlphabet] + alphabet[i];
        spRow[colName] = row[col];

        i++;
        if (i === alphabet.length) timesThroughAlphabet++;
      });
      spRow.CNV_BATCH = config.batchName;
      spRow.CREATED_BY = config.createdBy;
      spRow.SPREADSHEET_NAME = config.fileName;
      spRows.push(spRow);
    });

    const csv = Papa.unparse(spRows);
    return await this.runPost<any>({ action: "batchload", body: csv, contentType: "text/csv" });
  }
}
