import { useState, ChangeEvent } from "react";
import { IConvManInputProps } from "./interfaces/IConvManInputProps";

const ConvManInput: React.FC<IConvManInputProps> = (props: IConvManInputProps) => {
  return (
    <div>
      <label className="mb-1 ml-1/2 uppercase text-sm text-slate-600 font-bold">{props.label}</label>
      <input
        defaultValue={props.value}
        placeholder=" "
        type={props.type}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.onInputChange(e.currentTarget.value, e.currentTarget.name);
        }}
        className="w-full border-slate-300 border-2 rounded-md p-2"
      />
    </div>
  );
};

export default ConvManInput;
