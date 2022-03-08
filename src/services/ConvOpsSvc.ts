import {AxiosResponse} from "axios";

import {IConvOpInput} from "../models/entities/base/IConvOpInput";
import {IConvOpResponse} from "../models/responses/IConvOpResponse";
import {ServerConfig} from "../ServerConfig";
import {OracleRestServiceBase} from "./base/OracleRestServiceBase";
import {BatchRequestSvc} from "./BatchRequestSvc";

export default class ConvOpsSvc extends OracleRestServiceBase {
    constructor() {
        super(ServerConfig.ords.entities.convPackage);
    }

    executeConversionOp = async (config: IConvOpInput, action: string): Promise<AxiosResponse<IConvOpResponse>> => {
        try {
            const response = await this.runPost<IConvOpResponse, IConvOpInput>({
                action: action,
                contentType: "application/json",
                body: {...config},
            });
            console.log(response.data)

            if (response.data["~ret"] && response.data["~ret"] !== "SUCCESS")
                throw new Error(
                    `The action ${action} failed to execute.  This means the conversion attempt was not successful.  Please try to submit your ${action} again.
                     the returned value was: ${response.data["~ret"]}`
                );

            return response;
        } catch (e) {
            throw e;
        }
    };

    executeBatchPackage = async (config: IConvOpInput): Promise<IHasErrors> => {
        await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.moveToCnv);
        await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.updateDateCnv);
        await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.validateCnv);
        // check to see if we got a good validation response
        // if so, check the batch for errors
        // if there are errors, tell the user there are errors
        // force a refresh of the data on the conversion page
        // select the batch we just created and have it show the
        // errors.  Finally, show a toastr telling the user we have errors
        const batchSvc = new BatchRequestSvc();
        const totalErrors = await batchSvc.getErrorCount(config.p_batch);
        if (totalErrors.entities && totalErrors.entities[0].totalerrors > 0) {
            return {hasErrors: true}
        }
        await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.convertToHdl);
        config.p_storage_object_uri = ServerConfig.objectStorage.url;
        await this.executeConversionOp(config, ServerConfig.ords.customActions.posts.createHdlFile);
        return {hasErrors: false};
    };
}

export interface IHasErrors {
    hasErrors: boolean;
}
