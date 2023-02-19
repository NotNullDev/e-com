export const AllProductsSummarySkeleton = () => {
  return (
    <div className="h-[200px]">
      <h1 className="mb-4 text-3xl">Summary</h1>
      <div className="flex flex-col gap-2"> </div>
      <div className="animate-pulse">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full justify-between text-2xl">
            <div className="h-[20px] w-1/2 rounded-xl bg-gray-700"></div>
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
          </div>
          <div className="flex w-full justify-between text-2xl">
            <div className="h-[20px] w-1/3 rounded-xl bg-gray-700"></div>
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
          </div>
          <div className="flex w-full justify-between text-2xl">
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-end">
          <div className="flex w-1/4 flex-col">
            <div className="h-[2px] w-full animate-none bg-base-content"></div>
            <div className="mt-4 flex w-full justify-end text-3xl">
              <div className="h-[20px] w-full animate-pulse whitespace-nowrap rounded-xl bg-gray-700 pt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
