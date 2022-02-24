import { ColumnInterface } from "react-table";


export interface IConvManCol<D extends object = {}> extends ColumnInterface<D> {
  accessor: string;
  headerText: string;
}
