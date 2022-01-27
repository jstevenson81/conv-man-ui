import { ChangeEvent, Component, HtmlHTMLAttributes, ReactNode } from "react";

interface IConvManFileInputProps {
  label: string;
  onFileChange(fileName: string, fileExt: string): void;
}

export default class ConvManFileInput extends Component<IConvManFileInputProps, any> {
  constructor(props: IConvManFileInputProps) {
    super(props);
    this.state = { fileName: "", fileExt: "" };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let fileName = e.target.files?.item(0)?.name;
    let fileExt = e.target.files?.item(0)?.type;

    this.props.onFileChange(fileName!, fileExt!);
  };

  render(): ReactNode {
    return (
      <div className="flex-none md:flex">
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
        <div className="flex-1 ">
          <input type="file" className="py-3" onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}
