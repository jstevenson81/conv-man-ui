import {Dialog, Transition} from "@headlessui/react";
import {XIcon} from "@heroicons/react/solid";
import {DateTime} from "luxon";
import {Fragment, useCallback, useEffect, useState} from "react";

import {IUniqueWorksheet} from "../../../models/entities/api/IUniqueWorksheet";
import {IUxPod} from "../../../models/entities/base/IUxPod";
import {IApiResponse} from "../../../models/responses/IApiResponse";
import {ICreateBatchResponse} from "../../../models/responses/ICreateBatchResponse";
import {ServerConfig} from "../../../ServerConfig";
import ConvOpsSvc from "../../../services/ConvOpsSvc";
import PodSvc from "../../../services/PodSvc";
import {SpreadsheetsSvc} from "../../../services/SpreadsheetSvc";
import ConvManFileDropZone from "../../forms/ConvManDropZone";
import ConvManInput from "../../forms/ConvManInput";
import ConvManSelectList from "../../forms/ConvManSelectList";
import {IConvManFile} from "../../forms/interfaces/IConvManFileInputState";
import {IConvManSelectListItem} from "../../forms/interfaces/ISelectListItem";

type ICreateBatchProps = {
    isOpen: boolean;
    toggle(open: boolean): void;
    onLoading({loading, message}: { loading: boolean; message: string }): void;
    onBatchComplete(createResp: ICreateBatchResponse): void;
    refreshData: boolean;
};

const ConvManCreateBatchForm: React.FC<ICreateBatchProps> = ({
                                                                 isOpen,
                                                                 toggle,
                                                                 onLoading,
                                                                 onBatchComplete,
                                                                 refreshData,
                                                             }) => {
    //#region state
    const [batchName, setBatchName] = useState("");
    const [selectedPod, setSelectedPod] = useState<IConvManSelectListItem>({label: "", value: ""});
    const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<IConvManFile>({
        data: new ArrayBuffer(0),
        fileExt: "",
        fileName: "",
        lastModified: "",
    });
    const [selectedWorksheet, setSelectedWorsheet] = useState<IConvManSelectListItem>({label: "", value: ""});

    const [worksheetOpts, setWorksheetOpts] = useState<Array<IConvManSelectListItem>>([]);
    const [podOpts, setPodOpts] = useState<Array<IConvManSelectListItem>>([]);

    //#endregion

    //#region services
    //#endregion

    //#region data gathering

    useEffect(() => {
        const spSvc = new SpreadsheetsSvc();
        const podSvc = new PodSvc();

        spSvc.getWorksheets().then((resp: IApiResponse<IUniqueWorksheet>) => {
            if (resp && resp.entities) {
                const options = spSvc.convertToSelectList({
                    data: resp.entities,
                    props: {
                        value: "root_obj_name",
                        option: "spreadsheet_name",
                        lookup: "spreadsheet_name",
                    },
                });
                const displayOptions: IConvManSelectListItem[] = options.map((o) => {
                    return {value: o.value, label: `${o.label} (${o.value})`, lookup: o.lookup};
                });
                setWorksheetOpts(displayOptions);
            }
        });

        podSvc.getAllPods().then((resp: IApiResponse<IUxPod>) => {
            let options: Array<IConvManSelectListItem> = [];
            if (resp && resp.entities) {
                options = podSvc.convertToSelectList({
                    data: resp.entities,
                    props: {value: "pod_url", option: "pod_name", lookup: "pod_name"},
                });
            }
            setPodOpts(options);
        });

        setBatchName(DateTime.now().valueOf().toString());
    }, [refreshData]);

    //#endregion

    //#region batch creation

    const createBatch = async (): Promise<void> => {
        onLoading({loading: true, message: "Creating your conversion request"});
        const svc = new SpreadsheetsSvc();
        const batchResp = await svc.createBatch({
            workbook: selectedSpreadsheet,
            batchName: batchName,
            createdBy: "CONV_MAN_SYS",
            podUrl: selectedPod!.value,
            sheetToRead: selectedWorksheet.lookup!,
        });
        if (!batchResp.spCreateResp.isError) {
            onLoading({loading: true, message: "Processing your conversion"});
            const convOpsSvc = new ConvOpsSvc();
            try {
                batchResp.convOpsResp = await convOpsSvc.executeBatchPackage({
                    p_batch: batchName,
                    p_root_obj_name: selectedWorksheet.value,
                    p_hdl_line_name: "",
                });
            } catch (e) {
                batchResp.convOpsError = e as Error;
            }
        }
        onBatchComplete(batchResp);
    };

    //#endregion

    const spreadsheetChange = useCallback((newFile: IConvManFile): void => {
        setSelectedSpreadsheet(newFile);
    }, []);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10" onClose={() => toggle(false)}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-60"/>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className="inline-block w-full max-w-xl p-6 my-8 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title as="div" className="flex items-center justify-between justify-items-center">
                                <h3 className="text-lg font-medium leading-6">new conversion request</h3>
                                <div className="hover:text-gray-800 hover:scale-125 transition duration-300">
                                    <XIcon className="w-5 h-5 hover:cursor-pointer"
                                           onClick={() => toggle(false)}></XIcon>
                                </div>
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Use the form below to create a new conversion
                                    request</p>
                            </div>
                            <div className="my-8 flex flex-col gap-4">
                                <ConvManInput
                                    type="text"
                                    label="Batch Name"
                                    placeHolder=" "
                                    name="BatchName"
                                    value={batchName}
                                    onInputChange={(newValue: string) => {
                                        setBatchName(newValue);
                                    }}
                                ></ConvManInput>
                                <ConvManSelectList
                                    label="Environment"
                                    smallLabel="select a pod"
                                    items={podOpts}
                                    selectedItem={selectedPod}
                                    onListboxChange={(newValue: IConvManSelectListItem) => {
                                        setSelectedPod(newValue);
                                    }}
                                ></ConvManSelectList>

                                <ConvManSelectList
                                    label="Worksheet"
                                    smallLabel="select a worksheet name"
                                    items={worksheetOpts}
                                    selectedItem={selectedWorksheet}
                                    onListboxChange={(newWorksheet: IConvManSelectListItem) => {
                                        setSelectedWorsheet(newWorksheet);
                                    }}
                                ></ConvManSelectList>

                                <ConvManFileDropZone
                                    label="Drop xlsx files here or click to browse"
                                    fileFilter={ServerConfig.contentTypes.excel}
                                    onFileChange={spreadsheetChange}
                                ></ConvManFileDropZone>
                            </div>

                            <div className="mt-4 flex justify-end items-center gap-4 justify-items-center">
                                <button type="button" className="button red" onClick={() => toggle(false)}>
                                    Close
                                </button>
                                <button type="button" className="button blue" onClick={() => createBatch()}>
                                    Create Request
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConvManCreateBatchForm;
