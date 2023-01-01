import { useEffect } from "react";
import { focusTrap, onClickOuSide } from "../lib/utils";

let removeModalListener: () => void;

type ShowModalButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ShowModalButton = (props: ShowModalButtonProps) => {
  const { children, onClick } = props;
  return (
    <button
      {...props}
      onClick={(e: any) => {
        if (onClick) {
          onClick(e);
        }
        showModal();
        e.stopPropagation();
      }}
    >
      {children}
    </button>
  );
};

export const CloseModalButton = (props: ShowModalButtonProps) => {
  const { children, onClick } = props;
  return (
    <button
      {...props}
      onClick={(e: any) => {
        if (onClick) {
          onClick(e);
        }
        closeModal();
        e.stopPropagation();
      }}
    >
      {children}
    </button>
  );
};

// stopPropagation must must be prevented while calling this function, else it will close  the modal immediately
export const showModal = () => {
  const parent = document.querySelector(".modal-parent") as HTMLElement;

  if (!parent) {
    throw new Error("parent element not found");
  }

  parent.classList.remove("hidden");

  const { removeListeners } = onClickOuSide(".modal-parent", () => {
    removeListeners();
    parent.classList.add("hidden");
  });

  removeModalListener = removeListeners;
  parent.focus();
};

export const closeModal = () => {
  const parent = document.querySelector(".modal-parent");

  if (!parent) {
    throw new Error("parent element not found");
  }

  if (removeModalListener) {
    removeModalListener();
  }

  parent.classList.add("hidden");
};

const useInitModal = () => {
  useEffect(() => {
    const parent = document.querySelector(".modal-parent") as HTMLElement;

    if (!parent) {
      throw new Error("parent element not found");
    }

    parent.classList.remove("hidden");

    const { removeListeners } = onClickOuSide(".modal-parent", () => {
      removeListeners();
      parent.classList.add("hidden");
    });

    removeModalListener = removeListeners;

    const { removeListeners: removeListeners1 } = focusTrap(
      "modal-parent",
      "modal-first",
      "modal-last"
    );

    parent.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });

    closeModal();

    return () => {
      removeListeners();
      removeListeners1();
    };
  }, []);
};

type AppModalProps = {
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

export const AppModal = ({
  content,
  footer,
  header,
  children,
}: AppModalProps) => {
  useInitModal();
  return (
    <>
      <div
        className="modal-parent absolute top-1/2 left-1/2 z-50 flex hidden h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl  bg-base-300"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 shadow">
          <div className="flex-1">{header}</div>
          <button
            className="modal-first btn-ghost btn-sm btn"
            onClick={() => {
              closeModal();
            }}
          >
            x
          </button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          {children}
          {!children && content}
        </div>
        <div className="p-4 shadow">{footer}</div>
        <button className="modal-last h-[0px] w-[0px]"></button>
      </div>
    </>
  );
};
