import { DateTime } from "luxon";
import { useState, ChangeEvent } from "react";
import ConvManLabel from "./ConvManLabel";
import { IConvManFileInputProps } from "./interfaces/IConvManFileInputProps";

const ConvManFileInput: React.FC<IConvManFileInputProps> = (props: IConvManFileInputProps) => {
  const [fileName, setFileName] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [fileText, setFileText] = useState("");
  const [lastModified, setLastModified] = useState("");

  const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.currentTarget.files?.item(0);
    if (file) {
      const lastMod = DateTime.fromMillis(file.lastModified).toJSON();
      setLastModified(lastMod);
      setFileExt(file.type);
      setFileName(file.name);
      setFileText(await file.text());
    }
    props.onFileChange({ fileExt, fileName, fileText, lastModified });
  };

  return (
    <div className="flex-none md:flex">
      <ConvManLabel label={props.label}></ConvManLabel>
      <div className="flex-1 ">
        <input type="file" className="py-3" onChange={handleChange} />
      </div>
    </div>
  );
};

export default ConvManFileInput;
