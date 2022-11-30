import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

export default function ProductDetails() {
  const router = useRouter();

  const { id } = router.query;

  const idASString = id as string;

  const data = trpc.products.byId.useQuery({ id: idASString });

  return (
    <div className="flex w-full gap-3">
      <div className="rounded-xl bg-base-300">
        {data.status === "success" && (
          <>
            <div className="flex aspect-14 h-[400px] w-[600px] flex-col items-center justify-center">
              <div className="carousel w-full bg-base-100">
                {data.data?.images.map((i, idx) => (
                  <>
                    <div className="carousel-item" key={i}>
                      <Image
                        id={`item${idx + 1}`}
                        src={i ?? ""}
                        alt="hello!"
                        height={600}
                        width={600}
                        className="rounded-t-xl"
                      />
                    </div>
                  </>
                ))}
                {data.data?.images.length === 0 && (
                  <Image
                    src={data.data?.previewImageUrl ?? ""}
                    className="w-[600px]"
                    alt="hello!"
                    height={400}
                    width={200}
                  />
                )}
              </div>
            </div>
            <div className="flex w-[600px] flex-wrap justify-center gap-2 rounded-xl bg-base-300 px-5 py-3">
              {data.data?.images.map((i, idx) => {
                return (
                  <>
                    <Link
                      href={`#item${idx + 1}`}
                      className="btn btn-md bg-fuchsia-800"
                      key={idx}
                    >
                      {idx + 1}
                    </Link>
                  </>
                );
              })}
            </div>
          </>
        )}
        {data.status === "loading" && <div>loading...</div>}
        {data.status === "error" && <div>error...</div>}
      </div>

      <div className="flex flex-1 flex-col rounded-xl bg-base-300 p-4">
        <div className="w-full text-center text-3xl font-bold">
          {data.data?.title}
        </div>

        <div className="mt-5 flex w-full flex-1 rounded-xl p-3">
          {data.data?.description}
        </div>

        <div className="flex h-min items-center justify-between">
          <NiceButton />
          <div className="flex gap-3 p-2">
            <button className="btn btn-ghost">buy now</button>
            <button className="btn btn-secondary">add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

type NiceButtonProps = {
  className?: string;
  callback?: (currentValue: number) => void;
};

export const NiceButton = ({}: NiceButtonProps) => {
  const [currentVal, setCurrentVal] = useState(1);

  return (
    <>
      <div>
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={() => {
            if (currentVal > 0) {
              setCurrentVal((c) => --c);
            }
          }}
        >
          -
        </button>
        <input
          className="input w-[60px] text-center"
          placeholder="1"
          value={currentVal}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          className="btm btn-sm text-xl font-bold"
          onClick={() => {
            setCurrentVal((c) => ++c);
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
