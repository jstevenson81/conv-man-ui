import { Component, ReactNode } from "react";

interface IConvManLabelProps {
  label: string;
}

export default class ConvManLabel extends Component<IConvManLabelProps, any> {
  render(): ReactNode {
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
        {this.props.label}
      </div>
    );
  }
}
