import { IOracleAutoRestResponse } from "./IOracleAutoRestResponse";

export interface IBulkLoadResponse extends IOracleAutoRestResponse {
  data: string;
  status: number;
  statusText: string;
}
