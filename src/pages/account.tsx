import type { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import ButtonEdit from "../components/ButtonEdit";
import ButtonTrash from "../components/ButtonTrash";
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
      <div className="flex w-full justify-between">
        <h1 className="flex ">My products</h1>
        <label htmlFor="global-modal" className="btn">
          open modal
        </label>
        <Link href="/create-product">
          <button className="btn-primary btn">Add product</button>
        </Link>
      </div>
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
    <div className="flex w-full items-center rounded-xl border-indigo-600 shadow shadow-gray-900 hover:bg-primary-focus">
      <Link className="flex w-full p-4" href={`/details/${product.id}`}>
        <div className="flex-1">{product.title}</div>
        <div className="flex items-center gap-24">
          <div className="w-[150px]">
            {product.views.toString()} times viewed.
          </div>
          <div className="w-[100px]">{product.stock} left in stock</div>
          <div className="w-[100px]">
            {product.boughtCount.toString()} items sold
          </div>
        </div>
      </Link>
      <div className="ml-6 flex gap-4 p-4">
        <Link href="/create-product">
          <ButtonEdit />
        </Link>
        <ButtonTrash
          onClick={(e) => {
            toast("hello!");
            e.preventDefault();
          }}
        />
      </div>
    </div>
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
