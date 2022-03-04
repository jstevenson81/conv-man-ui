import { InformationCircleIcon, PlusIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";

import { IUxPod } from "../../../models/entities/base/IUxPod";
import { ICreateBatchResponse } from "../../../models/responses/ICreateBatchResponse";
import { ServerConfig } from "../../../ServerConfig";
import { BatchRequestSvc } from "../../../services/BatchRequestSvc";
import ConvManLoader from "../../common/loader/ConvManLoader";
import ConvManToastr, { ConvManToastrType } from "../../common/toasts/ConvManToastr";
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
  const [toastrMsg, setToastrMsg] = useState("");
  const [toastrShown, setToastrShown] = useState(false);
  const [toastrType, setToastrType] = useState<ConvManToastrType>("info");
  //#endregion

  const [batchSelectItems, setBatchSelectItems] = useState<Array<IConvManSelectListItem>>([]);
  const [templates] = useState<Array<IConvManSelectListItem>>([
    { label: "DC001 - Work Structures", value: "DC001.xlsx" },
    { label: "DC002 - Global HR", value: "DC002.xlsx" },
  ]);

  const [selectedBatch, setSelectedBatch] = useState<IConvManSelectListItem>({ label: "", value: "" });

  useEffect(() => {
    const batchReqSvc = new BatchRequestSvc();
    batchReqSvc.getAllBatches().then((batches) => {
      const mappedBatches = batchReqSvc.convertToSelectList({
        data: batches.entities,
        props: { option: "cnv_batch", value: "cnv_batch", lookup: "cnv_batch" },
      });
      setBatchSelectItems(mappedBatches);
    });
  }, [setNewBatchOpen]);

  const batchComplete = (createBatchRes: ICreateBatchResponse) => {
    setLoaderMsg("");
    setRefreshNewBatchData(!refreshNewBatchData);
    setIsLoading(false);
    setNewBatchOpen(false);
    const batch = createBatchRes.batchCreateResponse.entities[0];
    showToastr(
      `
      Batch ${batch.cnv_batch} sucessfully created
      Response: ${createBatchRes.spCreateResp.data}
      `,
      "success"
    );
  };

  const podCreated = (newPod: IUxPod) => {
    setLoaderMsg("");
    setIsLoading(false);
    setPodManagerOpen(false);
    setRefreshNewBatchData(!refreshNewBatchData);
    showToastr(`Pod ${newPod.pod_name} sucessfully created`, "success");
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

  const showToastr = (toastrMsg: string, type: ConvManToastrType) => {
    setToastrType(type);
    setToastrMsg(toastrMsg);
    setToastrShown(true);
    window.setTimeout(() => {
      setToastrMsg("");
      setToastrShown(false);
    }, 200);
  };

  return (
    <div>
      <div className="mt-8">
        <div className="flex items-center justify-start justify-items-start gap-4">
          <h1 className="text-2xl">recent conversions</h1>
          <button
            className="button blue flex items-center justify-start justify-items-start gap-1"
            onClick={() => setNewBatchOpen(true)}
          >
            <PlusIcon className="h-4 w-4"></PlusIcon>
            <span>new conversion</span>
          </button>
          <button
            className="button red flex items-center justify-start justify-items-start gap-1"
            onClick={() => setPodManagerOpen(true)}
          >
            <PlusIcon className="h-4 w-4"></PlusIcon>
            <span>Create Pod</span>
          </button>
        </div>
        <div className="text-slate-600 border border-green-600 bg-green-200 p-2 rounded-lg my-4 flex items-center gap-2">
          <InformationCircleIcon className="w-10 h-10"></InformationCircleIcon>
          <p className="text-sm">
            Below are your recent conversions submitted. Select a batch, and there will be visuals and tables that will
            allow you to correct your errors and re-submit
          </p>
        </div>
        <div className="mt-4">
          <ConvManSelectList
            items={batchSelectItems}
            label="Conversion"
            onListboxChange={(newVal) => {
              setSelectedBatch(newVal);
            }}
          ></ConvManSelectList>
        </div>
        <div className="mt-4">
          <ConvManErrorTableContainer batchName={selectedBatch.value}></ConvManErrorTableContainer>
        </div>
      </div>

      <h1 className="mt-8 text-2xl">Templates</h1>
      <p>Click on any of the buttons below to download the template to use to create a conversion.</p>
      <div className="flex items-center justify-start justify-items-start gap-2 mt-4 w-full">
        {templates.map((t) => {
          return (
            <button
              className="button blue"
              key={t.value}
              onClick={() => {
                downloadTemplate(t);
              }}
            >
              {t.label}
            </button>
          );
        })}
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

      <ConvManToastr
        message={toastrMsg}
        autoClose={2000}
        position="top-right"
        show={toastrShown}
        type={toastrType}
      ></ConvManToastr>
      <ConvManLoader show={isLoading} message={loaderMsg}></ConvManLoader>
    </div>
  );
};

export default Conversions;
