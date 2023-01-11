import type { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  AppModal,
  CloseModalButton,
  ShowModalButton,
} from "../components/AppModal";
import ButtonEdit from "../components/ButtonEdit";
import ButtonTrash from "../components/ButtonTrash";
import { GlobalModalController } from "../components/GlobalModal";
import { trpc } from "../utils/trpc";
import { createProductPageStore } from "./create-product";

type AccountPageStoreType = {
  products: Product[];
  selectedProductToDelete?: Product;
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
        <Link
          href="/create-product"
          onClick={() => {
            createProductPageStore.setState((state) => {
              state.isUpdating = false;
            });
          }}
        >
          <button className="btn-primary btn">Add product</button>
        </Link>
      </div>
      {data?.length === 0 && <NoItem />}
      <div className="flex flex-col gap-2 text-base">
        {data?.map((d) => {
          return <SingleItemPrev key={d.id} product={d} />;
        })}
      </div>
      <AccountPageModal />
    </div>
  );
};

const AccountPageModal = () => {
  const product = accountPageStore((state) => state.selectedProductToDelete);
  return (
    <AppModal header="Delete item?" footer={<ModalFooter product={product} />}>
      <div className="flex flex-1 flex-col items-center justify-center">
        <span className="text-base">You are about to delete item</span>
        <span className="mb-2 text-xl font-bold">{product?.title}</span>
        <div className="text-base text-red-700">
          Operation cannot be undone.
        </div>
      </div>
    </AppModal>
  );
};

type SingleItemPrevProps = {
  product: Product;
};

type ModalFooterProps = {
  product?: Product;
};

const ModalFooter = ({ product }: ModalFooterProps) => {
  const deleteProductMutation = trpc.products.deleteProduct.useMutation();
  const trpcContext = trpc.useContext();
  return (
    <div className="flex w-full justify-end">
      <CloseModalButton
        className="btn-ghost btn-sm btn"
        onClick={async () => {
          GlobalModalController.close();
          await deleteProductMutation.mutateAsync({
            id: product?.id ?? "",
          });
          await trpcContext.products.getOwnProducts.invalidate();
          toast.success(
            `Item ${product?.title} has been successfully deleted.`
          );
        }}
      >
        delete
      </CloseModalButton>
      <CloseModalButton
        className="btn-primary btn-sm btn"
        onClick={() => {
          // GlobalModalController.close();
          toast.error("Operation cancelled.");
        }}
      >
        Cancel
      </CloseModalButton>
    </div>
  );
};

const SingleItemPrev = ({ product }: SingleItemPrevProps) => {
  const router = useRouter();

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
        <Link
          href={"/create-product?id=" + product.id}
          onClick={async (e) => {
            // createProductPageStore.getState().resetStore();
            // createProductPageStore.setState((state) => {
            //   state.product = product;
            //   state.isUpdating = true;
            // });
            // // TODO: it is not most efficient way to do this xD
            // for (const url of product.images) {
            //   const response = await fetch(url);
            //   const blob = await response.blob();
            //   const file = new File([blob], EXISTING_IMAGE, {
            //     type: blob.type,
            //   });
            //   createProductPageStore.setState((state) => {
            //     state.files.push(file);
            //   });
            // }
            // router.push("/create-product");
            // e.preventDefault();
          }}
        >
          <ButtonEdit />
        </Link>
        <ShowModalButton
          onClick={() => {
            accountPageStore.setState((state) => {
              state.selectedProductToDelete = product;
            });
          }}
        >
          <ButtonTrash />
        </ShowModalButton>
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
