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
