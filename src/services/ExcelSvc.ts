import _ from "lodash";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import {IConvManFile} from "../components/forms/interfaces/IConvManFileInputState";
import {IConvManErrorTableDef} from "../components/pageParts/convErrorManager/interfaces/IConvManErrorTableDef";
import {CnvSpreadsheet} from "../models/entities/base/CnvSpreadsheet";
import {ICnvSpreadsheet} from "../models/entities/base/ICnvSpreadsheet";

export default class ExcelSvc {
    //#region Parsing a sheet to CSV methods
    sheetToCsv(config: {
        workbook: IConvManFile;
        sheetToRead: string;
        batchName: string;
        createdBy: string;
    }): Array<ICnvSpreadsheet> {
        const wb = XLSX.read(config.workbook.data, {raw: true, dateNF: "MM/DD/YYYY"});
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[config.sheetToRead], {});
        const arr = new Array<ICnvSpreadsheet>();

        Papa.parse(csv, {
            complete: (csvData) => {
                let processFollowingRows = false;
                csvData.data.forEach((d: any) => {
                    if (processFollowingRows) {
                        const row = this.createSpreadsheetRow({row: d, ...config});
                        // if we don't have a blank row, then push
                        // the row to the array
                        if (!_.isUndefined(row)) arr.push(row);
                    }
                    // we want to start with the row past the row where the
                    // first column = HDL Field or HDL Header
                    const firstCol = d[0].toString().toUpperCase();
                    if (firstCol === "HDL FIELD" || firstCol === "HDL HEADER") {
                        processFollowingRows = true;
                    }
                });
            },
        });
        return arr;
    }

    createSpreadsheetRow(config: {
        row: any;
        batchName: string;
        createdBy: string;
        sheetToRead: string;
    }): ICnvSpreadsheet | undefined {
        const alpha = Array.from(Array(26)).map((e, i) => i + 65);
        const alphabet = alpha.map((x) => {
            return String.fromCharCode(x);
        });
        console.log(alphabet)
        // this is the column index
        let columnNumber = 0;
        // this is the number of times we go past z
        let timesThroughAlphabet = 0;
        // this is the columns from the passed in row
        const columns = _.keysIn(config.row);
        // these two vars help us determine if the row is blank
        // we need to subtract 1 from the length because
        // we always start with the second column
        const colCount = columns.length - 1;
        let blankCols = 0;

        // create a new spreadsheet row so
        // we can set its values
        const spRow = new CnvSpreadsheet();

        // loop through the columns in the row mapping
        // the input data to a common structure CnvSpreadsheet
        columns.forEach((col: string) => {

            let colName: string = "column_";
            if (timesThroughAlphabet === 0) colName += alphabet[columnNumber];
            else colName += alphabet[timesThroughAlphabet - 1].toLowerCase() + alphabet[columnNumber];


            // lower case the column name
            colName = colName.toLowerCase();


            // do we have a blank column or a column
            // that should not be added
            if (config.row[col].indexOf("MERGE|") === -1) {
                spRow[colName] = config.row[col];
            }
            // increment i and the times through alphabet
            columnNumber++;
            if (columnNumber === alphabet.length) {
                timesThroughAlphabet += 1;
                columnNumber = 0;
            }
        });
        // if this is a blank row, we need to not add it to the array, so return
        // undefined
        if (_.isEmpty(spRow.column_b)) return undefined;

        // set the properties of the row that are outside of the
        // input row from the spreadsheet
        spRow.cnv_batch = config.batchName;
        spRow.spreadsheet_name = config.sheetToRead;
        spRow.created_by = config.createdBy;

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
                        mappedRow = {...mappedRow, [colHeader.hdlColumnText]: row[key]};
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
