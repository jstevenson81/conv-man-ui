import PodSvc from "../../services/PodSvc";

describe("GET tests", () => {
  let svc: PodSvc;
  beforeEach(() => {});
  beforeAll(() => {
    svc = new PodSvc();
  });

  it("get all should return pods", (done: jest.DoneCallback) => {
    svc.getAllPods().then((response) => {
      expect(response).not.toBeUndefined();
      expect(response.entities.length).toBeGreaterThan(0);

      done();
    });
  });
});
