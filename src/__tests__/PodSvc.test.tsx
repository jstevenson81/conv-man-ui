import PodSvc from "../services/ords/PodSvc";

describe("GET tests", () => {
  let svc: PodSvc;
  beforeEach(() => {});
  beforeAll(() => {
    svc = new PodSvc();
  });

  it("get all should return pods", (done: jest.DoneCallback) => {
    svc.getAll().then((response) => {
      expect(response).not.toBeUndefined();
      expect(response.data.items.length).toBeGreaterThan(0);

      done();
    });
  });
});
