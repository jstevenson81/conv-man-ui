import { DateTime } from "luxon";
import { CnvDataService } from "../services/ords/customMethods/CnvDataService";
import { CnvSpreadsheetService } from "../services/ords/autoRest/SpreadsheetSvc";
import { UxBatchService } from "../services/ords/BatchRequestSvc";
import { IApiResponse } from "../services/models/data/interfaces/Local/IApiResponse";
import { IValidationError } from "../services/models/data/interfaces/ords/module/api/IValidationError";
import { ICreateBatchRequest } from "../services/models/data/interfaces/ords/ICreateBatchRequest";

beforeEach((): void => {
  jest.useRealTimers();
  jest.setTimeout(60000);
});

test("service should get all attributes", (done: jest.DoneCallback) => {
  const svc = new CnvDataService();
  svc.getAttributes().then((response) => {
    expect(response).not.toBeUndefined();
    expect(response.oracleResponse?.hasMore).toBeFalsy();
    expect(response.oracleResponse?.items.length).toBeGreaterThan(0);
    done();
  });
});

test("service should get all errors by batch", (done: jest.DoneCallback) => {
  const svc = new CnvDataService();
  svc.getErrorsByBatch("testerrors1").then((response: IApiResponse<IValidationError>) => {
    expect(response).not.toBeUndefined();
    expect(response.oracleResponse?.hasMore).toBeFalsy();
    expect(response.oracleResponse?.items.length).toBeGreaterThan(0);
    done();
  });
});

test("service should create a batch record", (done: jest.DoneCallback) => {
  const svc = new UxBatchService();
  const body: ICreateBatchRequest = {
    cnv_batch: DateTime.now().toMillis().toString(),
    pod_url: "https://www.oracle.com/0242398d-c57b-4021-a911-857efe4a5a1b",
    created_by: "jsteve81@gmail.com",
  };
  svc.createBatchRequest({ ...body }).then((resp: IApiResponse<ICreateBatchRequest>) => {
    expect(resp).not.toBeUndefined();
    expect(resp.singleOracleItem).not.toBeUndefined();
    expect(resp.singleOracleItem?.ux_batch_request_id).toBeGreaterThan(1);
    done();
  });
});
