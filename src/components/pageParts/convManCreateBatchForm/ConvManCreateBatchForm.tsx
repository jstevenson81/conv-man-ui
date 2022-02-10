import React, { useState } from "react";
import ConvManInput from "../../forms/ConvManInput";
import ConvManSelectList from "../../forms/ConvManSelectList";

type ICreateBatchProps = {};

const ConvManCreateBatchForm: React.FC<ICreateBatchProps> = (props: ICreateBatchProps) => {
  const [batchName, setBatchName] = useState("");
  const [convType, setConvType] = useState("");
  return (
    <form>
      <ConvManInput
        label="Batch Name"
        name="batch_name"
        placeHolder="choose a batch name"
        type="text"
        onInputChange={(value: string, name: string) => {
          setBatchName(value);
        }}
      ></ConvManInput>
      <div className="mt-8">
        <ConvManSelectList
          items={[
            { option: "blah", value: 1 },
            { option: "blah", value: 1 },
            { option: "blah", value: 1 },
            { option: "blah", value: 1 },
            { option: "blah", value: 1 },
            { option: "blah", value: 1 },
            { option: "blah", value: 1 },
          ]}
          label="blah options"
          onListboxChange={(newValue: any) => {
            setConvType(newValue);
          }}
        ></ConvManSelectList>
      </div>
    </form>
  );
};

export default ConvManCreateBatchForm;
