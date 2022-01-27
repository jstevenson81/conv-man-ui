import { IConversion, IValidationError } from "../components/interfaces/IConversion";
import { ISelectListItem } from "../components/interfaces/ISelectListItem";

const samplePods: ISelectListItem[] = [
  { option: "Select a POD", value: "" },
  { option: "DEV-1", value: "https://enpu-dev1.fa.us2.oraclecloud.com" },
  { option: "DEV-2", value: "https://enpu-dev2.fa.us2.oraclecloud.com" },
  { option: "TEST", value: "https://enpu-test.fa.us2.oraclecloud.com" },
  { option: "PROD", value: "https://enpu.fa.us2.oraclecloud.com" },
];
const sampleTemplates: ISelectListItem[] = [
  { option: "Select a Template for Download", value: "" },
  { option: "Simplified Employee Import", value: "emp.csv" },
  { option: "Jobs Import", value: "jobs.csv" },
  { option: "Locations Import", value: "locations.csv" },
];
const sampleConversionTypes: ISelectListItem[] = [
  { option: "Select a Conversion Type", value: "" },
  { option: "EMPLOYEES", value: "EMPLOYEES" },
  { option: "JOBS", value: "JOBS" },
  { option: "LOCATIONS", value: "LOCATIONS" },
];
const sampleErrors: IValidationError[] = [
  {
    fileName: "EMPS_20220120.csv",
    errorType: "DateValidation",
    message: "The date entered must be in the format YYYY-MM-DD",
    row: 1,
    column: "EffectiveStartDate",
  },
  {
    fileName: "EMPS_20220120.csv",
    errorType: "NumberValidation",
    message: "This field must be numeric",
    row: 10,
    column: "FTE",
  },
  {
    fileName: "EMPS_20220120.csv",
    errorType: "EmailValidation",
    message: "The email must be a valid email address test@test.com",
    row: 5,
    column: "PersonEmailAddress",
  },
  {
    fileName: "EMPS_20220120.csv",
    errorType: "RequiredValidation",
    message: "The person number is required",
    row: 7,
    column: "PersonNumber",
  },
  {
    fileName: "EMPS_20220120.csv",
    errorType: "DateValidation",
    message: "The date entered must be in the format YYYY-MM-DD",
    row: 1,
    column: "EffectiveStartDate",
  },
  {
    fileName: "EMPS_20220120.csv",
    errorType: "DateValidation",
    message: "The date entered must be in the format YYYY-MM-DD",
    row: 1,
    column: "EffectiveStartDate",
  },
];
const sampleConversions: IConversion[] = [
  {
    convType: "EMP",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-10T14:40Z",
  },
  {
    convType: "EMP",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-09T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
  {
    convType: "JOBS",
    pod: {
      name: "DEV",
      url: "https://enpu-dev1.fa.us2.oraclecloud.com",
    },
    fileName: "test.csv",
    dateTime: "2022-1-08T14:40Z",
  },
];

export { samplePods, sampleTemplates, sampleConversionTypes, sampleErrors, sampleConversions };
