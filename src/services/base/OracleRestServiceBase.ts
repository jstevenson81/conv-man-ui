import axios, { AxiosError, AxiosResponse } from "axios";
import _ from "lodash";
import { IConvManSelectListItem } from "../../components/forms/interfaces/ISelectListItem";
import { IEntity } from "../../models/entities/base/IEntity";
import { ErrorCodes, ErrorTypes, IConvManError } from "../../models/errors/IConvManError";
import { IApiResponse } from "../../models/responses/IApiResponse";
import { IOracleAutoRestResponse } from "../../models/responses/IOracleAutoRestResponse";
import { IOracleModuleResponse } from "../../models/responses/IOracleModuleResponse";
import { ServerConfig } from "../../ServerConfig";
import { ICreateApiConfig } from "./ICreateApiConfig";

export interface IGetApiConfig {
  action: string | null;
  pathOrEntity: string | null;
}

export abstract class OracleRestServiceBase {
  constructor(private entity: string) {
    axios.defaults.baseURL = ServerConfig.ords.url;
  }

  protected handleError<TEntity>({
    e,
    code,
    reqType,
  }: {
    e: any;
    code: ErrorCodes;
    reqType: ErrorTypes;
  }): IApiResponse<TEntity> {
    const response = this.initApiResponse<TEntity>();
    const axiosError = e as AxiosError;
    const errResp = axiosError && axiosError.response ? axiosError.response : null;

    response.error = {
      title: `ORDS request error${errResp ? ": " + errResp.data.title : ""}`,
      message: errResp ? errResp.data.message : e.message,
      stack: axiosError ? axiosError.stack : e.stack,
      name: axiosError ? axiosError.name : e.name,
      type: reqType,
      code: code,
      http: axiosError
        ? { config: axiosError.config, request: axiosError.request, response: axiosError.response }
        : null,
    };
    return response;
  }

  //#endregion

  //#region get more results

  //#endregion

  //#region convert to select list items

  //#endregion

  //#region helper methods

  protected getAction(config: IGetApiConfig): string {
    const path = config.pathOrEntity === null ? this.entity : config.pathOrEntity;
    const action = config.action === null ? "" : `/${config.action}`;

    return path + action;
  }

  protected async constructEntities<TEntity>(initAxiosResp: AxiosResponse): Promise<IApiResponse<TEntity>> {
    const final = await this.getMore<TEntity>(initAxiosResp);
    const apiResponse = this.initApiResponse<TEntity>();
    apiResponse.entities = final.data.items;
    return apiResponse;
  }

  protected async getMore<TEntity>(
    initialResponse: AxiosResponse<IOracleModuleResponse<TEntity>>
  ): Promise<AxiosResponse<IOracleModuleResponse<TEntity>>> {
    while (initialResponse.data.hasMore) {
      const moreLink = _.find(initialResponse.data.links, (link) => {
        return link.rel.toUpperCase() === "NEXT";
      });

      if (moreLink && moreLink.href) {
        const existingItems = initialResponse.data.items;
        initialResponse = await this.runGetAbsUrl<TEntity>(moreLink.href);
        initialResponse.data.items = [...existingItems, ...initialResponse.data.items];
      }
    }
    return initialResponse;
  }

  protected initApiResponse<TEntity>(): IApiResponse<TEntity> {
    return { entities: [], error: { message: "", name: "" } };
  }

  public convertToSelectList<TEntity>({
    data,
    props,
  }: {
    data: Array<TEntity>;
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

  protected runPost = async <TResponseType extends IOracleAutoRestResponse, TEntity extends IEntity>({
    action,
    contentType,
    body,
  }: ICreateApiConfig<TEntity>): Promise<AxiosResponse<TResponseType>> => {
    const actionUrl = action ? this.entity + action : this.entity;

    return await axios.post<TResponseType>(actionUrl, body, {
      headers: { "Content-Type": contentType },
    });
  };

  protected runPut = async <TResponseType extends IOracleAutoRestResponse, TEntity extends IEntity>({
    action,
    contentType,
    body,
  }: ICreateApiConfig<TEntity>): Promise<AxiosResponse<TResponseType>> => {
    const actionUrl = action ? this.entity + action : this.entity;
    return await axios.put<TResponseType>(actionUrl, body, {
      headers: { "Content-Type": contentType },
    });
  };

  //#endregion

  //#region GET

  protected async runGetAbsUrl<TEntity>(url: string): Promise<AxiosResponse<IOracleModuleResponse<TEntity>>> {
    return await axios.get<IOracleModuleResponse<TEntity>>(url, {
      headers: { "Content-Type": "application/json" },
    });
  }

  protected async runGet<TEntity>(config: IGetApiConfig): Promise<AxiosResponse<IOracleModuleResponse<TEntity>>> {
    const action = this.getAction(config);
    return await this.runGetAbsUrl<TEntity>(action);
  }

  //#endregion
}
