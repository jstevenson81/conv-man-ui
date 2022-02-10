import { MouseEventHandler, ReactElement } from "react";

export type IConvManNavLinkProps = {
  icon?: ReactElement;
  link: string;
  text: string;
  click?: MouseEventHandler;
};
