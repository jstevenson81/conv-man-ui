import { Transition } from "@headlessui/react";
import React, { useState } from "react";
import ConvManCreateBatchForm from "../../pageParts/convManCreateBatchForm/ConvManCreateBatchForm";
import IConvManDashProps from "./interfaces/IConvManDashProps";

const Conversions: React.FC<IConvManDashProps> = (props: IConvManDashProps) => {
  const [newBatchOpen, setNewBatchOpen] = useState(false);

  const toggleNewBatch = (open: boolean) => {
    setNewBatchOpen(open);
  };

  return (
    <div>
      <div className="flex items-center justify-start justify-items-start mb-2">
        <h1 className="text-2xl mr-8">Conversions</h1>
        <button
          className=" bg-sky-600 px-4 py-2 group rounded-lg border-sky-700 text-white border-2 hover:rounded-full hover:bg-sky-900 hover:text-white transition duration-300"
          onClick={(e) => toggleNewBatch(true)}
        >
          new conversion
        </button>
      </div>
      <p>
        This page allows you to manage your conversion processes. You can create a new conversion or resolve any issues
        with existing conversions and resubmit
      </p>
      <div className="flex items-center justify-start justify-items-start gap-2 mt-8"></div>
      <div className="mt-8">
        <h1 className="text-2xl">recent batches</h1>
      </div>

      <ConvManCreateBatchForm isOpen={newBatchOpen} toggle={toggleNewBatch}></ConvManCreateBatchForm>
    </div>
  );
};

export default Conversions;
