import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { IConvManSelectListProps } from "./interfaces/IConvManSelectListProps";
import _ from "lodash";

const ConvManSelectList: React.FC<IConvManSelectListProps> = (props: IConvManSelectListProps) => {
  const [selected, setSelected] = useState(props.items[0]);

  return (
    <Listbox
      value={selected}
      onChange={(val) => {
        setSelected(val);
        props.onListboxChange(val);
      }}
    >
      <Listbox.Button className="relative w-full py-2 text-gray-600 pr-10 text-left bg-white cursor-default border-b-2 border-b-gray-300">
        <span className="block truncate">{selected.option}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
        </span>
      </Listbox.Button>
      <Transition as={Fragment} leave="transition ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <Listbox.Options className=" w-full py-1 px-1 mt-1 text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {props.items.map((item) => (
            <Listbox.Option key={item.value} value={item} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={`${
                    active ? "bg-sky-600 text-white" : selected ? "bg-sky-200 text-gray-600" : "bg-white text-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-start justify-items-center py-2 pl-3">
                    {selected && <CheckIcon className="w-5 h-5 mr-2" />}
                    {item.option}
                  </div>
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};

export default ConvManSelectList;
