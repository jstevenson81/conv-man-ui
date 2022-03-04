import { IEntity } from "../base/IEntity";

export interface ISummaryRow extends IEntity {
  totalrows: number;
  hdl_line_name: string;
}
