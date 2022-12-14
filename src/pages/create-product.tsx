import { MantineProvider } from "@mantine/core";
import { Link as MantineTiptapLink, RichTextEditor } from "@mantine/tiptap";
import type { Category, DealType, Product } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import TipTapHightlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import type { AnyExtension } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { z } from "zod";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createProductZodValidationObject,
  createProductZodValidationObjectWihtoutImages,
} from "../../common/zodValidators";
import { NiceButton } from "../components/NiceButton";
import { EXISTING_IMAGE } from "../utils/CONST";
import { Converters } from "../utils/convertes";
import { getAllCategoriesAsString } from "../utils/enumParser";
import { trpc } from "../utils/trpc";

type DeletePopupStoreType = {
  popupOpen: boolean;
  picturesToDeleteIds: string[];
};

const deletePopupStore = create<DeletePopupStoreType>()(
  immer((set) => {
    return {
      popupOpen: false,
      picturesToDeleteIds: [],
    };
  })
);

const CreateProductPage = () => {
  useInitProductPage();
  return (
    <div className="flex-1">
      <ProductTitle />
      <FilesSelection />
      <div className="flex w-full justify-end"></div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex w-full items-center justify-between">
          <ProductMetadata />
          <DeleteIcon />
        </div>
        <ProductCategories />
      </div>
      <ProductDescriptionEditor />
      <CreateProductButton />
    </div>
  );
};

const useInitProductPage = () => {
  const router = useRouter();
  const productId = router.query.id as string;
  const trpcContext = trpc.useContext();
  const { data: product } = trpc.products.byId.useQuery(
    {
      id: productId ?? "",
    },
    {
      onSuccess: async (data) => {
        if (data) {
          // createProductPageStore.setState({
          //   product: {
          //     ...data,
          //   },
          //   files: [],
          //   previewImageIdentificator: { name: EXISTING_IMAGE, size: 0 },
          // });
          createProductPageStore.getState().resetStore();
          createProductPageStore.setState((state) => {
            state.product = data;
            state.isUpdating = true;
          });

          // TODO: it is not most efficient way to do this xD
          for (const url of data.images) {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], EXISTING_IMAGE, {
              type: blob.type,
            });

            createProductPageStore.setState((state) => {
              state.files.push({
                url,
                file,
              });
            });
          }
        }
      },
    }
  );

  useEffect(() => {
    createProductPageStore.getState().resetStore();
    if (productId) {
      trpcContext.products.invalidate();
    }
  }, [productId]);
};

const useUploadImagesMutation = () => {
  const preSingedUrlMutation =
    trpc.products.getPreSingedUrlForFileUpload.useMutation();

  const upload = async (images: File[]) => {
    const result = [];
    const form = new FormData();
    for (const image of images) {
      if (image && image.name !== "") {
        form.append("files", image);
      }
    }

    for (const img of images) {
      if (img.name === EXISTING_IMAGE) {
        continue;
      }
      const { presignedurl, fileUrl } = await preSingedUrlMutation.mutateAsync({
        fileName: img.name,
      });

      const uploadFilesResponse = await fetch(presignedurl, {
        method: "PUT",
        body: img,
      });

      if (!uploadFilesResponse.ok) {
        throw new Error(
          `Could not upload image ${img.name} to the file server.`
        );
      }
      result.push({ originalFileName: img.name, fileUrl });
    }
    return result;
  };

  const uploadMutation = useMutation(["uploadImage"], upload);

  return uploadMutation;
};

const CreateProductButton = () => {
  const router = useRouter();
  const trpcContext = trpc.useContext();
  const createProductMutation = trpc.products.upsertProduct.useMutation();
  const uploadImagesMutation = useUploadImagesMutation();
  const isUpdating = createProductPageStore((s) => s.isUpdating);
  const { upsertProduct } = useUpsertProduct();

  return (
    <>
      <div className="mt-3 flex w-full justify-end">
        <div className="btn-primary btn" onClick={() => upsertProduct()}>
          {isUpdating ? "Update" : "Create"}
        </div>
      </div>
    </>
  );
};

