import type { Product } from "@prisma/client";
import toast from "react-hot-toast";
import { accountPageStore } from "../../logic/account/accountPageStore";
import { trpc } from "../../utils/trpc";
import { AppModal, CloseModalButton } from "../AppModal";
import { GlobalModalController } from "../GlobalModal";

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

export const AccountPageModal = () => {
  const product = accountPageStore((state) => state.selectedProductToDelete);
  return (
    <AppModal header="Delete item?" footer={<ModalFooter product={product} />}>
      <div className="flex flex-1 flex-col">
        <span className="text-base">You are about to delete item</span>
        <span className="mb-2 text-xl font-bold">{product?.title}</span>
        <div className="text-base text-red-700">
          Operation cannot be undone.
        </div>
      </div>
    </AppModal>
  );
};
