import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import { ErrorCodes, ErrorTypes, IConvManError } from "../../models/errors/IOracleApiError";
import { HttpHeaderContentType } from "./HttpHeaderContentType";
import { ServerConfig } from "../../../ServerConfig";
import { IConvManSelectListItem } from "../../../components/forms/interfaces/ISelectListItem";
import { IOracleModuleItem } from "../../models/data/interfaces/ords/module/base/IOracleModuleItem";
import { IOracleAutoRestItem } from "../../models/data/interfaces/ords/autoRest/base/IOracleAutoRestItem";
import { IOracleModuleResponse } from "../../models/data/interfaces/ords/module/base/IOracleModuleResponse";
import { IOracleAutoRestResponse } from "../../models/data/interfaces/ords/autoRest/base/IOracleAutoRestResponse";

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
        initialResponse = await this.runGetManyAbsUrl<T>(moreLink.href);
        initialResponse.data.items = [...existingItems, ...initialResponse.data.items];
      }
    }
    return initialResponse;
  }

  //#endregion

  //#region convert to select list items
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

  //#region generic http methods

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

  /**
   * This method runs a GET
   * @param path if this is passed, we override the base entity path
   * @returns the type passed in the call (generic)
   */

  protected async runGetMany<T extends IOracleModuleItem>(): Promise<AxiosResponse<IOracleModuleResponse<T>>> {
    return await axios.get<IOracleModuleResponse<T>>(this.entity, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetManyWithAction<T>(customAction: string): Promise<AxiosResponse<IOracleModuleResponse<T>>> {
    const action: string = `${this.entity}${customAction}`;
    return await axios.get<IOracleModuleResponse<T>>(action, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetManyWithEntityAction<T>(
    customAction: string
  ): Promise<AxiosResponse<IOracleModuleResponse<T>>> {
    const action: string = `${this.entity}${customAction}`;
    return await axios.get<IOracleModuleResponse<T>>(action, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetManyAbsUrl<T>(url: string): Promise<AxiosResponse<IOracleModuleResponse<T>>> {
    return await axios.get<IOracleModuleResponse<T>>(url, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetOne<T>(path: string): Promise<AxiosResponse<IOracleModuleResponse<T>>> {
    return await axios.get<IOracleModuleResponse<T>>(this.entity + path, {
      headers: { "Content-Type": "application/json" },
    });
  }
  //#endregion
}
