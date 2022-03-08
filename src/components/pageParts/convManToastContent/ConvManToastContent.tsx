export type IConvManToastContentProps = {
    message: string;
    customMessage: string;
}
const ConvManToastContent = ({message, customMessage}: IConvManToastContentProps) => {
    let formattedMsg = message
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/\s+/gm, " ")
        .replace(/:/gm, ": ")
        .replace(/=/gm, " = ");

    console.log(formattedMsg)

    let formattedCustomMessage = customMessage
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/\s+/gm, " ")
        .replace(/:/gm, ": ");

    return (<>
        <div className="mb-2 whitespace-pre-wrap">{formattedMsg}</div>
        <div>{formattedCustomMessage}</div>
    </>)
}
export default ConvManToastContent;