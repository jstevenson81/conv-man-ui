import ConvOpsSvc from "../../services/ConvOpsSvc";

describe("POST, PUT, DELETE Tests", () => {
  let svc: ConvOpsSvc;

  beforeAll((): void => {
    svc = new ConvOpsSvc();
  });

  beforeEach((): void => {
    jest.useRealTimers();
    jest.setTimeout(60000);
  });

  it("should call the move function", (done: jest.DoneCallback) => {
    svc.executeBatchPackage({ p_batch: "1645848882639", p_root_obj_name: "Grades", p_hdl_line_name: "Grades" }).then((resp) => {
      console.log(resp);
      expect(resp).not.toBeUndefined();
    });
  }, 60000);
});