const useUpsertProduct = () => {
  const createProductMutation = trpc.products.upsertProduct.useMutation();
  const uploadImagesMutation = useUploadImagesMutation();
  const trpcContext = trpc.useContext();
  const isUpdating = createProductPageStore((s) => s.isUpdating);
  const router = useRouter();

  const upsertProduct = async () => {
    toast.remove();

    const productToCreate = {
      id: createProductPageStore.getState().product.id ?? null,
      title: createProductPageStore.getState().product.title,
      description: createProductPageStore.getState().product.description,
      price: createProductPageStore.getState().product.price,
      stock: createProductPageStore.getState().product.stock,
      shippingTimeDays: createProductPageStore.getState().product.shippingTime,
      categories: createProductPageStore
        .getState()
        .product.categories.map((c) => Converters.stringToCategory(c)),
      fileUrls: [],
      previewImageUrl: "",
    } as z.infer<typeof createProductZodValidationObject>;

    let result =
      createProductZodValidationObjectWihtoutImages.safeParse(productToCreate);

    if (!result.success) {
      result.error.errors.map((error) => {
        toast.error(`${error.path} ${error.message}`, {
          position: "bottom-left",
          duration: 10000,
        });
      });
      return;
    }

    const mapping = await uploadImagesMutation.mutateAsync(
      createProductPageStore.getState().files.map((f) => f.file) ?? [],
      {
        onError: (err) => {
          console.log(err);
          toast("Could not upload images to the file server.");
        },
      }
    );

    let previewImageUrl =
      createProductPageStore.getState().product.previewImageUrl;

    if (!previewImageUrl) {
      previewImageUrl =
        mapping.find(
          (img) =>
            img.originalFileName ===
            createProductPageStore.getState().previewImageIdentificator.name
        )?.fileUrl ?? "";
    }

    const newFileNames = mapping.map((m) => m.fileUrl);

    productToCreate.fileUrls = newFileNames ?? [];

    if (previewImageUrl === "") {
      if (
        productToCreate.fileUrls.length === 0 ||
        !productToCreate.fileUrls[0] ||
        productToCreate.fileUrls[0] === ""
      ) {
        toast.error("You must upload at least one image.");
        return;
      }
      previewImageUrl = productToCreate.fileUrls[0];
    }

    productToCreate.previewImageUrl = previewImageUrl;

    result = createProductZodValidationObject.safeParse(productToCreate);

    if (!result.success) {
      result.error.errors.map((error) => {
        toast.error(`${error.path} ${error.message}`, {
          position: "bottom-left",
          duration: 10000,
        });
      });
      return;
    }

    const mutationResult = await createProductMutation.mutateAsync(
      productToCreate
    );

    if (mutationResult) {
      if (isUpdating) {
        toast.success("Product updated successfully.");
      } else {
        toast.success("Product created successfully.");
      }
      router.push("/account");
      await trpcContext.products.getOwnProducts.invalidate();
      createProductPageStore.getState().resetStore();
    }
  };

  return {
    upsertProduct,
  };
};

const ProductCategories = () => {
  return (
    <>
      <div className="flex flex-col items-start gap-3 p-4">
        <div className="w-[100px] whitespace-nowrap">Categories</div>
        <div className="ml-4 flex gap-3">
          {getAllCategoriesAsString().map((c) => (
            <CategorySelector key={c} category={c} />
          ))}
        </div>
      </div>
    </>
  );
};

