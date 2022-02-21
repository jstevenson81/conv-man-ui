import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import ConvManInput from "../../forms/ConvManInput";
import ConvManSelectList from "../../forms/ConvManSelectList";
import { XIcon } from "@heroicons/react/solid";
import { IConvManFile } from "../../forms/interfaces/IConvManFileInputState";
import { DateTime } from "luxon";
import { IConvManSelectListItem } from "../../forms/interfaces/ISelectListItem";
import { PodService } from "../../../services/ords/customMethods/PodService";
import { IUxPod } from "../../../services/models/data/interfaces/ords/IUxPod";
import { IApiResponse } from "../../../services/models/data/interfaces/Local/IApiResponse";
import { WorksheetService } from "../../../services/ords/customMethods/WorksheetService";
import IWorksheet from "../../../services/models/data/interfaces/ords/IWorksheet";
import ConvManFileDropZone from "../../forms/ConvManDropZone";
import ExcelService from "../../../services/ExcelService";

type ICreateBatchProps = {
  isOpen: boolean;
  toggle(open: boolean): void;
  onLoading(loading: boolean): void;
};

const ConvManCreateBatchForm: React.FC<ICreateBatchProps> = (props: ICreateBatchProps) => {
  //#region state
  const [batchName, setBatchName] = useState("");
  const [selectedPod, setSelectedPod] = useState<IConvManSelectListItem>();
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<IConvManFile>();
  const [selectedWorksheet, setSelectedWorsheet] = useState<IConvManSelectListItem>();

  const [worksheetOpts, setWorksheetOpts] = useState<Array<IConvManSelectListItem>>([]);
  const [podOpts, setPodOpts] = useState<Array<IConvManSelectListItem>>([]);

  //#endregion

  //#region services

  const excelSvc = new ExcelService();

  //#endregion

  //#region data gathering

  useEffect(() => {
    const worksheetSvc = new WorksheetService();
    const podSvc = new PodService();

    worksheetSvc.getAll().then((resp: IApiResponse<IWorksheet>) => {
      if (resp && resp.oracleResponse) {
        const options = worksheetSvc.convertToSelectList({
          data: resp.oracleResponse.items,
          props: {
            value: "spreadsheet_name",
            option: "spreadsheet_name",
          },
        });
        setWorksheetOpts(options);
      }
    });

    podSvc.getAllPods().then((resp: IApiResponse<IUxPod>) => {
      let options: Array<IConvManSelectListItem> = [];
      if (resp && resp.oracleResponse) {
        options = podSvc.convertToSelectList({
          data: resp.oracleResponse.items,
          props: { value: "ux_pod_id", option: "pod_name" },
        });
      }
      setPodOpts(options);
    });

    setBatchName(DateTime.now().valueOf().toString());
  }, []);

  //#endregion

  //#region batch creation

  const createBatch = async (): Promise<any> => {
    props.onLoading(true);
    const csv = excelSvc.sheetToCsv({
      workbook: selectedSpreadsheet!,
      sheetToRead: selectedWorksheet!.value,
      batchName: batchName,
    });
    console.log(csv);
    console.log(selectedPod);
    props.onLoading(false);
  };

  const spreadsheetChange = useCallback((newFile: IConvManFile): void => {
    setSelectedSpreadsheet(newFile);
  }, []);

  //#endregion

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10" onClose={() => props.toggle(false)}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-xl p-6 my-8 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="div" className="flex items-center justify-between justify-items-center">
                <h3 className="text-lg font-medium leading-6">new conversion request</h3>
                <div className="hover:text-gray-800 hover:scale-125 transition duration-300">
                  <XIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => props.toggle(false)}></XIcon>
                </div>
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Use the form below to create a new conversion request</p>
              </div>
              <div className="my-8 flex flex-col gap-4">
                <ConvManInput
                  type="text"
                  label="Batch Name"
                  placeHolder=" "
                  name="BatchName"
                  value={batchName}
                  onInputChange={(newValue: string) => {
                    setBatchName(newValue);
                  }}
                ></ConvManInput>
                <ConvManSelectList
                  label="Environment"
                  items={podOpts}
                  onListboxChange={(newValue: IConvManSelectListItem) => {
                    setSelectedPod(newValue);
                  }}
                ></ConvManSelectList>

                <ConvManSelectList
                  label="Worksheet"
                  items={worksheetOpts}
                  onListboxChange={(newWorksheet: IConvManSelectListItem) => {
                    console.log(newWorksheet);
                    setSelectedWorsheet(newWorksheet);
                  }}
                ></ConvManSelectList>

                <ConvManFileDropZone
                  label="Drop xlsx files here or click to browse"
                  fileFilter="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onFileChange={spreadsheetChange}
                ></ConvManFileDropZone>
              </div>

              <div className="mt-4 flex justify-end items-center gap-4 justify-items-center">
                <button type="button" className="button red" onClick={() => props.toggle(false)}>
                  Close
                </button>
                <button type="button" className="button blue" onClick={() => createBatch()}>
                  Create Request
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConvManCreateBatchForm;
