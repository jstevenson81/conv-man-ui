import _ from "lodash";
import React from "react";
import { Column, useTable } from "react-table";
import { ICnvValError } from "../models/data/Interfaces/ORDS/ICnvValError";
import { IConvManCol } from "../services/data/CnvDataService";

type ConvManErrorTableProps = {
  columns: Array<IConvManCol<ICnvValError>>;
  data: Array<ICnvValError>;
};

const ConvManErrorTable: React.FC<ConvManErrorTableProps> = (props: ConvManErrorTableProps) => {
  const tableInstance = useTable({ columns: props.columns as Array<Column<ICnvValError>>, data: props.data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
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
                    className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left"
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
      <tbody className="bg-slate-700" {...getTableBodyProps()}>
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
                        className="border-b border-slate-800 font-medium p-4 text-gray-200 text-left"
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
  );
};

export default ConvManErrorTable;
