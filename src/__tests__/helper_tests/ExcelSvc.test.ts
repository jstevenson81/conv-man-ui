import ExcelSvc from "../../services/ExcelSvc";
import buildTables from "../../components/pageParts/convErrorManager/ConvManErrorTableHelpers";

describe("create xlsx tests", () => {
  let svc: ExcelSvc;

  beforeAll((): void => {
    svc = new ExcelSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("service should create workbook from tables", (done: jest.DoneCallback) => {
    buildTables("testerrors1").then((tables) => {
      const buffer = svc.jsonToBook(tables);
      console.info(buffer);
      expect(true).toBeTruthy();
      done();
    });
  }, 60000);
});
