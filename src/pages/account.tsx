import type { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { trpc } from "../utils/trpc";

type AccountPageStoreType = {
  products: Product[];
};

const accountPageStore = create<AccountPageStoreType>()(
  immer((set, get, store) => {
    return {
      products: [],
    };
  })
);

const AccountPage = () => {
  const session = useSession();
  const { data, status } = trpc.products.getOwnProducts.useQuery({
    limit: 10,
    offset: 0,
  });

  if (session.status === "unauthenticated" || session.status === "loading") {
    return <div></div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 text-3xl">
      <h1 className="flex ">My products</h1>
      {data?.length === 0 && <NoItem />}
      <div className="flex flex-col gap-2 text-base">
        {data?.map((d) => {
          return <SingleItemPrev key={d.id} product={d} />;
        })}
      </div>
    </div>
  );
};

type SingleItemPrevProps = {
  product: Product;
};

const SingleItemPrev = ({ product }: SingleItemPrevProps) => {
  return (
    <Link
      className="flex w-full rounded-xl border-indigo-600 bg-base-200 p-4"
      href={`/details/${product.id}`}
    >
      <div className="flex-1">{product.title}</div>
      <div className="flex gap-24">
        <div className="w-[150px]">
          {product.views.toString()} times viewed.
        </div>
        <div className="w-[100px]">{product.stock} left in stock</div>
        <div className="w-[100px]">
          {product.boughtCount.toString()} items sold
        </div>
        <button className="btn-ghost btn-square btn-sm btn">
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
        <button className="btn-ghost btn-square btn-sm btn">
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
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </Link>
  );
};

const NoItem = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-min w-full flex-col justify-center gap-2">
        <div className="whitespace-nowrap text-2xl">
          You don&apos;t have any products yet.
        </div>
        <Link className="btn-primary btn" href="/create-product">
          Create one
        </Link>
      </div>
      {false && (
        <>
          <div className="flex items-center justify-center gap-8 bg-base-300 p-6 shadow-xl">
            <div>Product name 1</div>
            <div>
              <span>10</span>
              <span>&lt;3</span>
            </div>
            <div>
              <span>10</span>
              <span>in stock</span>
            </div>
            <div>
              <span>5</span>
              <span>sold</span>
            </div>
            <div>
              <span>54</span>
              <span>zl</span>
            </div>
            <div className="flex flex-col">
              <div>Expire date</div>
              <span>13.12.2022 r</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountPage;
