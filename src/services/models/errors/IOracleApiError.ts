export type ErrorCodes = "POST" | "GET";
export type ErrorTypes = "API_POST_EXCEPTION" | "API_GET_EXCEPTION" | "ORDS_API_EXCEPTION";

export interface IConvManError extends Error {
  title?: string | null;
  requestPath?: string | null;
  type?: ErrorTypes | null;
  instance?: string | null;
  code?: string | null;
}
