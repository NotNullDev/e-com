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
        showModal();
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
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
        closeModal();
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

// stopPropagation must must be prevented while calling this function, else it will close  the modal immediately
export const showModal = () => {
  const parent = document.querySelector("#modal-parent") as HTMLElement;

  if (!parent) {
    throw new Error("parent element not found");
  }

  parent.classList.remove("hidden");

  const { removeListeners } = onClickOuSide("#modal-parent", () => {
    removeListeners();
    parent.classList.add("hidden");
  });

  removeModalListener = removeListeners;
  parent.focus();
};

export const closeModal = () => {
  const parent = document.querySelector("#modal-parent");

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
    const parent = document.querySelector("#modal-parent") as HTMLElement;

    if (!parent) {
      throw new Error("parent element not found");
    }

    parent.classList.remove("hidden");

    const { removeListeners } = onClickOuSide("#modal-parent", () => {
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

    return () => {
      removeListeners();
      removeListeners1();
    };
  }, []);
};

type AppModalProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
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
        className="absolute top-1/2 left-1/2 flex h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-base-300"
        id="modal-parent"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 shadow">
          <div className="flex-1">{header}</div>
          <button
            className="btn-ghost btn-sm btn"
            onClick={() => {
              closeModal();
            }}
            id="modal-first"
          >
            x
          </button>
        </div>
        <div className="flex-1 p-4">
          {children}
          {!children && content}
        </div>
        <button id="modal-last" className="h-[0px] w-[0px]"></button>
        <div className="p-4 shadow">{footer}</div>
      </div>
    </>
  );
};
