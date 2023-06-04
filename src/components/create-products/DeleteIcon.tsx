import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import {
  createProductPageStore,
  deletePopupStore,
} from "../../logic/create-products/createProductsPageStore";
import { EXISTING_IMAGE } from "../../utils/CONST";
import { trpc } from "../../utils/trpc";

export const DeleteIcon = () => {
  const itemsToDelete = deletePopupStore((state) => state.picturesToDeleteIds);
  const setImagesMutation = trpc.products.setImages.useMutation();
  const trpcContext = trpc.useContext();
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="btn-ghost btn flex gap-3"
        disabled={itemsToDelete.length === 0}
      >
        <label>Delete selected pictures ({itemsToDelete.length ?? ""}) </label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 text-error hover:cursor-pointer"
          onClick={() => {
            deletePopupStore.setState((state) => {
              state.popupOpen = false;
            });
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="flex flex-col gap-4 rounded-xl bg-base-300 p-4"
          side="left"
          align="start"
          sideOffset={5}
          alignOffset={40}
        >
          <DropdownMenu.Label>Are you sure?</DropdownMenu.Label>
          <DropdownMenu.DropdownMenuGroup className="flex gap-3">
            <DropdownMenu.Item>
              <button className="btn-ghost btn-sm btn">No</button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                className="btn-error btn-sm btn"
                onClick={async () => {
                  createProductPageStore.setState((state) => {
                    const urls = state.files
                      .filter((f) => f.file.name !== EXISTING_IMAGE)
                      .map((f) => f.url);
                    state.product.images = state.product.images.filter(
                      (i) => !urls.includes(i)
                    );
                    state.product.images = state.product.images.filter(
                      (i) => !itemsToDelete.includes(i)
                    );
                  });
                  toast.success(
                    createProductPageStore
                      .getState()
                      .product.images.length.toString()
                  );
                  await setImagesMutation.mutateAsync({
                    productId: createProductPageStore.getState().product.id,
                    urls: createProductPageStore.getState().product.images,
                  });
                  await trpcContext.products.byId.invalidate({
                    id: router.query.id as string,
                  });
                  toast.success("Pictures deleted");
                }}
              >
                Yes
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.DropdownMenuGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
