/* eslint-disable @next/next/no-img-element */
import type { Product } from "@prisma/client";
import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NiceButton } from "../../components/NiceButton";
import { cartStore } from "../../logic/common/cartStore";
import { Converters } from "../../utils/convertes";
import { trpc } from "../../utils/trpc";

export default function ProductDetails() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const { id } = router.query;

  const idASString = id as string;

  const data = trpc.products.byId.useQuery(
    { id: idASString },
    { enabled: !!idASString }
  );

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  if (!data.data) {
    return <div></div>;
  }

  return (
    <div className="flex w-full gap-3 max-[1050px]:flex-col">
      <div className="border-100 flex-1">
        {data.status === "success" && (
          <>
            <div className="embla max-h-[400px] w-full bg-base-100">
              <div className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                  <div className="embla__container">
                    {data.data?.images.map((i, idx) => (
                      <div className="embla__slide" key={i}>
                        <div className="embla__slide__number">
                          <span>{idx + 1}</span>
                        </div>
                        <img
                          src={i}
                          className="embla__slide__img w-[600px]"
                          alt="hello!"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {data.status === "error" && <div>error...</div>}
      </div>

      <div
        className={clsx(
          "border-100 flex min-w-[550px] max-w-[550px] flex-1 flex-col rounded-xl p-8",
          "min-h-[300px] max-[1050px]:max-w-full",
          "gap-3 overflow-y-auto"
        )}
      >
        <div className="w-full text-center text-3xl font-bold">
          {data.data?.title}
        </div>

        <div className="mt-3 flex w-full items-end justify-end gap-3">
          {data.data?.categories.map((c, idx) => (
            <div key={idx} className="rounded-xl bg-slate-700 p-1 px-3">
              {Converters.categoryToString(c)}
            </div>
          ))}
        </div>

        <div className="flex max-h-[200px] w-full flex-1 flex-col overflow-y-auto rounded-xl p-6">
          {data.data?.description.split("\n").map((l, idx) => {
            return <p key={idx}>{l}</p>;
          })}
        </div>
        <CartFooter item={data.data} />
      </div>
    </div>
  );
}
type CartFooterProps = {
  item: Product;
};
const CartFooter = ({ item }: CartFooterProps) => {
  const [amount, setAmount] = useState(1);
  return (
    <div className="flex h-min items-center justify-center gap-3 max-[1050px]:justify-end">
      <div className="flex items-center gap-2">
        <NiceButton
          min={1}
          max={15}
          callback={(u) => {
            setAmount(u);
          }}
        />
        <div className="mr-2 whitespace-nowrap text-xl font-bold">
          {item.price * amount} PLN
        </div>
      </div>
      <button
        className="btn-secondary btn ml-10"
        onClick={() => {
          if (item) {
            cartStore.getState().addItem({
              productId: item.id,
              quantity: amount,
            });
            toast.success("Product has been added to the cart.");
          }
        }}
      >
        add to cart
      </button>
    </div>
  );
};
