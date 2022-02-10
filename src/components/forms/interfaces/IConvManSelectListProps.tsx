import { IConvManSelectListItem } from "./ISelectListItem";

export type IConvManSelectListProps = {
  items: Array<IConvManSelectListItem>;
  label: string;
  onListboxChange(newValue: any): void;
};
