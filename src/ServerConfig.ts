export const ServerConfig = {
  contentTypes: {
    excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    json: "application/json",
  },
  ords: {
    url: "https://etvwbwij8jdtzoz-hcmconversion1.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/",
    entities: {
      pod: "uxpods/",
      podEmails: "podemails/",
      spreadsheets: "spreadsheets/",
      customMethods: "api/",
      batchRequests: "batchRequests/",
      convPackage: "convOps/",
    },
    customActions: {
      gets: {
        attributes: "attributes",
        errorsByBatch: "errors/{{batch}}",
        spDataByBatch: "spreadsheets/{{batch}}",
        worksheets: "worksheets",
        batches: "batches",
        podsByEmail: "pods/{{email}}",
        pods: "pods",
        podEmails: "podemails",
        totalErrorsPerBatch: "errorsbyhdl/{{batch}}",
        totalRowsPerBatch: "rowsbyhdl/{{batch}}",
        hasErrorsByBatch: "haserrors/{{batch}}",
      },
      posts: {
        batchload: "batchload",
        moveToCnv: "MOVE_TO_CNV",
        updateDateCnv: "UPDATE_DATA_CNV",
        validateCnv: "VALIDATE_CNV",
        convertToHdl: "CONVERT_CNV_TO_HDL",
        createHdlFile: "CREATE_HDL_FILE",
      },
    },
  },
};
