import {HTMLInputTypeAttribute} from "react";

export interface IConvManInputProps {
    label: string;
    type: HTMLInputTypeAttribute;
    name: string;
    value: any;
    placeHolder: string;
    allowSpaces: boolean;

    onInputChange(value: string, name: string): void;
}
