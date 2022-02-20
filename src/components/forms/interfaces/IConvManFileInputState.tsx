import { Stream } from "stream";

export type IConvManFile = {
  fileName: string;
  fileExt: string;
  lastModified: string;
  data: ArrayBuffer;
};
