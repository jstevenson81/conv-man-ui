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

type ICreateBatchProps = {
  isOpen: boolean;
  toggle(open: boolean): void;
};

const ConvManCreateBatchForm: React.FC<ICreateBatchProps> = (props: ICreateBatchProps) => {
  const [batchName, setBatchName] = useState("");
  const [template, setTemplate] = useState("");
  const [uploadFile, setUploadFile] = useState<IConvManFileInputState>({
    fileExt: "",
    fileName: "",
    fileText: "",
    lastModified: "",
  });

  const [convTypes, setConvTypes] = useState<Array<IConvManSelectListItem>>([]);
  const [pods, setPods] = useState<Array<IConvManSelectListItem>>([]);

  const convTypeSvc = new ConversionTypeService({
    ordsUri: ServerConfig.ords.url,
    entity: ServerConfig.ords.entities.conversionTypes,
  });

  const podSvc = new PodService({
    ordsUri: ServerConfig.ords.url,
    entity: ServerConfig.ords.entities.pod,
  });

  useEffect(() => {
    convTypeSvc.getAllConvTypes().then((resp: ApiResponse<IUxConversionType>) => {
      const iConvTypes: Array<IConvManSelectListItem> = [];
      resp.oracleResponse?.items.forEach((i) => {
        iConvTypes.push({ option: i.conversion_type_name, value: i.ux_conversion_type_id });
      });
      setConvTypes(iConvTypes);
    });

    podSvc.getAllPods().then((resp: IApiResponse<IUxPod>) => {
      const iPods: Array<IConvManSelectListItem> = [];
      resp.oracleResponse?.items.forEach((pod) => {
        iPods.push({ option: pod.pod_name, value: pod.pod_url, disabled: false });
      });
      setPods(iPods);
    });

    setBatchName(DateTime.now().valueOf().toString());
  }, []);

  useEffect(() => {
    console.log(`current batch name: ${batchName}`);
  }, [batchName]);

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={(e) => props.toggle(false)}>
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
            <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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
                    console.log(newValue);
                  }}
                ></ConvManSelectList>
                <ConvManSelectList
                  label="Pod"
                  items={pods}
                  onListboxChange={(newValue: any) => {
                    console.log(newValue);
                  }}
                ></ConvManSelectList>
                <ConvManFileInput
                  label="Completed template"
                  onFileChange={(file) => {
                    setUploadFile(file);
                  }}
                ></ConvManFileInput>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={(e) => props.toggle(false)}
                >
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
