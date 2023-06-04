/* eslint-disable @next/next/no-img-element */
import { clsx } from "@mantine/core";
import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { NiceButton } from "../../components/NiceButton";
import { cartStore } from "../../logic/common/cartStore";
import { Converters } from "../../utils/convertes";
import { trpc } from "../../utils/trpc";

export default function ProductDetails() {
  const router = useRouter();

  const { id } = router.query;

  const idASString = id as string;

  const data = trpc.products.byId.useQuery(
    { id: idASString },
    { enabled: !!idASString }
  );

  if (!data.data) {
    return <div></div>;
  }

  return (
    <div className="flex w-full gap-3 max-[1050px]:flex-col">
      <div className="rounded-xl bg-base-300">
        {data.status === "success" && (
          <>
            <div className="carousel max-h-[400px] w-full bg-base-100">
              {data.data?.images.map((i, idx) => (
                <div className="carousel-item" key={idx}>
                  <img
                    id={`item${idx + 1}`}
                    src={i ?? ""}
                    alt="hello!"
                    className="rounded-t-xl object-cover"
                    placeholder="empty"
                  />
                </div>
              ))}
              {data.data?.images.length === 0 && (
                <Image
                  src={data.data?.previewImageUrl ?? ""}
                  className="w-[600px]"
                  alt="hello!"
                  height={400}
                  width={200}
                />
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-base-300 px-5 py-3">
              {data.data?.images.map((i, idx) => {
                return (
                  <Link
                    href={`#item${idx + 1}`}
                    className="btn-md btn bg-fuchsia-800"
                    key={idx}
                    replace
                  >
                    {idx + 1}
                  </Link>
                );
              })}
            </div>
          </>
        )}
        {data.status === "error" && <div>error...</div>}
      </div>

      <div
        className={clsx(
          "flex min-w-[500px] flex-1 flex-col rounded-xl bg-base-300 p-4",
          "min-h-[300px] max-[1050px]:max-w-full"
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

        <div
          className="mt-5 flex w-full flex-1 rounded-xl"
          dangerouslySetInnerHTML={{ __html: data.data?.description ?? "" }}
        ></div>
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
    <div className="flex h-min items-center gap-3 max-[1050px]:justify-end">
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
