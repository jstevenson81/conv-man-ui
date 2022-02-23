import ErrorMgmtSvc from "../../services/ErrorMgmtSvc";

describe("GET tests", () => {
  let svc: ErrorMgmtSvc;

  beforeAll((): void => {
    svc = new ErrorMgmtSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("service should get all batches", (done: jest.DoneCallback) => {
    svc.getErrorAttributes().then((response) => {
      expect(response).not.toBeUndefined();
      expect(response.entities.length).toBeGreaterThan(0);
      done();
    });
  }, 60000);
});
