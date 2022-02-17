import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import { IOracleItem } from "../../models/data/Interfaces/OracleApi/IOracleItem";
import { IApiResponse } from "../../models/data/Interfaces/Local/IApiResponse";
import { ErrorCodes, ErrorTypes, IOracleApiError } from "../../models/errors/IOracleApiError";
import { HttpHeaderContentType } from "./HttpHeaderContentType";
import { IOracleResponse } from "../../models/data/Interfaces/OracleApi/IOracleResponse";
import { ServerConfig } from "../../../ServerConfig";
import { IConvManSelectListItem } from "../../../components/forms/interfaces/ISelectListItem";
export class OracleRestServiceBase {
  constructor(private entity: string) {
    axios.defaults.baseURL = ServerConfig.ords.url;
  }

  //#region error handling
  /**
   *
   * @param e the error
   * @param code the error code used to tell the UI about the exception
   * @param reqType the type of request that was performed
   * @returns {IOracleApiError} the error the occurred
   */

  protected handleError({ e, code, reqType }: { e: any; code: ErrorCodes; reqType: ErrorTypes }): IOracleApiError {
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

  protected async getMore<T extends IOracleItem>(
    initialResponse: AxiosResponse<IOracleResponse<T>>
  ): Promise<AxiosResponse<IOracleResponse<T>>> {
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
  public convertToSelectList<T extends IOracleItem>({
    data,
    props,
  }: {
    data: Array<T>;
    props: { value: string; option: string };
  }): Array<IConvManSelectListItem> {
    const resp = new Array<IConvManSelectListItem>();
    data.map((d: any) => {
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
  protected async runPost<TInputType extends IOracleItem>(config: {
    body: TInputType;
    contentType: HttpHeaderContentType;
    action?: string;
  }): Promise<IApiResponse<TInputType>> {
    let response: IApiResponse<TInputType> = {};
    try {
      const actionUrl = config.action ? this.entity + config.action : this.entity;
      const axiosResponse = await axios.post<TInputType>(actionUrl, config.body, {
        headers: { "Content-Type": config.contentType },
      });
      response.singleOracleItem = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "POST", reqType: "API_POST_EXCEPTION" });
    }
    return response;
  }

  /**
   * This method runs a put.  A put in the ORDS world updates an existing item
   * @param config this is an object that is made up of the following structure body: this is the body of the request, contentType: this is the content-type we are sending.  In the case of a csv, we would use text/csv
   *
   * @returns {IApiResponse} where the error is filled or the data is
   */
  protected async runPut<TInputType extends IOracleItem>(config: {
    body: TInputType;
    contentType: HttpHeaderContentType;
  }): Promise<IApiResponse<TInputType>> {
    let response: IApiResponse<TInputType> = {};
    try {
      const axiosResponse = await axios.put<TInputType>(this.entity, config.body, {
        headers: { "Content-Type": config.contentType },
      });
      response.singleOracleItem = axiosResponse.data;
    } catch (e) {
      response.error = this.handleError({ e, code: "POST", reqType: "API_POST_EXCEPTION" });
    }
    return response;
  }

  /**
   * This method runs a GET
   * @param path if this is passed, we override the base entity path
   * @returns the type passed in the call (generic)
   */

  protected async runGetMany<T>(): Promise<AxiosResponse<IOracleResponse<T>>> {
    return await axios.get<IOracleResponse<T>>(this.entity, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetManyWithAction<T>(customAction: string): Promise<AxiosResponse<IOracleResponse<T>>> {
    const action: string = `${this.entity}${customAction}`;
    return await axios.get<IOracleResponse<T>>(action, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetManyAbsUrl<T>(url: string): Promise<AxiosResponse<IOracleResponse<T>>> {
    return await axios.get<IOracleResponse<T>>(url, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGetOne<T>(path: string): Promise<AxiosResponse<T>> {
    return await axios.get<T>(this.entity + path, {
      headers: { "Content-Type": "application/json" },
    });
  }
  //#endregion
  //#region standard http methods

  async add<TInputType extends IOracleItem>(body: TInputType): Promise<IApiResponse<TInputType>> {
    return await this.runPost({ body: body, contentType: "application/json" });
  }

  async update<TInputType extends IOracleItem>(body: TInputType): Promise<IApiResponse<TInputType>> {
    return await this.runPut({ body: body, contentType: "application/json" });
  }

  //#endregion
}
