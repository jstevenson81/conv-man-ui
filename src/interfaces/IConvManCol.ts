import { ColumnInterface } from "react-table";
import { ToastOptions } from "react-toastify";

export interface IConvManCol<D extends object = {}> extends ColumnInterface<D> {
  accessor: string;
  headerText: string;
  hdlColumnText: string;
}



const defaultToastrOpts: ToastOptions = {

};

export default defaultToastrOpts;
