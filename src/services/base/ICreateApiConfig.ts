import { HttpHeaderContentType } from "./HttpHeaderContentType";


export interface ICreateApiConfig<T> {
  body: T;
  contentType: HttpHeaderContentType;
  action?: string;
}
