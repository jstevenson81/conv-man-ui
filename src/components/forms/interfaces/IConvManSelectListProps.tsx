import { IConvManSelectListItem } from "./ISelectListItem";

export type IConvManSelectListProps = {
  items: Array<IConvManSelectListItem>;
  onListboxChange(newValue: any): void;
  label: string;
};
