import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import { ErrorCodes, ErrorTypes, IConvManError } from "../../models/errors/IOracleApiError";
import { HttpHeaderContentType } from "./HttpHeaderContentType";
import { ServerConfig } from "../../../ServerConfig";
import { IConvManSelectListItem } from "../../../components/forms/interfaces/ISelectListItem";
import { IOracleAutoRestItem } from "../../models/data/interfaces/ords/autoRest/base/IOracleAutoRestItem";
import { IOracleAutoRestResponse } from "../../models/data/interfaces/ords/autoRest/base/IOracleAutoRestResponse";
import { IOracleModuleItem } from "../../models/data/interfaces/ORDS/module/base/IOracleModuleItem";
import { IOracleModuleResponse } from "../../models/data/interfaces/ORDS/module/base/IOracleModuleResponse";

export interface IGetApiConfig {
  action: string | null;
  pathOrEntity: string | null;
}

export interface ICreateApiConfig<T> {
  body: T;
  contentType: HttpHeaderContentType;
  action?: string;
}

export abstract class OracleRestServiceBase {
  constructor(private entity: string) {
    axios.defaults.baseURL = ServerConfig.ords.url;
  }

  //#region error handling
  /**
   *
   * @param e the error
   * @param code the error code used to tell the UI about the exception
   * @param reqType the type of request that was performed
   * @returns {IConvManError} the error the occurred
   */

  protected handleError({ e, code, reqType }: { e: any; code: ErrorCodes; reqType: ErrorTypes }): IConvManError {
    const error = e as Error;
    return {
      title: "ORDS request error",
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: reqType,
      code: code,
    };
  }

  //#endregion

  //#region get more results

  protected async getMore<T extends IOracleModuleItem>(
    initialResponse: AxiosResponse<IOracleModuleResponse<T>>
  ): Promise<AxiosResponse<IOracleModuleResponse<T>>> {
    while (initialResponse.data.hasMore) {
      const moreLink = _.find(initialResponse.data.links, (link) => {
        return link.rel.toUpperCase() === "NEXT";
      });

      if (moreLink && moreLink.href) {
        const existingItems = initialResponse.data.items;
        initialResponse = await this.runGetAbsUrl<T>(moreLink.href);
        initialResponse.data.items = [...existingItems, ...initialResponse.data.items];
      }
    }
    return initialResponse;
  }

  //#endregion

  //#region convert to select list items

  //#endregion

  //#region helper methods

  protected getAction(config: IGetApiConfig): string {
    const path = config.pathOrEntity === null ? this.entity : config.pathOrEntity;
    const action = config.action === null ? "" : `/${config.action}`;

    return path + action;
  }

  public convertToSelectList<T extends IOracleModuleItem>({
    data,
    props,
  }: {
    data: Array<T>;
    props: { value: string; option: string };
  }): Array<IConvManSelectListItem> {
    const resp = new Array<IConvManSelectListItem>();
    data.forEach((d: any) => {
      const valProp = _.find(_.keys(d), (k: string) => {
        return k === props.value;
      });
      const optProp = _.find(_.keys(d), (k: string) => {
        return k === props.option;
      });
      if (valProp && optProp) resp.push({ label: d[optProp], value: d[valProp] });
      else if (valProp) resp.push({ label: d[valProp], value: d[valProp] });
      else if (optProp) resp.push({ label: d[optProp], value: d[optProp] });
    });
    return resp;
  }
  //#endregion

  //#region PUT, POST, DELETE

  /**
   *
   * @param config this is an object that is made up of the following structure body: this is the body of the request, contentType: this is the content-type we are sending.  In the case of a csv, we would use text/csv
   *
   * @returns {IApiResponse} where the error is filled or the data is
   */
  protected runPost = async <TInputType extends IOracleAutoRestItem>({
    action,
    contentType,
    body,
  }: ICreateApiConfig<TInputType>): Promise<AxiosResponse<IOracleAutoRestResponse<TInputType>>> => {
    const actionUrl = action ? this.entity + action : this.entity;
    return await axios.post<IOracleAutoRestResponse<TInputType>>(actionUrl, body, {
      headers: { "Content-Type": contentType },
    });
  };

  /**
   * This method runs a put.  A put in the ORDS world updates an existing item
   * @param config this is an object that is made up of the following structure body: this is the body of the request, contentType: this is the content-type we are sending.  In the case of a csv, we would use text/csv
   *
   * @returns {IApiResponse} where the error is filled or the data is
   */
  protected runPut = async <TInputType extends IOracleAutoRestItem>({
    action,
    contentType,
    body,
  }: ICreateApiConfig<TInputType>): Promise<AxiosResponse<IOracleAutoRestResponse<TInputType>>> => {
    const actionUrl = action ? this.entity + action : this.entity;
    return await axios.put<IOracleAutoRestResponse<TInputType>>(actionUrl, body, {
      headers: { "Content-Type": contentType },
    });
  };

  //#endregion

  //#region GET

  /**
   * This method GETs from an absolute URL
   * @param url the url we are trying to get from.  Can be a path from the base url
   * @returns {AxiosResponse{IOracleModuleResponse{}}} - an axios reponse that contains the oracle module (/api) response
   */
  protected async runGetAbsUrl<TModuleItem>(url: string): Promise<AxiosResponse<IOracleModuleResponse<TModuleItem>>> {
    return await axios.get<IOracleModuleResponse<TModuleItem>>(url, {
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * This method runs a GET
   * @param path if this is passed, we override the base entity path
   * @returns the type passed in the call (generic)
   */
  protected async runGet<TModuleItem extends IOracleModuleItem>(
    config: IGetApiConfig
  ): Promise<AxiosResponse<IOracleModuleResponse<TModuleItem>>> {
    const action = this.getAction(config);
    return await this.runGetAbsUrl(action);
  }

  //#endregion
}
