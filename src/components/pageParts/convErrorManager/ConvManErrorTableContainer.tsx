import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import * as XLSX from "xlsx";

import ExcelSvc from "../../../services/ExcelSvc";
import ConvManLoader from "../../common/loader/ConvManLoader";
import ConvManErrorTable from "./ConvManErrorTable";
import buildTables, { buildErrorPieData, IPieChartData } from "./ConvManErrorTableHelpers";
import { IConvManErrorTableDef } from "./interfaces/IConvManErrorTableDef";
import { IConvManErrorTableProps } from "./interfaces/IConvManErrorTableProps";

const ConvManErrTableCollection: React.FC<IConvManErrorTableProps> = (props: IConvManErrorTableProps) => {
  //#region state
  const [errorTables, setErrorTables] = useState<Array<IConvManErrorTableDef>>([]);
  const [loadingState, setLoadingState] = useState({ show: false, message: "" });
  const [pieData, setPieData] = useState<Array<IPieChartData>>([]);
  const unsetLoading = () => {
    setLoadingState({ show: false, message: "" });
  };
  //#endregion

  //#region errors to json

  const errorsToJson = (): void => {
    const svc = new ExcelSvc();
    XLSX.writeFileXLSX(
      svc.jsonToBook(errorTables),
      `${props.batchName}_errors_${DateTime.now().toFormat("yyyyMMdd")}.xlsx`,
      { bookSST: true, type: "base64" }
    );
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
    <>
      <ConvManLoader show={loadingState.show} message={loadingState.message}></ConvManLoader>
      <div className={errorTables && errorTables.length > 0 ? "visible" : "hidden"}>
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
          <button className="button red" onClick={errorsToJson}>
            Download Errors
          </button>
          {errorTables.map((table) => {
            return <ConvManErrorTable {...table} key={table.key}></ConvManErrorTable>;
          })}
        </div>
      </div>
    </>
  );
};

export default ConvManErrTableCollection;
