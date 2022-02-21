import React, { useMemo } from "react";
import { Column, useTable } from "react-table";
import { IValidationError } from "../../../services/models/data/interfaces/ords/module/api/IValidationError";
import { IConvManErrorTableDef } from "./interfaces/ICnvErrorTable";

const ConvManErrTable: React.FC<IConvManErrorTableDef> = (props: IConvManErrorTableDef) => {
  //#region column and data memo setup

  // set the columns passed as a prop to a memo to allow for caching
  // and faster operation.  Required by react-tables
  const columns = useMemo(() => {
    return props.columns as Array<Column<IValidationError>>;
  }, [props.columns]);

  // set the data passed as a prop to a memo to allow for caching
  // and faster operation.  Required by react-tables
  const data = useMemo(() => {
    return props.data;
  }, [props.data]);

  //#endregion

  //#region table instance

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  //#endregion

  //#region render
  return (
    // apply the table props
    <div>
      <h2 className="text-xl">Errors on sheet: {props.sheetName}</h2>
      <table className="font-sm font-mono uppercase" {...getTableProps()}>
        <thead className="bg-blue-100">
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      className="border-b border-t border-blue-300 font-medium p-4 text-left text-xs"
                      {...column.getHeaderProps()}
                    >
                      {
                        // Render the header
                        column.render("Header")
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody className="" {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td
                          className="border-b border-blue-300 font-medium p-4 text-left text-xs"
                          {...cell.getCellProps()}
                        >
                          {
                            // Render the cell contents
                            cell.render("Cell")
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
  //#endregion
};

export default ConvManErrTable;
