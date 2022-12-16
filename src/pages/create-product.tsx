import { MantineProvider } from "@mantine/core";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
});

type ProductModel = {
  title: string;
  description: string;
  files: File[];
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
      />
      <FilesSelection />
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
  const [val, setVal] = useState("");

  useEffect(() => {
    createProductPageStore.setState((state) => {
      state.product.description = val;
    });
  }, [val]);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <RichTextEditor
        value={val}
        onChange={setVal}
        id="rte"
        className="h-[600px] overflow-y-auto"
        placeholder="Product description"
      />
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
    <div className="w-full p-4">
      <div className="grid columns-3 grid-cols-4 gap-4">
        {files.map((u, idx) => (
          <Image
            src={URL.createObjectURL(u)}
            width={400}
            height={200}
            alt="haha"
            key={idx}
            className="col-span-1 h-[200px] w-[400px]"
          />
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

export default CreateProductPage;
