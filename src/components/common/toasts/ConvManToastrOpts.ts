import { cssTransition, ToastOptions, ToastPosition } from "react-toastify";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});

const ConvManToastrOpts = ({ autoClose, position }: { autoClose: number; position: ToastPosition }): ToastOptions => {
  const opts: ToastOptions = {
    closeOnClick: true,
    transition: bounce,
    position: position,
    autoClose: autoClose,
    pauseOnHover: true,
    theme: "dark",
  };
  return opts;
};

export { bounce, ConvManToastrOpts };
