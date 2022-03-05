import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";

import PodEmailSvc from "../../../services/PodEmailSvc";
import PodSvc from "../../../services/PodSvc";
import ConvManInput from "../../forms/ConvManInput";
import ConvManSelectList from "../../forms/ConvManSelectList";
import { IConvManSelectListItem } from "../../forms/interfaces/ISelectListItem";
import { IConvManPodManagerProps } from "./interfaces/IConvManPodManagerProps";

const ConvManPodManager: React.FC<IConvManPodManagerProps> = ({ isOpen, onPodCreated, onToggleOpen }) => {
  const [podName, setPodName] = useState("");
  const [podUrl, setPodUrl] = useState("");
  const [podEmail, setPodEmail] = useState<IConvManSelectListItem>({ label: "", value: "" });
  const [podEmailSelectItems, setPodEmailSelectItems] = useState<IConvManSelectListItem[]>([]);

  //#region data gathering
  useEffect(() => {
    const emailSvc = new PodEmailSvc();
    emailSvc.getAllPodEmails().then((response) => {
      const items: IConvManSelectListItem[] = response.entities.map((e) => {
        return { label: e.email_domain, value: e.ux_pod_email_id };
      });
      setPodEmailSelectItems(items);
    });
  }, []);

  //#endregion

  //#region methods
  const createPod = (): void => {
    const svc = new PodSvc();
    svc
      .createPod({ pod_name: podName, pod_url: podUrl, ux_pod_id: null, uxp_ux_pod_email_id: podEmail!.value })
      .then((response) => {
        onPodCreated(response.entities[0]);
        onToggleOpen(false);
      });
  };
  //#endregion

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10" onClose={() => onToggleOpen(false)}>
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
                <h3 className="text-lg font-medium leading-6">Manage Pods</h3>
                <div className="hover:text-gray-800 hover:scale-125 transition duration-300">
                  <XIcon className="w-5 h-5 hover:cursor-pointer" onClick={() => onToggleOpen(false)}></XIcon>
                </div>
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Use the form below to create a new conversion request</p>
              </div>
              <div className="my-8 flex flex-col gap-4">
                <ConvManInput
                  type="text"
                  label="Pod Name"
                  placeHolder=" "
                  name="PodName"
                  value={podName}
                  onInputChange={(newValue: string) => setPodName(newValue)}
                ></ConvManInput>
                <ConvManInput
                  type="text"
                  label="Pod URL"
                  placeHolder=" "
                  name="PodUrl"
                  value={podUrl}
                  onInputChange={(newValue: string) => setPodUrl(newValue)}
                ></ConvManInput>
                <ConvManSelectList
                  items={podEmailSelectItems}
                  label="Email Domain"
                  smallLabel="select an email associated to this pod"
                  selectedItem={podEmail}
                  onListboxChange={(newValue) => setPodEmail(newValue)}
                ></ConvManSelectList>
              </div>

              <div className="mt-4 flex justify-end items-center gap-4 justify-items-center">
                <button type="button" className="button red" onClick={() => onToggleOpen(false)}>
                  Close
                </button>
                <button type="button" className="button blue" onClick={() => createPod()}>
                  Create Pod
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConvManPodManager;