const ProductMetadata = () => {
  const shippingTime = createProductPageStore(
    (state) => state.product.shippingTime
  );
  const p = createProductPageStore((state) => state.product);
  const stock = createProductPageStore((state) => state.product.stock);
  const price = createProductPageStore((state) => state.product.price);
  return (
    <>
      <div className="flex gap-3">
        <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
          <div className="w-[100px]">Price</div>
          <NiceButton
            key={price}
            min={1}
            max={9999}
            initial={price}
            callback={(p) => {
              createProductPageStore.setState((state) => {
                state.product.price = p;
              });
            }}
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
          <div className="w-[100px]">Stock</div>
          <NiceButton
            key={stock}
            min={0}
            initial={stock}
            callback={(p) => {
              createProductPageStore.setState((state) => {
                state.product.stock = p;
              });
            }}
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
          <div className="w-[100px] whitespace-nowrap">Shipping Time</div>
          <NiceButton
            key={shippingTime}
            min={0}
            initial={shippingTime}
            callback={(p) => {
              createProductPageStore.setState((state) => {
                state.product.shippingTime = p;
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

const ProductTitle = () => {
  const val = createProductPageStore((state) => state.product.title);
  return (
    <input
      value={val}
      placeholder="Product title"
      className="input-bordered input text-3xl"
      onChange={(e) => {
        createProductPageStore.setState((state) => {
          state.product.title = e.currentTarget.value;
        });
      }}
    />
  );
};
const ProductDescriptionEditor = () => {
  const description = createProductPageStore(
    (state) => state.product.description
  );
  const editor = useEditor({
    extensions: [
      StarterKit as AnyExtension,
      Underline,
      Placeholder.configure({
        placeholder: "Item description",
      }),
      MantineTiptapLink,
      Superscript,
      SubScript,
      TipTapHightlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: description,
    editorProps: { attributes: { class: "min-h-[300px]" } },
    onUpdate: ({ editor, transaction }) => {
      createProductPageStore.setState((state) => {
        state.product.description = editor?.getHTML() ?? "";
      });
    },
  });

  useEffect(() => {
    editor?.commands.setContent(description);
  }, [description]);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </MantineProvider>
  );
};

const FilesSelection = () => {
  const files = createProductPageStore((state) => state.files);

  useEffect(() => {
    createProductPageStore.setState((old) => {
      old.files = files;
    });
  }, [files]);

  return (
    <div className="relative w-full p-4">
      <div className="group grid columns-3 grid-cols-4 gap-4">
        {files.map((u, idx) => (
          <label key={idx} className="relative cursor-pointer">
            <Image
              src={u.url}
              width={400}
              height={200}
              alt="haha"
              className="col-span-1 h-[200px] w-[400px] bg-cover bg-center"
            />
            <div className="invisible absolute right-0 top-0 m-4 h-[24px] w-[24px] gap-2 rounded group-hover:visible group-active:visible">
              <div className="flex w-[100px] flex-nowrap gap-3">
                <input
                  className="checkbox-primary checkbox"
                  type="checkbox"
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      deletePopupStore.setState((state) => {
                        state.picturesToDeleteIds.push(u.url);
                      });
                    } else {
                      deletePopupStore.setState((state) => {
                        state.picturesToDeleteIds =
                          state.picturesToDeleteIds.filter(
                            (url) => url !== u.url
                          );
                      });
                    }
                  }}
                />
              </div>
            </div>
          </label>
        ))}
        {files.length <= 7 && (
          <>
            <label
              htmlFor="img-input"
              className="flex h-[200px] w-[400px] cursor-pointer items-center justify-center bg-base-300 text-5xl hover:bg-base-200"
            >
              +
              <>
                <input
                  type="file"
                  hidden
                  id="img-input"
                  onChange={(e) => {
                    if (!e.currentTarget.files || !e?.currentTarget?.files[0]) {
                      return;
                    }
                    const file = e?.currentTarget?.files[0];
                    if (file && file.type.startsWith("image/")) {
                      createProductPageStore.setState((state) => {
                        state.files.push({
                          url: URL.createObjectURL(file),
                          file,
                        });
                      });
                    }
                  }}
                />
              </>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

const DeleteIcon = () => {
  const itemsToDelete = deletePopupStore((state) => state.picturesToDeleteIds);
  const setImagesMutation = trpc.products.setImages.useMutation();
  const trpcContext = trpc.useContext();
  const router = useRouter();

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className="btn-ghost btn flex gap-3"
          disabled={itemsToDelete.length === 0}
        >
          <label>
            Delete selected pictures ({itemsToDelete.length ?? ""}){" "}
          </label>
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
    </>
  );
};

const CategorySelector = ({ category: c }: CategorySelectorProps) => {
  const [enabled, setEnabled] = useState(false);
  // const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const selectedCategories = createProductPageStore(
    (state) => state.product.categories
  );

  const addCategory = (category: Category) => {
    createProductPageStore.setState((old) => {
      old.product.categories = [
        ...new Set([...old.product.categories, category]),
      ];
    });
  };

  const removeCategory = (category: Category) => {
    createProductPageStore.setState((state) => {
      state.product.categories = state.product.categories.filter(
        (c) => c !== category
      );
    });
  };

  const enabledStyle = "bg-primary text-primary-content";

  const activeStyle = useMemo(() => (enabled ? enabledStyle : ""), [enabled]);

  useEffect(() => {
    if (selectedCategories.includes(c as Category)) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (enabled) {
      addCategory(c as Category);
    } else {
      removeCategory(c as Category);
    }
  }, [enabled]);

  return (
    <div
      className={
        "cursor-pointer rounded-xl bg-base-200 p-2 px-4 " + ` ${activeStyle}`
      }
      key={c}
      onClick={() => {
        setEnabled((old) => !old);
      }}
    >
      {c.replaceAll("_", " ")}
    </div>
  );
};

const emptyProductPageStore = {
  product: {
    title: "",
    description: "",
    price: 1,
    shippingTime: 1,
    stock: 1,
    categories: [],
    views: BigInt("0"),
    id: "",
    boughtCount: BigInt("0"),
    createdAt: new Date(),
    dealType: "NONE" as DealType,
    images: [],
    lastBoughtAt: new Date(),
    previewImageUrl: "",
    rating: 0,
    userId: "",
  },
  files: [],
  previewImageIdentificator: {
    name: "",
    size: 0,
  },
  isUpdating: false,
};

export const createProductPageStore = create<CreateProductPageStoreType>()(
  immer((set, get) => {
    const createProduct = async (): Promise<boolean> => {
      const product = get().product;
      const previewImageIdentificator = get().previewImageIdentificator;
      const files = get().files;

      const form = new FormData();
      form.append("title", product.title);
      form.append("description", product.description);
      form.append("shippingTime", `${product.shippingTime}`);
      form.append("stock", `${product.stock}`);
      form.append("price", `${product.price}`);
      form.append(
        "previewImageIdentificator",
        JSON.stringify(previewImageIdentificator)
      );

      const filesToSend = files.forEach((f) => {
        form.append("files", f.file);
      });

      const headers = new Headers();
      headers.append("Content-Type", "multipart/form-data");

      const respBody = JSON.stringify({
        title: product.title,
        description: product.description,
        files: form,
      });

      const uploadFilesResponse = await fetch("http://localhost:4500", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const uploadedFilesMapping: SavedFilesMapping =
        await uploadFilesResponse.json();

      const resp = await fetch("/api/file-test", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        try {
          const errMsg = await resp.json();
          if (errMsg.error) {
            toast.error(errMsg.error, {
              duration: 5000,
              position: "bottom-left",
            });
            return false;
          }
        } catch (e) {}
        toast.error("File upload failed!");
        return false;
      }
      const r = await resp.json();
      toast(JSON.stringify(r));

      if (createProductPageStore.getState().isUpdating) {
        toast.success("Product updated.");
      } else {
        toast.success("Product created.");
      }
      return true;
    };

    const resetStore = () => {
      set({
        createProduct,
        resetStore,
        ...emptyProductPageStore,
      });
      deletePopupStore.setState((state) => {
        state.picturesToDeleteIds = [];
      });
    };

    return {
      ...emptyProductPageStore,
      createProduct,
      resetStore,
    };
  })
);

const emptyUpdateProductPageStore = {
  categories: [],
  description: "",
  filesUrl: [],
  previewImageIdentificator: {
    name: "",
    size: 0,
  },
  price: 0,
  shippingTime: 0,
  stock: 0,
  title: "",
};

const updateProductPageStore = create<UpdatePruoductPageStoreType>()(
  immer((set, get, store) => {
    return {
      ...emptyUpdateProductPageStore,
    };
  })
);

type ProductModel = {
  title: string;
  description: string;
  shippingTime: number;
  price: number;
  stock: number;
  files: File[];
  categories: Category[];
  previewImageIdentificator: {
    name: string;
    size: number;
  };
};

type CategorySelectorProps = {
  category: string;
};
type UpdatePruoductPageStoreType = {
  title: string;
  description: string;
  shippingTime: number;
  price: number;
  stock: number;
  filesUrl: string[];
  categories: Category[];
  previewImageIdentificator: {
    name: string;
    size: number;
  };
};
type CreateProductPageStoreType = {
  product: Product;
  previewImageIdentificator: {
    name: string;
    size: number;
  };
  files: {
    url: string;
    file: File;
  }[];
  isUpdating: boolean;
  createProduct: () => Promise<boolean>;
  resetStore: () => void;
};

type SavedFilesMapping = {
  originalFileName: string;
  newFileName: string;
};

export default CreateProductPage;
