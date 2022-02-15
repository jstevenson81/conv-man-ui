import { useState, ChangeEvent } from "react";
import { IConvManInputProps } from "./interfaces/IConvManInputProps";

const ConvManInput: React.FC<IConvManInputProps> = (props: IConvManInputProps) => {
  return (
    <div className="relative border-b-2 border-gray-300 focus-within:border-sky-600">
      <input
        defaultValue={props.value}
        placeholder=" "
        type={props.type}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.onInputChange(e.currentTarget.value, e.currentTarget.name);
        }}
        className="block w-full appearance-none focus:outline-none bg-transparent"
      />
      <label htmlFor={props.name} className="absolute top-0 -z-1 text-gray-600 origin-0 text-sm">
        {props.label}
      </label>
    </div>
  );
};

export default ConvManInput;
