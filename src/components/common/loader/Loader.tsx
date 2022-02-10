import { IConvManLoaderProps } from "./interfaces/IConvManLoaderProps";

const Loader: React.FC<IConvManLoaderProps> = (props: IConvManLoaderProps) => {
  const circleCommonClasses = "h-2.5 w-2.5 bg-current rounded-full";

  return (
    <div className={`${props.show ? "w-full h-screen fixed block top-0 left-0 bg-white opacity-75 z-50" : "hidden"}`}>
      <div className="top-1/2 my-0 mx-auto block relative text-center">
        <div className="text-4xl font-mono uppercase">{props.message}</div>
        <div className="flex mt-4 justify-center">
          <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
          <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
          <div className={`${circleCommonClasses} mr-1 animate-bounce400`}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
