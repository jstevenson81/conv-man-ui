import React, { useState } from "react";

import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { IConvManSelectListProps } from "./interfaces/IConvManSelectListProps";
import { IConvManSelectListItem } from "./interfaces/ISelectListItem";
import { iteratorSymbol } from "immer/dist/internal";

const ConvManSelectList: React.FC<IConvManSelectListProps> = (props: IConvManSelectListProps) => {
  const [selectedItem, setSelectedItem] = useState("");

  return (
    <>
      <label htmlFor={props.label} className="bg-white text-gray-600 text-sm ml-1">
        {props.label}
      </label>
      <div className="border border-gray-300 rounded-xl py-2 px-2 mt-1">
        <select
          className="block w-full py-2 text-gray-500 text-sm focus:outline-none"
          onChange={(e) => {
            props.onListboxChange(e.currentTarget.value);
          }}
        >
          {props.items.map((item: IConvManSelectListItem, idx: number) => {
            return (
              <option value={item.value} key={idx}>
                {item.option}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default ConvManSelectList;
