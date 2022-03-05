import "react-toastify/dist/ReactToastify.css";

import { ClipboardCheckIcon, InformationCircleIcon, PlusIcon } from "@heroicons/react/outline";
import _ from "lodash";
import { useEffect, useState } from "react";
import { toast, ToastContainer, ToastPosition } from "react-toastify";

import { IUxPod } from "../../../models/entities/base/IUxPod";
import { ICreateBatchResponse } from "../../../models/responses/ICreateBatchResponse";
import { ServerConfig } from "../../../ServerConfig";
import { BatchRequestSvc } from "../../../services/BatchRequestSvc";
import ConvManLoader from "../../common/loader/ConvManLoader";
import { ConvManToastrOpts } from "../../common/toasts/ConvManToastrOpts";
import ConvManSelectList from "../../forms/ConvManSelectList";
import { IConvManSelectListItem } from "../../forms/interfaces/ISelectListItem";
import ConvManErrorTableContainer from "../../pageParts/convErrorManager/ConvManErrorTableContainer";
import ConvManCreateBatchForm from "../../pageParts/convManCreateBatchForm/ConvManCreateBatchForm";
import ConvManPodManager from "../../pageParts/podManager/ConvManPodManager";
import IConvManDashProps from "./interfaces/IConvManDashProps";

const Conversions: React.FC<IConvManDashProps> = () => {
  const [newBatchOpen, setNewBatchOpen] = useState(false);
  const [podManagerOpen, setPodManagerOpen] = useState(false);
  const [refreshNewBatchData, setRefreshNewBatchData] = useState(false);

  // loading
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("");

  //#region Toastr setup
  const toastrConfig: { autoClose: number; position: ToastPosition } = { autoClose: 2000, position: "top-right" };
  //#endregion

  const [batchSelectItems, setBatchSelectItems] = useState<Array<IConvManSelectListItem>>([]);
  const [templates] = useState<Array<IConvManSelectListItem>>([
    { label: "DC001 - Work Structures", value: "DC001.xlsx" },
    { label: "DC002 - Global HR", value: "DC002.xlsx" },
  ]);

  const [selectedBatch, setSelectedBatch] = useState<IConvManSelectListItem>({ label: "", value: "" });
  const [errorBatch, setErrorBatch] = useState("");

  useEffect(() => {
    const batchReqSvc = new BatchRequestSvc();
    batchReqSvc.getAllBatches().then((batches) => {
      const mappedBatches = batchReqSvc.convertToSelectList({
        data: batches.entities,
        props: { option: "cnv_batch", value: "cnv_batch", lookup: "cnv_batch" },
      });
      setBatchSelectItems(mappedBatches);
      const currentBatch = _.find(mappedBatches, (batch) => {
        return batch.label === errorBatch;
      });
      if (currentBatch) setSelectedBatch(currentBatch);
    });
  }, [setNewBatchOpen, errorBatch]);

  const batchComplete = (createBatchRes: ICreateBatchResponse) => {
    const batch = createBatchRes.batchCreateResponse.entities[0];
    if (createBatchRes.convOpsResp.hasErrors) {
      toast.warning(
        `Batch ${batch.cnv_batch} sucessfully created, however, there were validation errors.
      See the errors below.`,
        ConvManToastrOpts(toastrConfig)
      );
      setErrorBatch(batch.cnv_batch);
    } else {
      toast.success(
        `Batch ${batch.cnv_batch} sucessfully created.  Response: ${createBatchRes.spCreateResp.data}`,
        ConvManToastrOpts(toastrConfig)
      );
    }

    // reset state
    toggleLoading({ message: "", loading: false });
    setNewBatchOpen(false);
    setRefreshNewBatchData(!refreshNewBatchData);
  };

  const podCreated = (newPod: IUxPod) => {
    toggleLoading({ message: "", loading: false });
    setPodManagerOpen(false);
    setRefreshNewBatchData(!refreshNewBatchData);
    toast.success(`Pod ${newPod.pod_name} sucessfully created`, ConvManToastrOpts(toastrConfig));
  };

  const toggleLoading = ({ loading, message }: { loading: boolean; message: string }) => {
    setIsLoading(loading);
    setLoaderMsg(message);
  };

  const downloadTemplate = (tmpl: IConvManSelectListItem) => {
    fetch(`templates/${tmpl.value}`, {
      method: "GET",
      headers: {
        "Content-Type": ServerConfig.contentTypes.excel,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${tmpl.label}.xlsx`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode?.removeChild(link);
      });
  };

  return (
    <div>
      <div className="mt-8">
        <div className="flex items-start justify-between justify-items-stretch gap-4">
          <div className="flex-grow">
            <div className="text-slate-600 border border-green-600 bg-green-200 px-2 py-4 rounded-lg flex items-center gap-2 mb-4">
              <InformationCircleIcon className="w-8 h-8"></InformationCircleIcon>
              <p className="text-sm">
                Click the new conversion button to start a conversion process. You can also create a new pod. To
                download a template, just select one from the list below.
              </p>
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-evenly button blue gap-1" onClick={() => setNewBatchOpen(true)}>
              <ClipboardCheckIcon className="h-8 w-8"></ClipboardCheckIcon>
              <span>new conversion</span>
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-evenly button red gap-1" onClick={() => setPodManagerOpen(true)}>
              <PlusIcon className="h-8 w-8"></PlusIcon>
              <span>new pod</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ConvManSelectList
            items={templates}
            label="Conversion Templates"
            smallLabel="select a template to download"
            onListboxChange={(template) => {
              downloadTemplate(template);
            }}
            selectedItem={templates[0]}
          ></ConvManSelectList>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl mb-4 mt-10">recent conversions</h1>

          <ConvManSelectList
            items={batchSelectItems}
            label="Conversion"
            smallLabel="select a conversion to see its details"
            selectedItem={selectedBatch}
            onListboxChange={(newVal) => {
              setSelectedBatch(newVal);
            }}
          ></ConvManSelectList>
        </div>
        <div className="mt-4">
          <ConvManErrorTableContainer batchName={selectedBatch.value}></ConvManErrorTableContainer>
        </div>
      </div>

      <ConvManCreateBatchForm
        isOpen={newBatchOpen}
        toggle={(open) => setNewBatchOpen(open)}
        onLoading={toggleLoading}
        onBatchComplete={batchComplete}
        refreshData={refreshNewBatchData}
      ></ConvManCreateBatchForm>

      <ConvManPodManager
        isOpen={podManagerOpen}
        onPodCreated={(newPod: IUxPod) => podCreated(newPod)}
        onToggleOpen={(open: boolean) => setPodManagerOpen(open)}
      ></ConvManPodManager>

      <ConvManLoader show={isLoading} message={loaderMsg}></ConvManLoader>

      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Conversions;
