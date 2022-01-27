import { ChangeEvent, Component, ReactNode } from "react";
import { ConvManLabel } from ".";
import { IConvManInputProps } from "./interfaces/IConvManInputProps";
import { IConvManInputState } from "./interfaces/IConvManInputState";

export default class ConvManInput extends Component<IConvManInputProps, IConvManInputState> {
  constructor(props: IConvManInputProps) {
    super(props);
    this.state = {
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.props.onInputChange(e.target.value, e.target.name);
  };

  render(): ReactNode {
    return (
      <div className="flex-none md:flex">
        <ConvManLabel label={this.props.label}></ConvManLabel>
        <div className="flex-1 ">
          <input
            type={this.props.type}
            className="py-3 rounded-lg w-full"
            onChange={this.handleChange}
            name={this.props.name}
          />
        </div>
      </div>
    );
  }
}
