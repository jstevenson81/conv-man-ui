import { FC, useState } from "react";
import { ConvManFile, ConvManLabel, SelectList } from ".";
import ConvManInput from "./ConvManInput";
import { IConversion, IValidationError } from "./interfaces/IConversion";
import { ISelectListItem } from "./interfaces/ISelectListItem";

import {
  samplePods,
  sampleTemplates,
  sampleConversionTypes,
  sampleErrors,
  sampleConversions,
} from "../sampleData/samples";
import _ from "lodash";
import Loader from "./Loader";

interface DashboardState {
  pods: Array<ISelectListItem>;
  conversionTypes: Array<ISelectListItem>;
  selectedPod: any;
  selectedConversion: any;
  selectedFile: { fileName: string; fileExt: string };
  conversions: Array<IConversion>;
  emailAddress: string;
}
interface DashboardProps {}

interface IPodDomain {
  id: number;
  emailDomain?: string | null;
  pod?: IPod[];
}

interface IPod {
  id: number;
  url: string;
  commonName?: string | null;
  podDomainId: number;
  podDomain?: IPodDomain;
}

const Dashboard: FC<DashboardProps> = (props: DashboardProps) => {
  //#region state

  const [errors, setErrors] = useState(sampleErrors);
  const [conversions, setConversions] = useState(sampleConversions);

  const [emailAddress, setEmailAddress] = useState("");

  const [convTypes, setConvTypes] = useState(sampleConversionTypes);
  const [selectedConvType, setSelectedConvType] = useState("");

  const [pods, setPods] = useState<Array<ISelectListItem>>(samplePods);
  const [selectedPod, setSelectedPod] = useState("");

  const [templates, setTemplates] = useState<Array<ISelectListItem>>(sampleTemplates);
  const [selectedTmpl, setSelectedTmpl] = useState("");
  const [selectedTmplFile, setSelectedTmplFile] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  //#endregion

  //#region gql
  //#endregion

  /*
  Step 1: Select a pod
  Step 2: Select a conversion type - this should show the links to the files
  Step 3: Show templates
  Step 4: Download template
  Step 5: Upload a file
  Step 6: show errors
  */

  //#region Change methods
  const podChange = (val: string): void => {
    setSelectedPod(val);
  };

  const fileChange = (fileName: string, fileExt: string): void => {
    console.log({ fileName, fileExt });
  };

  const convTypeChange = (val: string): void => {
    setSelectedConvType(val);
  };

  const emailChange = (value: string, name: string): void => {
    setEmailAddress(value);
  };

  const templateChange = (val: string): void => {
    setSelectedTmpl(val);
    console.log(val.toUpperCase());
    switch (val.toUpperCase()) {
      case "EMP.CSV":
        // show the employee template
        setSelectedTmpl("emp.csv");
        fetch("templates/emp.csv", {
          method: "GET",
          headers: {
            "Content-Type": "text/csv",
          },
        })
          .then((response) => response.blob())
          .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "simplifiedEmployee.csv");

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode?.removeChild(link);
          });
        break;
      case "JOBS.CSV":
        // show the jobs template
        setSelectedTmpl("jobs.csv");
        fetch("templates/jobs.csv", {
          method: "GET",
          headers: {
            "Content-Type": "text/csv",
          },
        })
          .then((response) => response.blob())
          .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "jobsTemplate.csv");

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode?.removeChild(link);
          });
        break;
      case "LOCATIONS.CSV":
        // show the locations template
        setSelectedTmpl("locations.csv");
        fetch("templates/locations.csv", {
          method: "GET",
          headers: {
            "Content-Type": "text/csv",
          },
        })
          .then((response) => response.blob())
          .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "locationsTemplate.csv");

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode?.removeChild(link);
          });
        break;
      default:
        break;
    }
  };

  const startConversion = (): void => {
    setLoading(true);
    setShowErrors(false);
    setLoadMessage("starting your conversion");
    setTimeout(() => {
      setLoadMessage("uploading your file");
      setTimeout(() => {
        setLoadMessage("validating your file");
        setTimeout(() => {
          setLoadMessage("Complete.  Check below for any errors");
          setTimeout(() => {
            setLoading(false);
            setShowErrors(true);
          }, 4000);
        }, 4000);
      }, 4000);
    }, 2000);
  };

  //#endregion

  //#region render
  return (
    <>
      <Loader show={loading} message={loadMessage}></Loader>
      <div className="flex items-center justify-between place-content-end mb-8 ">
        <div className="text-xl text-sky-800">Conversion Manager - Dashboard</div>
        <button
          onClick={startConversion}
          className="px-3 py-3 group rounded-lg bg-sky-700 text-sky-200  hover:bg-sky-900 hover:text-white transition duration-300"
        >
          Start Conversion
        </button>
      </div>
      <div className="grid gap-4">
        <SelectList items={pods} label="Select a Pod" onListboxChange={podChange}></SelectList>
        <SelectList items={convTypes} label="conversion" onListboxChange={convTypeChange}></SelectList>
        <SelectList items={templates} label="templates" onListboxChange={templateChange}></SelectList>
        <ConvManFile label="File to Convert" onFileChange={fileChange} />
      </div>
      <div className={selectedConvType !== "" || selectedPod !== "" || emailAddress !== "" ? "block" : "hidden"}>
        <div className="mt-8 pt-2 border-y-2 border-slate-700">
          <div className="text-xl text-sky-800 mb-2 md:mb-0">Conversion Summary</div>
          <div className="flex-none items-center md:flex">
            <ConvManLabel label="Requested POD"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0">{selectedPod}</div>
          </div>
          <div className="flex-none items-center mt-2 md:mt-0 md:flex">
            <ConvManLabel label="Requested Conversion"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0">{selectedConvType}</div>
          </div>
          <div className="flex-none items-center mt-2 md:mt-0 md:flex">
            <ConvManLabel label="Selected Template"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0">{selectedTmpl}</div>
          </div>
          <div className="flex-none items-center mt-2 md:mt-0 md:flex">
            <ConvManLabel label="File"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0"></div>
          </div>
          <div className="flex-none items-center mt-2 md:mt-0 md:flex">
            <ConvManLabel label="File Extension"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0"></div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xl text-sky-800 mb-2 md:mb-0">Recent Conversions</div>
        <div className="mt-4 -mb-3">
          <div className="not-prose relative rounded-xl overflow-hidden bg-slate-600">
            <div className="relative rounded-xl overflow-auto">
              <div className="shadow-sm overflow-hidden my-8">
                <table className="border-collapse table-auto w-full text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left">Pod</th>
                      <th className="border-b border-slate-800 font-medium p-4   text-gray-200 text-left">
                        Conversion Type
                      </th>
                      <th className="border-b border-slate-800 font-medium p-4   text-gray-200 text-left">File</th>
                      <th className="border-b border-slate-800 font-medium p-4   text-gray-200 text-left">Date/Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-700">
                    {conversions.map((conv: IConversion, idx: number) => {
                      return (
                        <tr key={idx}>
                          <td className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left">
                            {conv.pod.name} <br />
                            <span className="text-xs text-slate-300 whitespace-nowrap">{conv.pod.url}</span>
                          </td>
                          <td className="border-b border-slate-800 p-4 text-gray-200 ">{conv.convType}</td>
                          <td className="border-b border-slate-800 p-4 text-gray-200 ">{conv.fileName}</td>
                          <td className="border-b border-slate-800 p-4 text-gray-200 ">{conv.dateTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-4 ${showErrors ? "visible" : "hidden"}`}>
        <div className="text-xl text-sky-800 mb-2 md:mb-0">Recent Errors</div>
        <div className="mt-4 -mb-3">
          <div className="not-prose relative rounded-xl overflow-hidden bg-slate-600">
            <div className="relative rounded-xl overflow-auto">
              <div className="shadow-sm overflow-hidden my-8">
                <table className="border-collapse table-auto w-full text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left">File Name</th>
                      <th className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left">Error</th>
                      <th className="border-b border-slate-800 font-medium p-4   text-gray-200 text-left">Row</th>
                      <th className="border-b border-slate-800 font-medium p-4   text-gray-200 text-left">Column</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-700">
                    {errors.map((err: IValidationError, idx: number) => {
                      return (
                        <tr key={idx}>
                          <td className="border-b border-slate-800 p-4 text-gray-200 ">{err.fileName}</td>
                          <td className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left">
                            {err.errorType} <br />
                            <span className="text-xs text-slate-300 whitespace-nowrap">{err.message}</span>
                          </td>
                          <td className="border-b border-slate-800 p-4 text-gray-200 ">{err.row}</td>
                          <td className="border-b border-slate-800 p-4 text-gray-200 ">{err.column}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  //#endregion
};

export default Dashboard;
