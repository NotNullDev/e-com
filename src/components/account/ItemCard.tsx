import Link from "next/link";
import { useRouter } from "next/router";
import { accountPageStore } from "../../logic/account/accountPageStore";
import ButtonEdit from "../ButtonEdit";
import ButtonTrash from "../ButtonTrash";
import {Product} from "../../../common/db/schema";

export type SingleItemPrevProps = {
  product: Product;
};

export const SingleItemPrev = ({ product }: SingleItemPrevProps) => {
  const router = useRouter();

  return (
    <div className="border-100-interactive flex w-full items-center shadow shadow-gray-900  ">
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
        <div
          onClick={() => {
            accountPageStore.setState((state) => {
              state.selectedProductToDelete = product;
            });
            (window as any).account_modal_1?.showModal();
          }}
        >
          <ButtonTrash />
        </div>
      </div>
    </div>
  );
};
