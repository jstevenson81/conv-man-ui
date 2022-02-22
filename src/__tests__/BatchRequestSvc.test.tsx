import { IBatchWithPodName } from "../services/models/data/interfaces/ords/module/api/IBatchWithPodName";
import { IGetResp } from "../services/models/data/interfaces/responses/IGetResp";
import { BatchRequestSvc } from "../services/ords/BatchRequestSvc";

describe("GET tests", () => {
  let svc: BatchRequestSvc;

  beforeAll((): void => {
    svc = new BatchRequestSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("service should get all batches", (done: jest.DoneCallback) => {
    svc.getAll().then((response: IGetResp<IBatchWithPodName>) => {
      expect(response).not.toBeUndefined();
      expect(response.data.links!.length).toBeGreaterThan(0);
      expect(response.data.links![0].rel).toEqual("self");
      done();
    });
  });
});
