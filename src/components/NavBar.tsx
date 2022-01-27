import React from "react";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";

import BlueLogo from "../img/np-logo-blue.png";

import { NavLink } from ".";

interface NavBarState {
  menuVisible: boolean;
}
interface NavBarProps {}

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props: any) {
    super(props);
    this.state = { menuVisible: false };
  }
  render() {
    return (
      <nav>
        <div className="shadow-md p-4 flex items-center justify-between">
          <div className="mr-2">
            <img src={BlueLogo} alt="Northpoint Logo" className="w-1/2 min-h-[38px] min-w-[250px]" />
          </div>
          <div className="flex items-center place-content-end w-1/2 whitespace-nowrap ">
            <Link to="/" className="hidden md:block">
              <div className="font-semibold text-gray-400 hover:text-gray-700 text-lg uppercase mr-8 ">
                Conversion Manager
              </div>
            </Link>
            <button
              className="text-black w-10 h-10 relative focus:outline-none bg-white"
              onClick={() => {
                this.setState((prevState) => ({ menuVisible: !prevState.menuVisible }));
              }}
            >
              <span className="sr-only">Open main menu</span>
              <div className="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
                <span
                  aria-hidden="true"
                  className={
                    this.state.menuVisible
                      ? "block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out rotate-45"
                      : "block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out -translate-y-1.5"
                  }
                ></span>
                <span
                  aria-hidden="true"
                  className={
                    this.state.menuVisible
                      ? "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out opacity-0"
                      : "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
                  }
                ></span>
                <span
                  aria-hidden="true"
                  className={
                    this.state.menuVisible
                      ? "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out -rotate-45"
                      : "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out translate-y-1.5"
                  }
                ></span>
              </div>
            </button>
          </div>
        </div>
        <Transition
          className="absolute top-0 left-0 w-2/3 md:w-1/3 h-screen bg-sky-700 shadow-lg border-r-2 border-sky-900
          flex flex-col space-y-10 items-center text-xl text-white uppercase pt-36"
          show={this.state.menuVisible}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Link to="/">
            <div className="font-semibold text-gray-400 hover:text-gray-700 text-lg uppercase">Conversion Manager</div>
          </Link>
          <NavLink
            text="Dashboard"
            link="/dashboard"
            click={() => {
              this.setState((prevState) => ({ menuVisible: !prevState.menuVisible }));
            }}
          ></NavLink>
          <NavLink
            text="Login"
            link="/login"
            click={() => {
              this.setState((prevState) => ({ menuVisible: !prevState.menuVisible }));
            }}
          ></NavLink>
        </Transition>
      </nav>
    );
  }
}
