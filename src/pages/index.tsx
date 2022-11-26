import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <div className="mb-10 flex h-full w-full">
        <div className="mx-2 flex h-[60vh] flex-1 flex-col rounded-xl border-t border-primary p-6 shadow-md shadow-primary">
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            Electronic
          </div>
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            Health care
          </div>
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            Clothes
          </div>
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            Sport
          </div>
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            House
          </div>
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            Culture
          </div>
          <div className="w-full cursor-pointer p-2 hover:bg-base-200">
            Beauty
          </div>
        </div>
        <div className="flex flex-[8] flex-col rounded-xl p-6">
          <h2 className="mb-2 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            Hot deal
          </h2>
          <div className="flex flex-wrap justify-between">
            {[...Array(6)].map((idx) => (
              <SingleProductPreview key={idx} dealType="hot" />
            ))}
          </div>
          <h2 className="mt-6 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            Latest hits
          </h2>
          <div className="flex flex-wrap justify-between">
            {[...Array(6)].map((idx) => (
              <SingleProductPreview key={idx} dealType="hit" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

type DealType = "hot" | "hit" | "none";

type SingleProductPreviewProps = {
  dealType: DealType;
};
const SingleProductPreview = ({ dealType }: SingleProductPreviewProps) => {
  return (
    <div className="group relative flex h-[200px] cursor-pointer flex-col rounded-xl p-6 shadow-xl">
      <h1 className="text-3xl group-hover:text-secondary">Super product </h1>
      <p className="flex-1">Sample description</p>
      <div>
        <div className="flex flex-col">
          <div>
            <span>3</span> in stock
          </div>
          <div>
            <span>6</span> PLN / piece
          </div>
        </div>
      </div>
      <SingleProductSticker dealType={dealType} />
    </div>
  );
};

type SingleProductStickerProps = {
  dealType: DealType;
};
const SingleProductSticker = ({ dealType }: SingleProductStickerProps) => {
  return (
    <div className="absolute right-0 bottom-0 m-10 rotate-12">
      {dealType === "hot" && (
        <span className=" bg-clip-text text-red-600  shadow-xl shadow-orange-600">
          HOT
        </span>
      )}
      {dealType === "hit" && (
        <span className=" bg-clip-text text-green-500  shadow-xl shadow-yellow-500">
          HIT
        </span>
      )}
    </div>
  );
};

export default Home;
