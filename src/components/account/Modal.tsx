import toast from "react-hot-toast";
import { accountPageStore } from "../../logic/account/accountPageStore";
import { trpc } from "../../utils/trpc";
import { GlobalModalController } from "../GlobalModal";
import {Product} from "../../../common/db/schema";

type ModalFooterProps = {
  product?: Product;
};

const ModalFooter = ({ product }: ModalFooterProps) => {
  const deleteProductMutation = trpc.products.deleteProduct.useMutation();
  const trpcContext = trpc.useContext();
  return (
    <div className="flex w-full justify-end">
      <button
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
      </button>
      <button
        className="btn-primary btn-sm btn"
        onClick={() => {
          // GlobalModalController.close();
          toast.error("Operation cancelled.");
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export const AccountPageModal = () => {
  const product = accountPageStore((state) => state.selectedProductToDelete);
  const deleteProductMutation = trpc.products.deleteProduct.useMutation();
  const trpcContext = trpc.useContext();

  return (
    <dialog id="account_modal_1" className="modal text-base-content">
      <form method="dialog" className="modal-box">
        <div className="flex flex-1 flex-col">
          <span className="">You are about to delete item</span>
          <span className="mb-2 text-xl font-bold">{product?.title}</span>
          <div className=" text-red-700">Operation cannot be undone.</div>
        </div>
        <div className="modal-action">
          <button
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
          </button>
          <button
            className="btn-primary btn-sm btn"
            onClick={() => {
              // GlobalModalController.close();
              toast.error("Operation cancelled.");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};
