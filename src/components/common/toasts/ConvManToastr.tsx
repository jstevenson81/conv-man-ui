import "react-toastify/dist/ReactToastify.css";

import _ from "lodash";
import React, { useEffect } from "react";
import { cssTransition, toast, ToastContainer, ToastOptions, ToastPosition } from "react-toastify";

export type IConvManToastsProps = {
  message: string;
  autoClose: number;
  position: ToastPosition;
  show: boolean;
  type: ConvManToastrType;
};

export type ConvManToastrType = "success" | "info" | "error" | "warning";

const ConvManToastr: React.FC<IConvManToastsProps> = ({ message, autoClose, position, show, type }) => {
  // animate the toastr
  const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut",
  });

  // this shows the message to the user
  useEffect(() => {
    if (show && message && !_.isEmpty(message)) {
      const options: ToastOptions = {
        closeOnClick: true,
        transition: bounce,
        position: position,
        autoClose: autoClose,
        pauseOnHover: true,
        theme: "dark",
      };
      switch (type) {
        case "error":
          toast.error(message, options);
          break;
        case "info":
          toast.info(message, options);
          break;
        case "success":
          toast.success(message, options);
          break;
        case "warning":
          toast.warning(message, options);
          break;
        default:
          toast.info(message, options);
          break;
      }
    }
  }, [show, message, autoClose, bounce, position, type]);

  // this is the markup we want to show the user
  return <ToastContainer transition={bounce}></ToastContainer>;
};

export default ConvManToastr;
