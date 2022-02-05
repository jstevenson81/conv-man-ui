import { CnvDataService } from "../services/data/CnvDataService";
import { ServerConfig } from "../ServerConfig";

beforeEach((): void => {
  jest.useRealTimers();
  jest.setTimeout(60000);
});

test("service should get all attributes", (done: jest.DoneCallback) => {
  const svc = new CnvDataService({ ordsUri: ServerConfig.ords.url, entity: ServerConfig.ords.entities.customMethods });
  svc.getAttributes().then((response) => {
    expect(response).not.toBeUndefined();
    expect(response.collection?.hasMore).toBeTruthy();
    console.log(response.collection?.count);
    done();
  });
}, 60000);
