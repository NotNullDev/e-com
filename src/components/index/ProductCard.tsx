/* eslint-disable @next/next/no-img-element */
import type { Product } from "@prisma/client";
import Link from "next/link";
import { Rating } from "./RatingComponent";
import { ProductSticker } from "./StickerComponent";

type SingleProductPreviewProps = {
  product: Product;
};

export const ProductCard = ({ product }: SingleProductPreviewProps) => {
  return (
    <>
      <Link
        href={"/details/" + product.id ?? 0}
        className="flex h-[350px] w-[300px] flex-col rounded-xl border border-base-200/50 bg-base-100 shadow-xl"
      >
        <img
          src={product.previewImageUrl}
          alt="Shoes"
          className="h-[200px] flex-1 rounded-t-xl object-fill"
        />
        <div className="flex h-[150px] flex-col justify-between gap-2 p-4">
          <h2 className="text font-bold">{product.title}</h2>
          <div className="relative">
            <Rating rating={product.rating} key={product.id} />
          </div>
          <div className="w-full text-xl">
            {product.price} <span className="text-sm">zł</span>
          </div>
        </div>
        <ProductSticker dealType={product.dealType} />
      </Link>
    </>
  );
};
