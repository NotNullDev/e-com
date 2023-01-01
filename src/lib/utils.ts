import toast from "react-hot-toast";

export type onClickOutsideReturn = {
  removeListeners: () => void;
};

export function onClickOuSide(
  el: string,
  callback: () => void
): onClickOutsideReturn {
  // SSR
  if (typeof window === undefined) {
    return {
      removeListeners: () => {
        console.log("");
      },
    };
  }
  const found = document.querySelector(el);

  if (!found) {
    toast(`element ${el} not found`);
    return {
      removeListeners: () => {
        console.log("");
      },
    };
  }

  const listener = (e: any) => {
    if (!found.contains(e.target as Node)) {
      callback();
    }
  };

  document.addEventListener("click", listener);

  const removeListeners = () => {
    document.removeEventListener("click", listener);
  };

  return {
    removeListeners,
  };
}

export type focusTrapReturn = {
  removeListeners: () => void;
};

export function focusTrap(
  parentElementClassName: string,
  firstElementClassName: string,
  lastElementClassName: string,
  showConsoleLog = false
): focusTrapReturn {
  if (typeof window === undefined) {
    return {
      removeListeners: () => {
        console;
      },
    };
  }

  const parentElement = document.querySelector(
    "." + parentElementClassName
  ) as HTMLElement;

  if (showConsoleLog) {
    console.log("adding focus trap");
  }

  const eventHandler = (e: KeyboardEvent): void => {
    if (
      (e.target as HTMLElement).classList.contains(lastElementClassName) &&
      e.key === "Tab" &&
      !e.shiftKey
    ) {
      (
        document.querySelector("." + firstElementClassName) as HTMLElement
      )?.focus();
      if (showConsoleLog) {
        console.log("moving focus to the first element");
      }

      e.preventDefault();
    }
    if (
      (e.target as HTMLElement).classList.contains(firstElementClassName) &&
      e.key === "Tab" &&
      e.shiftKey
    ) {
      (
        document.querySelector("." + lastElementClassName) as HTMLElement
      )?.focus();
      if (showConsoleLog) {
        console.log("moving focus to the last element");
      }
      e.preventDefault();
    }
  };
  parentElement.addEventListener("keydown", eventHandler);

  const removeListeners = () => {
    parentElement.removeEventListener("keydown", eventHandler);
  };

  return {
    removeListeners,
  };
}
