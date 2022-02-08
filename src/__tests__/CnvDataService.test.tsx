import { CnvDataService } from "../services/data/CnvDataService";
import { ServerConfig } from "../ServerConfig";
import { IApiResponse } from "../models/data/Interfaces/Local/IApiResponse";
import { ICnvValError } from "../models/data/Interfaces/ORDS/ICnvValError";

beforeEach((): void => {
  jest.useRealTimers();
  jest.setTimeout(60000);
});

test("service should get all attributes", (done: jest.DoneCallback) => {
  const svc = new CnvDataService({ ordsUri: ServerConfig.ords.url, entity: ServerConfig.ords.entities.customMethods });
  svc.getAttributes().then((response) => {
    expect(response).not.toBeUndefined();
    expect(response.oracleResponse?.hasMore).toBeFalsy();
    expect(response.oracleResponse?.items.length).toBeGreaterThan(0);
    done();
  });
}, 60000);

test("service should get all errors by batch", (done: jest.DoneCallback) => {
  const svc = new CnvDataService({ ordsUri: ServerConfig.ords.url, entity: ServerConfig.ords.entities.customMethods });
  svc.getErrorsByBatch("testerrors1").then((response: IApiResponse<ICnvValError>) => {
    expect(response).not.toBeUndefined();
    expect(response.oracleResponse?.hasMore).toBeFalsy();
    expect(response.oracleResponse?.items.length).toBeGreaterThan(0);
    done();
  });
}, 60000);
