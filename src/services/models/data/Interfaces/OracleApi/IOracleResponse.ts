import { IOracleItem } from "./IOracleItem";
import { ILink } from "./IOracleLink";

export interface IOracleResponse<TItemModel extends IOracleItem> {
  items: TItemModel[];
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
  links: ILink[];
}
