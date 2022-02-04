import { DateTime } from "luxon";
import { ChangeEvent, Component, HtmlHTMLAttributes, ReactNode } from "react";
import { ConvManLabel } from ".";

interface IConvManFileInputProps {
  label: string;
  onFileChange(file: IConvManFileInputState): void;
}

export interface IConvManFileInputState {
  fileName: string;
  fileExt: string;
  fileText: string;
  lastModified: string;
}

export default class ConvManFileInput extends Component<IConvManFileInputProps, IConvManFileInputState> {
  constructor(props: IConvManFileInputProps) {
    super(props);
    this.state = {
      fileName: "",
      fileExt: "",
      fileText: "",
      lastModified: "",
    };
  }

  handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const lastMod = DateTime.fromMillis(file.lastModified).toJSON();
      this.setState({ fileName: file.name, fileExt: file.type, fileText: await file.text(), lastModified: lastMod });
    }
    this.props.onFileChange({ ...this.state });
  };

  render(): ReactNode {
    return (
      <div className="flex-none md:flex">
        <ConvManLabel label={this.props.label}></ConvManLabel>
        <div className="flex-1 ">
          <input type="file" className="py-3" onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}
