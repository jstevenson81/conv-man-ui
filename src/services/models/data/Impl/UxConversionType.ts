import { ILink } from "../Interfaces/OracleApi/IOracleLink";
import { IUxConversionType } from "../Interfaces/ORDS/IUxConversionType";

export class UxConversionType implements IUxConversionType {
  ux_conversion_type_id: number;
  conversion_type_name: string;
  template_csv_name: string;
  links?: ILink[];

  constructor() {
    this.conversion_type_name = "";
    this.ux_conversion_type_id = 0;
    this.template_csv_name = "";
    this.links = new Array<ILink>();
  }
}
