import type { ReactNode, ReactPortal } from "react";
import React, { useEffect, useRef, useState } from "react";
import {createPortal} from "react-dom";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

export const openGlobalModal = () => {
  const modal = document.querySelector("#global-modal") as HTMLInputElement;
  modal.checked = true;
  modal.readOnly = true;
};

export type GlobalModalStoreType = {
  body: React.ReactNode;
  modalStatus: boolean;
};

const globalModalStore = create<GlobalModalStoreType>()(
  immer((set, get, store) => {
    return {
      body: null,
      modalStatus: false,
    };
  })
);

type GlobalModalEventEmitterFunction = (newState: boolean) => void;

class GlobalModalEventEmmiter {
  modalOpen = false;
  subscriptions: GlobalModalEventEmitterFunction[] = [];

  subscribe(sub: GlobalModalEventEmitterFunction) {
    const exist = this.subscriptions.find((s) => s === sub);
    if (exist) return;

    this.subscriptions.push(sub);
  }

  unsubscribe(sub: GlobalModalEventEmitterFunction) {
    this.subscriptions = this.subscriptions.filter((s) => s !== sub);
  }

  changeModalStatus(newStatus: boolean) {
    this.modalOpen = newStatus;
    this.subscriptions.forEach((sub) => sub(newStatus));
  }
}

class GlobalModelController {
  emmiter: GlobalModalEventEmmiter;
  modalOpen = false;

  constructor(emitter: GlobalModalEventEmmiter) {
    this.emmiter = emitter;
  }

  open() {
    globalModalStore.setState((state) => {
      state.modalStatus = true;
    });
  }
  close() {
    globalModalStore.setState((state) => {
      state.modalStatus = false;
    });
  }
  toggle() {
    globalModalStore.setState((state) => {
      state.modalStatus = !state.modalStatus;
    });
  }
  setBody(body: ReactNode) {
    globalModalStore.setState((state) => {
      state.body = body;
    });
  }
}

const emitter = new GlobalModalEventEmmiter();
const GlobalModalController = new GlobalModelController(emitter);

const GlobalModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const modalStatus = globalModalStore((state) => state.modalStatus);
  const body = globalModalStore((state) => state.body);

  const listener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      GlobalModalController.close();
    }
  };

  useEffect(() => {
    setOpen(modalStatus ?? false);
    if (modalStatus) {
      document.addEventListener("keydown", listener);
    } else {
      document.removeEventListener("keydown", listener);
    }
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [modalStatus]);

  return (
    <div hidden={!open} ref={modalRef}>
      <div
        className="absolute top-0 left-0 z-[499] h-[100vh] w-[100vw] overflow-hidden bg-base-300 opacity-50"
        onClick={() => {
          GlobalModalController.close();
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2"
        key={"global-portal"}
      >
        <div className="relative">
          {modalStatus === true && (
            <div
              className="absolute top-0 right-0 m-2"
              onClick={() => {
                GlobalModalController.close();
              }}
            >
              <button className="btn-primary btn-square btn-sm btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          {body}
        </div>
      </div>
    </div>
  );
};

const GlobalModalPortal = () => {
  const [portal, setPortal] = useState<ReactPortal | null>(null);

  useEffect(() => {
    setPortal(createPortal(<GlobalModal />, document.body));
  }, []);

  return portal;
};

export { GlobalModalController, GlobalModalPortal };
