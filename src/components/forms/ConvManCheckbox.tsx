import {Switch} from "@headlessui/react";
import ConvManLabel from "./ConvManLabel";

export type IConvManCheckboxProps = {
    checked: boolean;
    label: string;
    onCheck(newVal: boolean): void;
}


const ConvManCheckbox: React.FC<IConvManCheckboxProps> = (props: IConvManCheckboxProps) => {

    return (
        <div className="flex-none md:flex md:flex-col md:gap-4">
            <ConvManLabel label={props.label}/>
            <div className="flex-1">
                <Switch
                    checked={props.checked}
                    onChange={props.onCheck}
                    className={`${props.checked ? "bg-blue-900" : "bg-gray-400"}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                    <span className="sr-only">{props.label}</span>
                    <span
                        aria-hidden="true"
                        className={`${props.checked ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                    />
                </Switch>
            </div>
        </div>
    );
};

export default ConvManCheckbox;