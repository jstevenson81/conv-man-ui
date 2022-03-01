import axios from "axios";

import { ServerConfig } from "../ServerConfig";
import { OracleRestServiceBase } from "./base/OracleRestServiceBase";


export default class ConvOpsSvc extends OracleRestServiceBase {
  constructor() {
    super(ServerConfig.ords.entities.convPackage);
  }
  executeBatchPackage = async ({
    batchName, spName, hdlLineName,
  }: {
    batchName: string;
    spName: string;
    hdlLineName: string;
  }): Promise<any> => {
    try {
      const formData = new FormData();
      formData.set("p_batch", batchName);
      formData.set("p_hdl_line_name", hdlLineName);
      formData.set("p_root_obj_name", spName);
      const moveResp = axios.post(ServerConfig.ords.customActions.posts.moveToCnv, formData, {
        headers: {
          "Content-Type": ServerConfig.contentTypes.json,
        },
      });
      const updateDataCnvResp = axios.post(ServerConfig.ords.customActions.posts.updateDateCnv, formData, {
        headers: {
          "Content-Type": ServerConfig.contentTypes.json,
        },
      });
      const validateCnvResp = axios.post(ServerConfig.ords.customActions.posts.validateCnv, formData, {
        headers: {
          "Content-Type": ServerConfig.contentTypes.json,
        },
      });
      const convertToHdlResp = axios.post(ServerConfig.ords.customActions.posts.convertToHdl, formData, {
        headers: {
          "Content-Type": ServerConfig.contentTypes.json,
        },
      });
      const createHdlFileResp = axios.post(ServerConfig.ords.customActions.posts.createHdlFile, formData, {
        headers: {
          "Content-Type": ServerConfig.contentTypes.json,
        },
      });
    } catch (e) { }
  };
}
