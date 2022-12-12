import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { NiceButton } from "../../components/NiceButton";
import { cartStore } from "../../lib/stores/cartStore";
import { trpc } from "../../utils/trpc";

export default function ProductDetails() {
  const router = useRouter();

  const { id } = router.query;

  const idASString = id as string;

  const data = trpc.products.byId.useQuery({ id: idASString });

  if (!data.data) {
    return <div></div>;
  }

  return (
    <div className="flex w-full gap-3">
      <div className="rounded-xl bg-base-300">
        {data.status === "success" && (
          <>
            <div className="flex aspect-14 h-[400px] w-[600px] flex-col items-center justify-center">
              <div className="carousel w-full bg-base-100">
                {data.data?.images.map((i, idx) => (
                  <>
                    <div className="carousel-item" key={i}>
                      <Image
                        id={`item${idx + 1}`}
                        src={i ?? ""}
                        alt="hello!"
                        height={600}
                        width={600}
                        className="rounded-t-xl"
                        priority={true} // onLoad={() =>
                        //   toast(`image ${idx} loaded! [TODO image loaders]`)
                        // }
                        placeholder="empty"
                      />
                    </div>
                  </>
                ))}
                {data.data?.images.length === 0 && (
                  <Image
                    src={data.data?.previewImageUrl ?? ""}
                    className="w-[600px]"
                    alt="hello!"
                    height={400}
                    width={200}
                    placeholder="blur"
                  />
                )}
              </div>
            </div>
            <div className="flex w-[600px] flex-wrap justify-center gap-2 rounded-xl bg-base-300 px-5 py-3">
              {data.data?.images.map((i, idx) => {
                return (
                  <>
                    <Link
                      href={`#item${idx + 1}`}
                      className="btn-md btn bg-fuchsia-800"
                      key={idx}
                      replace
                    >
                      {idx + 1}
                    </Link>
                  </>
                );
              })}
            </div>
          </>
        )}
        {data.status === "error" && <div>error...</div>}
      </div>

      <div className="flex flex-1 flex-col rounded-xl bg-base-300 p-4">
        <div className="w-full text-center text-3xl font-bold">
          {data.data?.title}
        </div>

        <div className="mt-3 flex w-full items-end justify-end gap-3">
          {data.data?.categories.map((c) => (
            <div key={c} className="rounded-xl bg-slate-700 p-1 px-3">
              {c}
            </div>
          ))}
        </div>

        <div className="mt-5 flex w-full flex-1 rounded-xl">
          {data.data?.description}
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
    <div className="flex h-min items-center justify-between">
      <NiceButton
        min={1}
        max={15}
        callback={(u) => {
          setAmount(u);
        }}
      />
      <div className="flex gap-3 p-2">
        <button className="btn-ghost btn">buy now</button>
        <button
          className="btn-secondary btn"
          onClick={() => {
            if (item) {
              cartStore.getState().addItem({
                productId: item.id,
                quantity: amount,
              });
            }
          }}
        >
          add to cart
        </button>
      </div>
    </div>
  );
};
