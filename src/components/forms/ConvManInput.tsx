import {ChangeEvent} from "react";
import {IConvManInputProps} from "./interfaces/IConvManInputProps";

const ConvManInput: React.FC<IConvManInputProps> = (props: IConvManInputProps) => {
    return (
        <div>
            <label className="mb-1 ml-1/2 uppercase text-sm text-slate-600 font-bold">{props.label}</label>
            <input
                defaultValue={props.value}
                placeholder=" "
                type={props.type}
                onKeyDown={(e) => {
                    if (!props.allowSpaces && e.key === " ") e.preventDefault();
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const val = e.currentTarget.value && !props.allowSpaces
                        ? e.currentTarget.value.replace(/\s/g, "")
                        : e.currentTarget.value;
                    props.onInputChange(val, e.currentTarget.name);
                }}
                className="w-full border-slate-300 border rounded-md p-2"
            />
        </div>
    );
};

export default ConvManInput;
