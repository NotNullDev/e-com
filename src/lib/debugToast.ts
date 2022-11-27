import type {
  Renderable,
  Toast,
  ToastOptions,
  ValueOrFunction,
} from "react-hot-toast";
import toast from "react-hot-toast";

// for debugging purpose, to make easy to cleanup later the code
export const debugToast = (
  message: ValueOrFunction<Renderable, Toast>,
  opts?: ToastOptions
) => toast(message, opts);
