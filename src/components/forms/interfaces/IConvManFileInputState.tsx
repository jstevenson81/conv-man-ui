import { Stream } from "stream";

export type IConvManFileInputState = {
  fileName: string;
  fileExt: string;
  lastModified: string;
  data: ArrayBuffer;
};
