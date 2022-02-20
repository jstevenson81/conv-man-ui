import { useState, useEffect } from "react";
import { IConvManErrorTableDef } from "./interfaces/ICnvErrorTable";
import { IConvManErrorTableProps } from "./interfaces/IConvManErrorTableProps";
import buildTables, { IPieChartData, buildErrorPieData } from "./ConvManErrorTableHelpers";
import ConvManLoader from "../../common/loader/ConvManLoader";
import ConvManErrorTable from "./ConvManErrorTable";
import { PieChart, ResponsiveContainer, Tooltip, Pie, Cell, Legend } from "recharts";

const ConvManErrTableCollection: React.FC<IConvManErrorTableProps> = (props: IConvManErrorTableProps) => {
  //#region state
  const [errorTables, setErrorTables] = useState<Array<IConvManErrorTableDef>>([]);
  const [loadingState, setLoadingState] = useState({ show: false, message: "" });
  const [pieData, setPieData] = useState<Array<IPieChartData>>([]);
  const unsetLoading = () => {
    setLoadingState({ show: false, message: "" });
  };
  //#endregion

  //#region table data

  useEffect(() => {
    if (!props.batchName || props.batchName === "") setErrorTables([]);
    else {
      setLoadingState({ show: true, message: `getting errors for batch: ${props.batchName}` });
      buildTables(props.batchName).then((tables) => {
        setErrorTables(tables);
        const chartData = buildErrorPieData(tables);
        setPieData(chartData);
        unsetLoading();
      });
    }
  }, [props.batchName]);

  //#endregion

  return (
    <div>
      <ConvManLoader show={loadingState.show} message={loadingState.message}></ConvManLoader>
      <div className="w-full h-[200px] mb-16">
        <h3 className={`text-lg text-center ${pieData.length > 0 ? "visible" : "hidden"}`}>Errors By Sheet</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={pieData} innerRadius={40} outerRadius={80} cx="50%" cy="50%" label>
              {pieData.map((e, i) => (
                <Cell key={`cell-${i}`} fill={i % 2 === 0 ? "#93c5fd" : "#3b82f6"}></Cell>
              ))}
            </Pie>
            <Legend verticalAlign="top" align="center"></Legend>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-8">
        {errorTables.map((table) => {
          return <ConvManErrorTable {...table} key={table.key}></ConvManErrorTable>;
        })}
      </div>
    </div>
  );
};

export default ConvManErrTableCollection;
