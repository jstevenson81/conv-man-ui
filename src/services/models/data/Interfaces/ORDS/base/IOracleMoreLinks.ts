import { ILink } from "./IOracleLink";


export interface IOracleMoreLinks {
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
  links: ILink[] | null;
}
