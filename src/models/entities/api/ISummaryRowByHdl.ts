import { IEntity } from "../base/IEntity";
import { IHasErrors } from "./IHasErrors";

export interface ISummaryRowByHdl extends IHasErrors, IEntity {
  hdl_line_name: string;
  totalrows: number;
}


