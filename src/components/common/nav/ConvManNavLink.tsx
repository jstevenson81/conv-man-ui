import React from "react";
import { Link } from "react-router-dom";
import { IConvManNavLinkProps } from "./interfaces/IConvManNavLinkProps";

const ConvManNavLink: React.FC<IConvManNavLinkProps> = (props: IConvManNavLinkProps) => {
  return (
    <Link to={props.link} onClick={props.click}>
      <div className="px-6 py-3 group rounded-full  hover:bg-sky-900 hover:text-white transition duration-300">
        {props.icon}
        {props.text}
      </div>
    </Link>
  );
};

export default ConvManNavLink;
