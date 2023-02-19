import type { Product } from "@prisma/client";
import Image from "next/image";
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
        className="card card-compact relative h-[300px] w-[250px] cursor-pointer bg-base-100 text-base shadow-xl hover:opacity-80"
      >
        <figure>
          <Image
            src={product.previewImageUrl}
            alt="Shoes"
            width={280}
            height={190}
            priority={true}
          />
        </figure>
        <div className="card-body flex w-full flex-col justify-between">
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
