import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import {useRouter} from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NiceButton } from "../../components/NiceButton";
import { cartStore } from "../../logic/common/cartStore";
import { Converters } from "../../utils/convertes";
import { trpc } from "../../utils/trpc";
import {Product} from "../../../common/db/schema";

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
    <div className="flex w-full gap-3  max-[1050px]:flex-col">
      <div className="border-100 flex flex-1 items-center justify-center">
        {data.status === "success" && (
          <>
            <div className="carousel w-full bg-base-100" ref={emblaRef}>
              {data?.data?.images && data.data.images.map((i, idx) => (
                <div
                  id={`slide${idx}`}
                  className="carousel-item relative w-full"
                  key={i}
                >
                  <img src={i} className="w-full" alt="hello!"/>
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <Link
                      href={`#slide${
                        idx === 0 && data.data ? data.data.images.length - 1 : idx - 1
                        }`}
                        className="btn-circle btn"
                      >
                        ❮
                      </Link>
                      <Link
                        href={`#slide${
                          data.data && idx === data.data.images.length - 1 ? 0 : idx + 1
                        }`}
                        className="btn-circle btn"
                      >
                        ❯
                      </Link>
                    </div>
                  </div>
                ))}
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
            return true;
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
