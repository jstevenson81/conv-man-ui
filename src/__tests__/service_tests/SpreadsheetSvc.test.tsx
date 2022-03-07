import { readFileSync } from "fs";
import { DateTime } from "luxon";

import { IConvManFile } from "../../components/forms/interfaces/IConvManFileInputState";
import ExcelSvc from "../../services/ExcelSvc";
import { SpreadsheetsSvc } from "../../services/SpreadsheetSvc";

describe("GET tests", () => {
  let svc: SpreadsheetsSvc;

  beforeAll((): void => {
    svc = new SpreadsheetsSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("get all should get unique worksheets", (done: jest.DoneCallback) => {
    svc.getWorksheets().then((resp) => {
      expect(resp).not.toBeUndefined();
      expect(resp.entities.length).toBeGreaterThan(0);
      done();
    });
  }, 60000);
});

describe("PUT, POST, DELETE tests", () => {
  let svc: SpreadsheetsSvc;

  beforeAll((): void => {
    svc = new SpreadsheetsSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("should read a file", (done: jest.DoneCallback) => {
    const dataArray = readFileSync("./public/templates/DC001.xlsx");
    expect(dataArray).not.toBeUndefined();
    expect(dataArray.length).toBeGreaterThan(100);
    done();
  });

  it("should parse a worksheet", (done: jest.DoneCallback) => {
    const svc = new ExcelSvc();
    const data = svc.sheetToCsv({
      batchName: DateTime.now().toMillis().toString(),
      createdBy: "jonatan",
      hdlObjKey: "OrgTree",
      sheetToRead: "OrgTree",
      workbook: {
        data: readFileSync("./public/templates/DC001.xlsx"),
        fileExt: "xlsx",
        fileName: "DC001.xlsx",
        lastModified: "blah",
      },
    });
    expect(data).not.toBeUndefined();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].column_a).toEqual("NPG_HR_ORG_TREE");
    done();
  }, 60000);

  it("should create a batch request and a CSV bulkload", (done: jest.DoneCallback) => {
    const file: IConvManFile = {
      fileExt: ".xlsx",
      fileName: "test.xlsx",
      lastModified: DateTime.now().toJSON(),
      data: readFileSync("./public/templates/DC001.xlsx"),
    };

    svc
      .createBatch({
        batchName: DateTime.now().toMillis().toString(),
        podUrl: "https://www.oracle.com/test",
        createdBy: "jsteve81@gmail.com",
        workbook: file,
        sheetToRead: "Grades",
        hdlObjKey: "",
      })
      .then((resp) => {
        expect(resp).not.toBeUndefined();
        expect(resp.batchCreateResponse.entities.length).toEqual(1);
        expect(resp.spCreateResp.status).toEqual(200);
        expect(resp.spCreateResp.statusText).toEqual("OK");
        done();
      });
  }, 60000);
});
