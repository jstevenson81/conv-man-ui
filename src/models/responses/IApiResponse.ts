import { IEntity } from "../entities/base/IEntity";
import { IConvManError } from "../errors/IConvManError";

export interface IApiResponse<TEntity extends IEntity> {
  entities: Array<TEntity>;
  error: IConvManError;
}
