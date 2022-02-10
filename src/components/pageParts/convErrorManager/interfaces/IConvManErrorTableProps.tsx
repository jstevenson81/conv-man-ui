import { ICnvValError } from "../../../../models/data/Interfaces/ORDS/ICnvValError";
import { IConvManCol } from "../../../../models/data/Interfaces/Local/IConvManCol";

export type IConvManErrorTableProps = {
  columns: Array<IConvManCol<ICnvValError>>;
  data: Array<ICnvValError>;
};


