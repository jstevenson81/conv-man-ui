import { DateTime } from "luxon";

import { BatchRequestSvc } from "../../services/BatchRequestSvc";

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
      .createBatchRequest({
        pod_url: "https://www.oracle.com/",
        cnv_batch: `testbatch_${DateTime.now().toMillis().toString()}`,
        created_by: "jsteve81@gmail.com",
        updated_by: null,
        updated_on: null,
        ux_batch_request_id: null,
        created_on: null,
      })
      .then((resp) => {
        expect(resp).not.toBeUndefined();
        expect(resp.entities[0].ux_batch_request_id).toBeGreaterThan(1);
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
    svc.getAllBatches().then((response) => {
      expect(response).not.toBeUndefined();
      expect(response.entities.length).toBeGreaterThan(0);
      done();
    });
  });
});
