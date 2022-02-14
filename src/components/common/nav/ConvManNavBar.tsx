import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";

import BlueLogo from "../../../img/np-logo-blue.png";
import ConvManNavLink from "./ConvManNavLink";
import IConvManNavBarProps from "./interfaces/IConvManNavBarProps";

const ConvManNavBar: React.FC<IConvManNavBarProps> = (props: IConvManNavBarProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

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
              setMenuVisible(!menuVisible);
            }}
          >
            <span className="sr-only">Open main menu</span>
            <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={
                  menuVisible
                    ? "block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out rotate-45"
                    : "block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out -translate-y-1.5"
                }
              ></span>
              <span
                aria-hidden="true"
                className={
                  menuVisible
                    ? "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out opacity-0"
                    : "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
                }
              ></span>
              <span
                aria-hidden="true"
                className={
                  menuVisible
                    ? "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out -rotate-45"
                    : "block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out translate-y-1.5"
                }
              ></span>
            </div>
          </button>
        </div>
      </div>
      <Transition
        className="absolute z-[999999999] top-0 left-0 w-2/3 md:w-1/3 h-screen bg-sky-700 shadow-lg border-r-2 border-sky-900
          flex flex-col space-y-10 items-center text-xl text-white uppercase pt-36"
        show={menuVisible}
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
        <ConvManNavLink
          text="Conversions"
          link="/conversions"
          click={() => {
            setMenuVisible(!menuVisible);
          }}
        ></ConvManNavLink>
        <ConvManNavLink
          text="Login"
          link="/login"
          click={() => {
            setMenuVisible(!menuVisible);
          }}
        ></ConvManNavLink>
      </Transition>
    </nav>
  );
};

export default ConvManNavBar;
