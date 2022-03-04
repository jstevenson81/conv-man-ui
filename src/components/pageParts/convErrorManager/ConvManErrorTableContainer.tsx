import { InformationCircleIcon } from "@heroicons/react/outline";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";

import ExcelSvc from "../../../services/ExcelSvc";
import ConvManLoader from "../../common/loader/ConvManLoader";
import ConvManErrorTable from "./ConvManErrorTable";
import buildTables, { buildErrorPieData, buildTotalLineData, IPieChartData, ISummaryData } from "./ConvManErrorTableHelpers";
import { IConvManErrorTableDef } from "./interfaces/IConvManErrorTableDef";
import { IConvManErrorTableProps } from "./interfaces/IConvManErrorTableProps";

const ConvManErrTableCollection: React.FC<IConvManErrorTableProps> = (props: IConvManErrorTableProps) => {
  //#region state
  const [errorTables, setErrorTables] = useState<Array<IConvManErrorTableDef>>([]);
  const [loadingState, setLoadingState] = useState({ show: false, message: "" });

  //#region chart data
  const [pieData, setPieData] = useState<Array<IPieChartData>>([]);
  const [summaryData, setSummaryData] = useState<ISummaryData[]>([]);

  //#endregion

  const unsetLoading = () => {
    setLoadingState({ show: false, message: "" });
  };
  //#endregion

  const barColorsBlue = ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"];
  const barColorsPurple = ["#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87"];

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
        setPieData(buildErrorPieData(tables));
        buildTotalLineData(props.batchName).then((data) => setSummaryData(data));
        unsetLoading();
      });
    }
  }, [props.batchName]);

  //#endregion

  return (
    <>
      <ConvManLoader show={loadingState.show} message={loadingState.message}></ConvManLoader>
      <div className={errorTables && errorTables.length > 0 ? "visible" : "hidden"}>
        <div className="w-full h-[200px] mt-10 mb-4 flex items-center">
          <ResponsiveContainer>
            <BarChart width={730} height={250} data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {summaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColorsBlue[index % 20]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={pieData} innerRadius={40} outerRadius={80} cx="50%" cy="50%" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColorsPurple[index % 20]}></Cell>
                ))}
              </Pie>
              <Legend verticalAlign="top" align="center"></Legend>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-start justify-items-start mb-10">
          <h3 className={`text-md mr-2 ${pieData.length > 0 || summaryData.length > 0 ? "visible" : "hidden"}`}>
            Conversion Charts
          </h3>
          <div className="text-slate-600 border border-sky-600 bg-sky-200 p-2 rounded-lg flex items-center gap-2">
            <InformationCircleIcon className="w-10 h-10"></InformationCircleIcon>
            <p className="text-sm">
              The chart on the left shows total lines by sheet. The chart on the right shows errors by sheet.
            </p>
          </div>
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
