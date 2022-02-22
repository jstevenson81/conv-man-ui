import { DateTime } from "luxon";
import { IBatchWithPodName } from "../services/models/entities/api/IBatchWithPodName";
import { IGetResp } from "../interfaces/responses/IGetResp";
import { BatchRequestSvc } from "../services/ords/BatchRequestSvc";

describe("POST, PUT, DELETE Tests", () => {
  let svc: BatchRequestSvc;

  beforeAll((): void => {
    svc = new BatchRequestSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("should create a batch request", (done: jest.DoneCallback) => {
    svc
      .create({
        pod_url: "https://www.oracle.com/",
        cnv_batch: `testbatch_${DateTime.now().toMillis().toString()}`,
        created_by: "jsteve81@gmail.com",
        updated_by: null,
        updated_on: null,
        ux_batch_request_id: null,
        created_on: null,
      })
      .then((resp) => {
        console.log(resp);
        expect(resp).not.toBeUndefined();
        expect(resp.data.item!.ux_batch_request_id).toBeGreaterThan(1);
        done();
      });
  });
});

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
