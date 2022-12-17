import { MantineProvider } from "@mantine/core";
import { Link as MantineTiptapLink, RichTextEditor } from "@mantine/tiptap";
import type { Category } from "@prisma/client";
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
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { NiceButton } from "../components/NiceButton";
import { getAllCategoriesAsString } from "../utils/enumParser";

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

type CreateProductPageStoreType = {
  product: ProductModel;
  createProduct: () => void;
};

const createProductPageStore = create<CreateProductPageStoreType>()(
  immer((set, get, _) => {
    const createProduct = async () => {
      const product = get().product;
      const form = new FormData();
      form.append("title", product.title);
      form.append("description", product.description);
      form.append("shippingTime", `${product.shippingTime}`);
      form.append("stock", `${product.stock}`);
      form.append("price", `${product.price}`);
      form.append(
        "previewImageIdentificator",
        JSON.stringify(product.previewImageIdentificator)
      );

      toast("uploading " + product.files.length + " files.");

      const filesToSend = product.files.forEach((f) => {
        form.append("files", f);
      });

      const headers = new Headers();
      headers.append("Content-Type", "multipart/form-data");

      const respBody = JSON.stringify({
        title: product.title,
        description: product.description,
        files: form,
      });

      const resp = await fetch("/api/file-test", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        toast.error("File upload failed!");
        return;
      }

      toast.success("Product created.");
    };

    return {
      product: {
        title: "",
        description: "",
        files: [],
        price: 0,
        shippingTime: 0,
        stock: 1,
        categories: [],
        previewImageIdentificator: {
          name: "",
          size: 0,
        },
      },
      createProduct,
    };
  })
);

const CreateProductPage = () => {
  return (
    <div className="flex-1">
      <input
        placeholder="Product title"
        className="input-bordered input text-3xl"
        onChange={(e) => {
          createProductPageStore.setState((state) => {
            state.product.title = e.currentTarget.value;
          });
        }}
      />
      <FilesSelection />
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-3">
          <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
            <div className="w-[100px]">Price</div>
            <NiceButton
              min={1}
              max={9999}
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
              min={0}
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
              min={0}
              callback={(p) => {
                createProductPageStore.setState((state) => {
                  state.product.shippingTime = p;
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 p-4">
          <div className="w-[100px] whitespace-nowrap">Categories</div>
          <div className="ml-4 flex gap-3">
            {getAllCategoriesAsString().map((c) => (
              <CategorySelector key={c} category={c} />
            ))}
          </div>
        </div>
      </div>
      <ProductEditor />
      <div className="mt-3 flex w-full justify-end">
        <div
          className="btn-primary btn"
          onClick={() => {
            createProductPageStore.getState().createProduct();
          }}
        >
          Create
        </div>
      </div>
    </div>
  );
};

const ProductEditor = () => {
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
    editorProps: { attributes: { class: "min-h-[300px]" } },
    onUpdate: ({ editor, transaction }) => {
      createProductPageStore.setState((state) => {
        state.product.description = editor?.getHTML() ?? "";
      });
    },
  });

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
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    createProductPageStore.setState((old) => {
      old.product.files = files;
    });
  }, [files]);

  return (
    <div className="relative w-full p-4">
      <div className="group grid columns-3 grid-cols-4 gap-4">
        {files.map((u, idx) => (
          <div key={idx} className="relative ">
            <Image
              src={URL.createObjectURL(u)}
              width={400}
              height={200}
              alt="haha"
              className="col-span-1 h-[200px] w-[400px] bg-cover bg-center"
            />
            <div className="invisible absolute right-10 top-0 m-4 h-[24px] w-[24px] gap-2 rounded group-hover:visible">
              <div className="flex w-[100px] flex-nowrap gap-3">
                <input
                  className="checkbox-primary checkbox"
                  type="checkbox"
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      createProductPageStore.setState((state) => {
                        state.product.previewImageIdentificator = {
                          name: u.name,
                          size: u.size,
                        };
                      });
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-error hover:cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </div>
          </div>
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
                      // const ur = URL.createObjectURL(file);
                      setFiles([...files, file]);
                      createProductPageStore.setState((old) => {
                        old.product.files = [...old.product.files, file];
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

type CategorySelectorProps = {
  category: string;
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

export default CreateProductPage;
