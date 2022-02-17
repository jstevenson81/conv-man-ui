import { ICnvValError } from "../../../../services/models/data/Interfaces/ORDS/ICnvValError";
import { IConvManCol } from "../../../../services/models/data/Interfaces/Local/IConvManCol";

export type IConvManErrorTableProps = {
  columns: Array<IConvManCol<ICnvValError>>;
  data: Array<ICnvValError>;
};


