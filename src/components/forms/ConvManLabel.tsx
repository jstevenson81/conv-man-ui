import React, { Component, ReactNode } from "react";
import { IConvManLabelProps } from "./interfaces/IConvManLabelProps";

const ConvManLabel: React.FC<IConvManLabelProps> = (props: IConvManLabelProps) => {
  return (
    <div
      className="ml-2
          w-1/3
          uppercase
          text-sm
          text-slate-600
          font-bold
          pb-2
          md:ml-0
          md:p-4
          md:text-right
          md:whitespace-nowrap"
    >
      {props.label}
    </div>
  );
};

export default ConvManLabel;