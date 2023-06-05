import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";

function useTextArea(ref: RefObject<HTMLTextAreaElement>, text: string) {
  useEffect(() => {
    if (!ref.current) return;

    const lines = ref.current.value.split("\n").length;

    const lineHeight =
      Number(getComputedStyle(ref.current).lineHeight.replace("px", "")) + 10;

    const height = lineHeight * lines;

    console.log(getComputedStyle(ref.current).lineHeight, lines);

    ref.current.style.height = `${height}px`;
    console.log(height);
  }, [ref, text]);
}

export const ProductDescriptionEditor = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const description = createProductPageStore(
    (state) => state.product.description
  );
  useTextArea(ref, description);

  return (
    <textarea
      placeholder="Product description"
      ref={ref}
      className="textarea-bordered textarea w-full resize-none"
      value={description}
      onChange={(e) => {
        createProductPageStore.setState((store) => {
          store.product.description = e.target?.value ?? "";
        });
      }}
    />
  );
};
