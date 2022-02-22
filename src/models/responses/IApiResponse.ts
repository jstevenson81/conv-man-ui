import { IEntity } from "../entities/IEntity";
import { IConvManError } from "../errors/IConvManError";

export interface IApiResponse<TEntity extends IEntity> {
  entities: Array<TEntity>;
  error: IConvManError;
}
