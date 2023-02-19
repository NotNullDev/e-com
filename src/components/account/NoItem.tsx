import Link from "next/link";

export const NoItem = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-min w-full flex-col justify-center gap-2">
        <div className="whitespace-nowrap text-2xl">
          You don&apos;t have any products yet.
        </div>
        <Link className="btn-primary btn" href="/create-product">
          Create one
        </Link>
      </div>
      {false && (
        <>
          <div className="flex items-center justify-center gap-8 bg-base-300 p-6 shadow-xl">
            <div>Product name 1</div>
            <div>
              <span>10</span>
              <span>&lt;3</span>
            </div>
            <div>
              <span>10</span>
              <span>in stock</span>
            </div>
            <div>
              <span>5</span>
              <span>sold</span>
            </div>
            <div>
              <span>54</span>
              <span>zl</span>
            </div>
            <div className="flex flex-col">
              <div>Expire date</div>
              <span>13.12.2022 r</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
