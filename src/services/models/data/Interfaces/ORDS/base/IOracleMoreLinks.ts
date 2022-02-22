import { IOracleLink } from "./IOracleLink";


export interface IOracleMoreLinks {
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
  links: IOracleLink[] | null;
}
