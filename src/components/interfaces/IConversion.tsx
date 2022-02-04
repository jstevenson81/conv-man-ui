export interface IConversion {
  convType: string;
  pod: {
    name: string;
    url: string;
  };
  fileName: string;
  dateTime: string;
}

export interface IValidationError {
  errorType: string;
  message: string;
  row: number;
  column: string;
  columnData: string;
  fileName: string;
  rowData: string;
  resolved: boolean;
}
