import { useAtom } from "jotai";
import { useState } from "react";
import type { FullCartItem } from "../../logic/common/cartStore";
import { CartAtoms } from "../../logic/common/cartStore";
import { NiceButton } from "../NiceButton";

export type ProductProps = {
  productInfo: FullCartItem;
};

export const Product = ({ productInfo }: ProductProps) => {
  const [q, setQ] = useState(productInfo.quantity);
  const [, setItems] = useAtom(CartAtoms.query.cartItemsAtom);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  return (
    <div className="flex w-full items-center justify-between rounded-xl p-3 px-6 text-xl">
      <h2 className="">{productInfo.title}</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <NiceButton
            min={1}
            max={3}
            initial={q}
            callback={(u) => {
              if (u === 1 && q === 1) {
                setDeletePopupOpen(true);
                return;
              }
              setDeletePopupOpen(false);
              setQ(u);
              // TODO !
              setItems((old) => {
                const p = old.find(
                  (i) => i.productId === productInfo.productId
                );
                if (p) {
                  p.quantity = u;
                }

                return [...old];
              });
            }}
          />
          {deletePopupOpen && (
            <div
              className="absolute bottom-0 left-0 flex -translate-x-28 translate-y-16 flex-col gap-2 rounded-xl bg-base-100 p-3 text-sm shadow-xl"
              key={productInfo.id}
            >
              <div>Delete item?</div>
              <div className="flex justify-end">
                <button
                  className="btn-error btn-sm btn"
                  onClick={() => {
                    setDeletePopupOpen(false);
                    setQ(0);
                    setItems((state) => {
                      const p = state.find(
                        (i) => i.productId === productInfo.productId
                      );
                      if (p) {
                        state = state.filter(
                          (i) => i.productId !== productInfo.productId
                        );
                      }
                      return state;
                    });
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn-ghost btn-sm btn"
                  onClick={() => {
                    setDeletePopupOpen(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-[100px] text-right">{productInfo.price * q}</div>
      </div>
    </div>
  );
};
