export const ServerConfig = {
  contentTypes: {
    excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
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
        spDataByBatch: "spreadsheets/{{batch}}",
        worksheets: "worksheets",
        batches: "batches",
        podsByEmail: "pods/{{email}}",
        pods: "pods",
        podEmails: "podemails",
      },
      posts: {
        batchload: "batchload",
      },
    },
  },
};
