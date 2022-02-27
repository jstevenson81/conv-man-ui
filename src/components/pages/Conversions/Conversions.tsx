import React, { useEffect, useState } from "react";

import { ServerConfig } from "../../../ServerConfig";
import { BatchRequestSvc } from "../../../services/BatchRequestSvc";
import ConvManLoader from "../../common/loader/ConvManLoader";
import ConvManToastr, { ConvManToastrType } from "../../common/toasts/ConvManToastr";
import ConvManSelectList from "../../forms/ConvManSelectList";
import { IConvManSelectListItem } from "../../forms/interfaces/ISelectListItem";
import ConvManErrorTableContainer from "../../pageParts/convErrorManager/ConvManErrorTableContainer";
import ConvManCreateBatchForm from "../../pageParts/convManCreateBatchForm/ConvManCreateBatchForm";
import IConvManDashProps from "./interfaces/IConvManDashProps";

const Conversions: React.FC<IConvManDashProps> = () => {
  const [newBatchOpen, setNewBatchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //#region Toastr setup
  const [toastMsg, setToastMsg] = useState("");
  const [showToastr, setShowToastr] = useState(false);
  const [toastType, setToastType] = useState<ConvManToastrType>("info");
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
        props: { option: "cnv_batch", value: "cnv_batch" },
      });
      setBatchSelectItems(mappedBatches);
    });
  }, []);

  const toggleNewBatch = (open: boolean) => {
    setNewBatchOpen(open);
  };

  const toggleLoading = (loading: boolean) => {
    setIsLoading(loading);
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

  const toggleToast = (toastrMsg: string, type: ConvManToastrType) => {
    setToastType(type);
    setToastMsg(toastrMsg);
    setShowToastr(!showToastr);
  };

  return (
    <div>
      <ConvManToastr
        message={toastMsg}
        autoClose={1000}
        position="top-right"
        show={showToastr}
        type={toastType}
      ></ConvManToastr>
      <ConvManLoader show={isLoading} message="Please wait while we complete your request"></ConvManLoader>
      <div className="flex items-center justify-start justify-items-start mb-2 gap-4">
        <h1 className="text-2xl">Conversions</h1>
        <button
          className="button blue"
          onClick={() => {
            toggleNewBatch(true);
            toggleToast("I just clicked the new conversion button", "success");
          }}
        >
          new conversion
        </button>
      </div>
      <p>
        This page allows you to manage your conversion processes. You can create a new conversion or resolve any issues
        with existing conversions and resubmit
      </p>
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
      <div className="mt-8">
        <h1 className="text-2xl">recent conversions</h1>
        <p className="mb-3">
          Below are your recent conversions submitted. Select a batch, and there will be visuals and tables that will
          allow you to correct your errors and re-submit
        </p>
        <ConvManSelectList
          items={batchSelectItems}
          label="Batch"
          onListboxChange={(newVal) => {
            setSelectedBatch(newVal);
          }}
        ></ConvManSelectList>
      </div>
      <div className="mt-8">
        <ConvManErrorTableContainer batchName={selectedBatch.value}></ConvManErrorTableContainer>
      </div>

      <ConvManCreateBatchForm
        isOpen={newBatchOpen}
        toggle={toggleNewBatch}
        onLoading={toggleLoading}
      ></ConvManCreateBatchForm>
    </div>
  );
};

export default Conversions;
