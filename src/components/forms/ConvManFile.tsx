import { DateTime } from "luxon";
import { useState, ChangeEvent } from "react";
import ConvManLabel from "./ConvManLabel";
import { IConvManFileInputProps } from "./interfaces/IConvManFileInputProps";

const ConvManFileInput: React.FC<IConvManFileInputProps> = (props: IConvManFileInputProps) => {
  const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const lastMod = DateTime.fromMillis(file.lastModified).toJSON();
      file.arrayBuffer().then((buffer) => {
        props.onFileChange({ fileExt: file.type, fileName: file.name, lastModified: lastMod, data: buffer });
      });
    }
  };

  return (
    <div className="flex-none md:flex md:flex-col md:gap-4">
      <ConvManLabel label={props.label}></ConvManLabel>
      <div className="flex-1">
        <input type="file" onChange={handleChange} />
      </div>
    </div>
  );
};

export default ConvManFileInput;
