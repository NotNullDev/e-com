import type { DealType, Product } from "@prisma/client";
import { Category } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const products = trpc.products.getHottest.useQuery({ limit: 4 });
  const hits = trpc.products.getHits.useQuery({ limit: 4 });

  const allCategories = [
    ...Object.keys(Category).filter((c) => isNaN(Number(c))),
  ];

  return (
    <>
      <div className="mb-10 flex h-full w-full">
        <div className="mx-2 flex h-[60vh] flex-1 flex-col rounded-xl border-t border-primary p-6 shadow-md shadow-primary">
          {allCategories.map((c) => (
            <div
              className="w-full cursor-pointer p-2 hover:bg-base-200"
              key={c}
            >
              {c.replaceAll("_", " ")}
            </div>
          ))}
        </div>
        <div className="flex flex-[8] flex-col rounded-xl p-6">
          <h2 className="mb-2 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            Hot deals
          </h2>
          <div className="flex flex-wrap justify-between">
            {products.status === "success" && (
              <>
                {products.data?.map((p) => (
                  <SingleProductPreview key={p.id} product={p} />
                ))}
              </>
            )}
          </div>
          <h2 className="mb-2 mt-6 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            Trending
          </h2>
          <div className="flex flex-wrap justify-between">
            {hits.status === "success" && (
              <>
                {hits.data?.map((p) => (
                  <SingleProductPreview key={p.id} product={p} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type SingleProductPreviewProps = {
  product: Product;
};
const SingleProductPreview = ({ product }: SingleProductPreviewProps) => {
  return (
    <div className="group relative flex h-[500px] w-[300px] cursor-pointer flex-col rounded-xl shadow-xl shadow-secondary">
      <Image
        src={product.previewImageUrl ?? ""}
        alt="product preview"
        width={300}
        height={50}
        className="rounded-xl"
      />
      <div className="m-3 flex h-full flex-col gap-3">
        <h1 className="text-3xl group-hover:text-secondary">{product.title}</h1>
        <p className="flex-1 line-clamp-4">{product.description}</p>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div>
              <span>{product.stock}</span> in stock
            </div>
            <div>
              <span>{product.price}</span> PLN
            </div>
          </div>
        </div>
      </div>
      <SingleProductSticker dealType={product.dealType as DealType} />
    </div>
  );
};

type SingleProductStickerProps = {
  dealType: DealType;
};
const SingleProductSticker = ({ dealType }: SingleProductStickerProps) => {
  return (
    <div className="absolute right-0 bottom-0 m-10 rotate-12">
      {dealType === "HOT" && (
        <span className=" bg-clip-text text-red-600  shadow-xl shadow-orange-600">
          HOT
        </span>
      )}
      {dealType === "HIT" && (
        <span className=" bg-clip-text text-green-500  shadow-xl shadow-yellow-500">
          HIT
        </span>
      )}
    </div>
  );
};

export default Home;
