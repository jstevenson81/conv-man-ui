export const ServerConfig = {
  ords: {
    url: "https://etvwbwij8jdtzoz-hcmconversion1.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/",
    entities: {
      pod: "uxpods/",
      podEmails: "podemails/",
      spreadsheets: "spreadsheets/",
      customMethods: "api/",
      batchRequests: "batchRequests/",
    },
    customActions: {
      gets: {
        attributes: "attributes",
        errorsByBatch: "errors/{{batch}}",
        spreadsheetsByBatch: "spreadsheets/{{batch}}",
        worksheets: "worksheets",
        batches: "batches",
        podsByEmail: "pods/{{email}}",
      },
      posts: {
        batchload: "batchload",
      },
    },
  },
};
