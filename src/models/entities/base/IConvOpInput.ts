import {IEntity} from "./IEntity";

export interface IConvOpInput extends IEntity {
    p_batch: string;
    p_hdl_line_name: string;
    p_root_obj_name: string;
    p_storage_object_uri?: string
}
