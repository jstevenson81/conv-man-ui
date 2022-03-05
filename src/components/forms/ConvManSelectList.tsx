import Select, { SingleValue } from "react-select";

import { IConvManSelectListProps } from "./interfaces/IConvManSelectListProps";
import { IConvManSelectListItem } from "./interfaces/ISelectListItem";

const ConvManSelectList: React.FC<IConvManSelectListProps> = (props: IConvManSelectListProps) => {
  return (
    <div className="w-full">
      <label className="mb-1 ml-1/2 uppercase text-sm text-slate-600 font-bold">{props.label}</label>
      <Select
        placeholder={`select a ${props.label}`}
        options={props.items}
        className="uppercase border-slate-300"
        escapeClearsValue={true}
        menuPosition="absolute"
        isSearchable={true}
        value={props.selectedItem}
        onChange={(newValue: SingleValue<IConvManSelectListItem>) => {
          props.onListboxChange(newValue);
        }}
      ></Select>
    </div>
  );
};

export default ConvManSelectList;
