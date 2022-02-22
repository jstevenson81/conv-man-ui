import { IValidationErrorAttr } from "../services/models/entities/api/IValidationErrorAttr";
import { IGetResp } from "../interfaces/responses/IGetResp";
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
