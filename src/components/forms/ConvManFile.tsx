import { DateTime } from "luxon";
import { useState, ChangeEvent } from "react";
import ConvManLabel from "./ConvManLabel";
import { IConvManFileInputProps } from "./interfaces/IConvManFileInputProps";

const ConvManFileInput: React.FC<IConvManFileInputProps> = (props: IConvManFileInputProps) => {
  const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const lastMod = DateTime.fromMillis(file.lastModified).toJSON();
      const fileText = await file.text();
      localStorage.setItem(file.name, fileText);

      const newFile = { fileName: file.name, fileExt: file.type, lastModified: lastMod };
      props.onFileChange(newFile);
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
