import buildTables from "../../components/pageParts/convErrorManager/ConvManErrorTableHelpers";
import ExcelSvc from "../../services/ExcelSvc";

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
      const workbook = svc.jsonToBook(tables);
      expect(workbook.Sheets[workbook.SheetNames[0]]).not.toBeUndefined();
      done();
    });
  }, 60000);
});
