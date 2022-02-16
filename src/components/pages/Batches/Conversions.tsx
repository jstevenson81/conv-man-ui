import { Transition } from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";
import ConvManLoader from "../../common/loader/ConvManLoader";
import ConvManSelectList from "../../forms/ConvManSelectList";
import IConvManSelectListState from "../../forms/interfaces/IConvManSelectListState";
import { IConvManSelectListItem } from "../../forms/interfaces/ISelectListItem";
import ConvManCreateBatchForm from "../../pageParts/convManCreateBatchForm/ConvManCreateBatchForm";
import IConvManDashProps from "./interfaces/IConvManDashProps";

const Conversions: React.FC<IConvManDashProps> = (props: IConvManDashProps) => {
  const [newBatchOpen, setNewBatchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<Array<IConvManSelectListItem>>([
    { label: "DC001 - Work Structures", value: "DC001.xlsx" },
    { label: "DC002 - Global HR", value: "DC002.xlsx" },
  ]);

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
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
      <ConvManLoader show={isLoading} message="Please wait while we complete your request"></ConvManLoader>
      <div className="flex items-center justify-start justify-items-start mb-2 gap-4">
        <h1 className="text-2xl">Conversions</h1>
        <button className="button blue" onClick={(e) => toggleNewBatch(true)}>
          new conversion
        </button>
      </div>
      <p>
        This page allows you to manage your conversion processes. You can create a new conversion or resolve any issues
        with existing conversions and resubmit
      </p>
      <div className="flex items-center justify-start justify-items-start gap-2 mt-8 w-full">
        <ConvManSelectList
          items={templates}
          label="conversion template"
          onListboxChange={(tmpl: IConvManSelectListItem) => {
            downloadTemplate(tmpl);
          }}
        ></ConvManSelectList>
      </div>
      <div className="mt-8">
        <h1 className="text-2xl">recent batches</h1>
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
