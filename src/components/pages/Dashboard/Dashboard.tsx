import React from "react";
import ConvManCreateBatchForm from "../../pageParts/convManCreateBatchForm/ConvManCreateBatchForm";
import IConvManDashProps from "./interfaces/IConvManDashProps";

const Dashboard: React.FC<IConvManDashProps> = (props: IConvManDashProps) => {
  return <ConvManCreateBatchForm></ConvManCreateBatchForm>;
};

export default Dashboard;
