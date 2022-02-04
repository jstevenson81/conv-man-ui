import React, { ChangeEvent, FC, useState } from "react";
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
import { IConvManFileInputState } from "./ConvManFile";
import reportWebVitals from "../reportWebVitals";
import ConvManErrorTable from "./ConvManErrorTable";

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
  const [errorsResolved, setErrorsResolved] = useState(0);
  const [errorsRemaining, setErrorsRemaining] = useState(0);

  const [emailAddress, setEmailAddress] = useState("");

  const [convTypes, setConvTypes] = useState(sampleConversionTypes);
  const [selectedConvType, setSelectedConvType] = useState("");

  const [pods, setPods] = useState<Array<ISelectListItem>>(samplePods);
  const [selectedPod, setSelectedPod] = useState("");

  const [templates, setTemplates] = useState<Array<ISelectListItem>>(sampleTemplates);
  const [selectedTmpl, setSelectedTmpl] = useState("");
  const [selectedTmplFile, setSelectedTmplFile] = useState("");

  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileExt, setSelectedFileExt] = useState("");
  const [selectedFileText, setSelectedFileText] = useState("");
  const [selectedFileLastMod, setSelectedFileLastMod] = useState("");

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

  const fileChange = (data: IConvManFileInputState): void => {
    setSelectedFile(data.fileName);
    setSelectedFileExt(data.fileName.split(".")[1]);
    setSelectedFileText(data.fileText);
    setSelectedFileLastMod(data.lastModified);
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
            setSelectedPod("");
            setSelectedConvType("");
            setSelectedFile("");
            setSelectedFileExt("");
            setSelectedFileLastMod("");
            setSelectedFileText("");
            setSelectedTmpl("");
            setSelectedTmplFile("");
          }, 4000);
        }, 4000);
      }, 4000);
    }, 2000);
  };

  const resolveErrors = (): void => {
    setLoading(true);
    setShowErrors(false);
    setLoadMessage("resolving your errors");
    setTimeout(() => {
      setLoadMessage("uploading your resolved errors");
      setTimeout(() => {
        setLoadMessage("validating your fixes");
        setTimeout(() => {
          setLoadMessage("Complete.  Check below for any issues with your resolution");
          setTimeout(() => {
            const errCopy = [...errors];
            const remain = _.filter(errCopy, (err: IValidationError) => {
              return !err.resolved;
            });
            const resolved = _.filter(errCopy, (err: IValidationError) => {
              return err.resolved;
            });
            setErrorsRemaining(remain.length);
            setErrorsResolved(resolved.length);
            const sorted = _.sortBy(errCopy, (err) => {
              return err.resolved;
            });

            setErrors(sorted);
            setLoading(false);
            setShowErrors(true);
          }, 4000);
        }, 4000);
      }, 4000);
    }, 2000);
  };

  const handleCheck = (idx: number) => {
    const errCopy = [...errors];
    errCopy[idx].resolved = !errCopy[idx].resolved;
    setErrors(errCopy);
  };
  const handleErrorChange = (e: ChangeEvent<HTMLTextAreaElement>, idx: number) => {
    const errCopy = [...errors];
    errCopy[idx].rowData = e.currentTarget.value;
    errCopy[idx].columnData = "";
    errCopy[idx].resolved = true;
    setErrors(errCopy);
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
      <div className="not-prose relative rounded-xl overflow-hidden bg-slate-600">
        <div className="relative rounded-xl overflow-auto">
          <div className="shadow-sm overflow-hidden">
            <ConvManErrorTable data={[]}></ConvManErrorTable>
          </div>
        </div>
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
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0">{selectedFile}</div>
          </div>
          <div className="flex-none items-center mt-2 md:mt-0 md:flex">
            <ConvManLabel label="File Extension"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0">{selectedFileExt}</div>
          </div>
          <div className="flex-none items-center mt-2 md:mt-0 md:flex">
            <ConvManLabel label="File Last Modified Date"></ConvManLabel>
            <div className="text-lg text-sky-800 font-mono flex-1 p-2 pt-0">{selectedFileLastMod}</div>
          </div>
        </div>
      </div>
      <div className={`mt-4 ${showErrors ? "hidden" : "visible"}`}>
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
        <div className="flex justify-start mt-12 items-center">
          <div className="text-xl text-sky-800 mb-2 md:mb-0 md:mr-4">Recent Errors</div>
          <div>
            <button
              onClick={resolveErrors}
              className="px-3 py-3 group rounded-lg bg-sky-700 text-sky-200  hover:bg-sky-900 hover:text-white transition duration-300"
            >
              Fix Errors
            </button>
          </div>
          <div className="ml-4">Recently Resolved Errors: {errorsResolved.toString()}</div>
          <div className="ml-4">Remaining Errors: {errorsRemaining.toString()}</div>
        </div>

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
                        <React.Fragment key={idx}>
                          <tr>
                            <td className="border-b border-slate-800 p-4 text-gray-200 ">{err.fileName}</td>
                            <td className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left">
                              {err.errorType} <br />
                              <span className="text-xs text-slate-300 whitespace-nowrap">{err.message}</span>
                            </td>
                            <td className="border-b border-slate-800 p-4 text-gray-200 ">{err.row}</td>
                            <td className="border-b border-slate-800 p-4 text-gray-200 ">{err.column}</td>
                          </tr>
                          <tr>
                            <td colSpan={4}>
                              <div className="p-4 pb-0 font-mono font-bold text-gray-200">Columns</div>
                              <div className="font-mono text-sm p-4 text-gray-200">{err.columnData}</div>
                              <div className="flex justify-between">
                                <div className="flex-1 p-4">
                                  <textarea
                                    value={`${err.rowData}`}
                                    rows={10}
                                    className="w-full"
                                    onChange={(e) => handleErrorChange(e, idx)}
                                  ></textarea>
                                </div>
                                <div className="p-4">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={err.resolved}
                                      readOnly={true}
                                      disabled={true}
                                      className="mr-2 text-blue-500 w-8 h-8 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded-lg"
                                    ></input>
                                    <span className="text-gray-200">Resolved?</span>
                                  </label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
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
