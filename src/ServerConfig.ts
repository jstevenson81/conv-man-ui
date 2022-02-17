export const ServerConfig = {
  ords: {
    url: "https://etvwbwij8jdtzoz-hcmconversion1.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/",
    entities: {
      pod: "uxpods/",
      conversionTypes: "uxconvtypes/",
      podEmails: "uxpodemails/",
      spreadsheetRows: "cnvsp/",
      customMethods: "api/",
    },
    customActions: {
      getAllAttr: "cnvdata/attr",
      getErrorsByBatch: "errors/{{batch}}",
      getAllWorksheets: "worksheets",
      batchload: "batchload"
    },
  },
};
