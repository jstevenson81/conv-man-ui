import { IOracleMoreLinks } from "../entities/base/IOracleMoreLinks";


export interface IOracleModuleResponse<TEntity> extends IOracleMoreLinks {
  items: Array<TEntity>;
}

