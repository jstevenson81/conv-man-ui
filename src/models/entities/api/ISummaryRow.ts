import { IEntity } from "../base/IEntity";


export interface ISummaryRow extends IEntity {
  totalrows: number;
  obj_key: string;
}
