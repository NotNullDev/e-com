export const SingleProductSkeleton = () => {
  return (
    <div className="flex h-[300px] w-[250px] animate-pulse flex-col rounded shadow-md">
      <div className="h-48 rounded-t bg-base-100"></div>
      <div className="flex-1 space-y-4 bg-base-300 px-4 py-8 sm:p-8">
        <div className="h-6 w-full rounded bg-base-100"></div>
        <div className="h-6 w-full rounded bg-base-100"></div>
        <div className="h-6 w-3/4 rounded bg-base-100"></div>
      </div>
    </div>
  );
};
