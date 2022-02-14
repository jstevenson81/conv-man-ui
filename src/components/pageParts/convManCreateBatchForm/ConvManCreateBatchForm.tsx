import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import ConvManInput from "../../forms/ConvManInput";
import ConvManSelectList from "../../forms/ConvManSelectList";
import { XIcon } from "@heroicons/react/solid";

type ICreateBatchProps = {
  isOpen: boolean;
  toggle(open: boolean): void;
};

const ConvManCreateBatchForm: React.FC<ICreateBatchProps> = (props: ICreateBatchProps) => {
  const [batchName, setBatchName] = useState("");
  const [convType, setConvType] = useState("");

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
                  onInputChange={(newValue: string, name: string) => {
                    console.log({ newValue, name });
                  }}
                ></ConvManInput>

                <ConvManSelectList
                  items={[
                    { option: "Select a template type", value: 0 },
                    { option: "This is a 1", value: 1 },
                    { option: "This is a 2", value: 2 },
                    { option: "This is a 3", value: 3 },
                    { option: "This is a 4", value: 4 },
                  ]}
                  onListboxChange={(newValue: any) => {
                    console.log(newValue);
                  }}
                ></ConvManSelectList>
                <ConvManSelectList
                  items={[
                    { option: "Select a pod", value: 0 },
                    { option: "DEV-1", value: 1 },
                    { option: "DEV-2", value: 2 },
                    { option: "DEV-3", value: 3 },
                    { option: "DEV-4", value: 4 },
                  ]}
                  onListboxChange={(newValue: any) => {
                    console.log(newValue);
                  }}
                ></ConvManSelectList>
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
