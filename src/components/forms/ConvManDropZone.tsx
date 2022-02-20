import { DocumentReportIcon } from "@heroicons/react/solid";
import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IConvManFileInputProps } from "./interfaces/IConvManFileInputProps";

interface IConvManFileDropZoneProps extends IConvManFileInputProps {
  fileFilter: string;
}

const ConvManFileDropZone: React.FC<IConvManFileDropZoneProps> = ({ onFileChange, fileFilter, label }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: fileFilter,
    maxFiles: 1,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      <div className="flex items-center">
        <DocumentReportIcon className="text-green-600 w-6 h-6"></DocumentReportIcon>
        <div className="text-mono text-sm text-slate-600">
          {file.name} - {file.size} bytes
        </div>
      </div>
    </li>
  ));

  useEffect(() => {
    const file = acceptedFiles[0];
    if (file) {
      file.arrayBuffer().then((buffer) => {
        onFileChange({
          fileExt: file.type,
          fileName: file.name,
          lastModified: DateTime.fromMillis(file.lastModified).toJSON(),
          data: buffer,
        });
      });
      console.log("use effect for file change was called");
    }
  }, [acceptedFiles, onFileChange]);

  return (
    <>
      <div
        {...getRootProps({
          className:
            "p-4 border-dashed border-2 rounded-md text-slate-500 border-slate-300 hover:border-slate-400 hover:bg-slate-200 hover:text-slate-600 transition duration-300",
        })}
      >
        <input {...getInputProps()} />
        <p>{label}</p>
        <aside className="mt-4 text-left flex items-center gap-2">
          <h4>selected file:</h4>
          <ul>{files}</ul>
        </aside>
      </div>
    </>
  );
};

export default ConvManFileDropZone;
