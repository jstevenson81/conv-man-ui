import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import ConvManInput from "../../forms/ConvManInput";
import ConvManSelectList from "../../forms/ConvManSelectList";
import { XIcon } from "@heroicons/react/solid";
import ConvManFileInput from "../../forms/ConvManFile";
import { IConvManFileInputState } from "../../forms/interfaces/IConvManFileInputState";
import { ConversionTypeService } from "../../../services/data/ConversionTypeService";
import { ServerConfig } from "../../../ServerConfig";
import { IUxConversionType } from "../../../models/data/Interfaces/ORDS/IUxConversionType";
import { ApiResponse } from "../../../models/data/Impl/ApiResponse";
import { DateTime } from "luxon";
import { IConvManSelectListItem } from "../../forms/interfaces/ISelectListItem";
import { PodService } from "../../../services/data/PodService";
import { IUxPod } from "../../../models/data/Interfaces/ORDS/IUxPod";
import { IApiResponse } from "../../../models/data/Interfaces/Local/IApiResponse";
import { SpreadsheetService } from "../../../services/data/SpreadsheetRowService";
import { usePapaParse } from "react-papaparse";

type ICreateBatchProps = {
  isOpen: boolean;
  toggle(open: boolean): void;
  onLoading(loading: boolean): void;
};

const ConvManCreateBatchForm: React.FC<ICreateBatchProps> = (props: ICreateBatchProps) => {
  //#region state
  const [batchName, setBatchName] = useState("");
  const [convType, setConvType] = useState<IConvManSelectListItem>();
  const [pod, setPod] = useState<IConvManSelectListItem>();
  const [uploadFile, setUploadFile] = useState<IConvManFileInputState>();

  const [convTypes, setConvTypes] = useState<Array<IConvManSelectListItem>>([]);
  const [pods, setPods] = useState<Array<IConvManSelectListItem>>([]);

  //#endregion

  //#region services

  const convTypeSvc = new ConversionTypeService({
    ordsUri: ServerConfig.ords.url,
    entity: ServerConfig.ords.entities.conversionTypes,
  });

  const podSvc = new PodService({
    ordsUri: ServerConfig.ords.url,
    entity: ServerConfig.ords.entities.pod,
  });

  const spSvc = new SpreadsheetService({
    ordsUri: ServerConfig.ords.url,
    entity: ServerConfig.ords.entities.spreadsheetRows,
  });

  //#endregion

  //#region data gathering

  useEffect(() => {
    convTypeSvc.getAllConvTypes().then((resp: ApiResponse<IUxConversionType>) => {
      const iConvTypes: Array<IConvManSelectListItem> = [];
      resp.oracleResponse?.items.forEach((i) => {
        iConvTypes.push({ label: i.conversion_type_name, value: i.template_csv_name });
      });
      setConvTypes(iConvTypes);
    });

    podSvc.getAllPods().then((resp: IApiResponse<IUxPod>) => {
      const iPods: Array<IConvManSelectListItem> = [];
      resp.oracleResponse?.items.forEach((pod) => {
        iPods.push({ label: pod.pod_name, value: pod.ux_pod_id, disabled: false });
      });
      setPods(iPods);
    });

    setBatchName(DateTime.now().valueOf().toString());
  }, []);

  //#endregion

  //#region batch creation

  const { readString } = usePapaParse();

  const createBatch = async (): Promise<any> => {
    props.onLoading(true);
    const fileContents = localStorage.getItem(uploadFile!.fileName);

    readString(fileContents!, {
      worker: true,
      header: true,
      complete: async (results: Papa.ParseResult<any>) => {
        const saveResp = await spSvc.saveFile({
          parsedCsv: results,
          fileName: uploadFile!.fileName,
          podId: pod!.value,
          batchName: batchName!,
          createdBy: "ConversionMangerService",
        });
        props.onLoading(false);
        console.log(saveResp);
      },
    });
  };

  //#endregion

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10" onClose={(e) => props.toggle(false)}>
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
                <h3 className="text-lg font-medium leading-6">create a batch</h3>
                <div className="hover:text-gray-800 hover:scale-125 transition duration-300">
                  <XIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => props.toggle(false)}></XIcon>
                </div>
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Use the form below to create a new batch for conversion </p>
              </div>
              <div className="my-8 flex flex-col gap-4">
                <ConvManInput
                  type="text"
                  label="Batch Name"
                  placeHolder=" "
                  name="BatchName"
                  value={batchName}
                  onInputChange={(newValue: string, name: string) => {
                    setBatchName(newValue);
                  }}
                ></ConvManInput>

                <ConvManSelectList
                  label="Conversion Type"
                  items={convTypes}
                  onListboxChange={(newValue: any) => {
                    setConvType(newValue);
                  }}
                ></ConvManSelectList>
                <ConvManSelectList
                  label="Pod"
                  items={pods}
                  onListboxChange={(newValue: any) => {
                    setPod(newValue);
                  }}
                ></ConvManSelectList>
                <ConvManFileInput
                  label="completed conversion file"
                  onFileChange={(file) => {
                    setUploadFile(file);
                  }}
                ></ConvManFileInput>
              </div>

              <div className="mt-4 flex justify-end items-center gap-4 justify-items-center">
                <button type="button" className="button red" onClick={(e) => props.toggle(false)}>
                  Close
                </button>
                <button type="button" className="button blue" onClick={(e) => createBatch()}>
                  Create Batch
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
