import React, { MouseEventHandler, ReactElement } from "react";
import { Link } from "react-router-dom";

export type NavLinkProps = {
  icon?: ReactElement;
  link: string;
  text: string;
  click?: MouseEventHandler;
};

export type NavLinkState = {};

export default class NavLink extends React.Component<NavLinkProps, NavLinkState> {
  render() {
    return (
      <Link to={this.props.link} onClick={this.props.click}>
        <div className="px-6 py-3 group rounded-full  hover:bg-sky-900 hover:text-white transition duration-300">
          {this.props.icon}
          {this.props.text}
        </div>
      </Link>
    );
  }
}
