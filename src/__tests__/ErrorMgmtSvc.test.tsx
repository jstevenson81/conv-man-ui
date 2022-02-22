import { IValidationErrorAttr } from "../services/models/data/interfaces/ORDS/module/api/IValidationErrorAttr";
import { IGetResp } from "../services/models/data/interfaces/responses/IGetResp";
import ErrorMgmtSvc from "../services/ords/ErrorMgmtSvc";

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
    svc.getAllAttrs().then((response: IGetResp<IValidationErrorAttr>) => {
      expect(response).not.toBeUndefined();
      expect(response.data.links!.length).toBeGreaterThan(0);
      expect(response.data.links![0].rel).toEqual("self");
      done();
    });
  });
});
