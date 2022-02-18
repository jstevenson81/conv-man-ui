import { useState } from "react";
import { IConvManSelectListProps } from "./interfaces/IConvManSelectListProps";
import Select, { SingleValue } from "react-select";
import { IConvManSelectListItem } from "./interfaces/ISelectListItem";

const ConvManSelectList: React.FC<IConvManSelectListProps> = (props: IConvManSelectListProps) => {
  const [selected, setSelected] = useState(props.items[0]);
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
        onChange={(newValue: SingleValue<IConvManSelectListItem>) => {
          props.onListboxChange(newValue);
        }}
      ></Select>
    </div>
  );
};

export default ConvManSelectList;
