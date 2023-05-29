import { productsStore } from "../../logic/common/productsStore";

export const ProductsTitle = () => {
  const filters = productsStore((state) => state.filters);

  return (
    <div className="mb-2">
      {filters.searchFilter &&
        'Products contains "' + filters.searchFilter + '"'}
      {(!filters.searchFilter || filters.searchFilter.trim().length === 0) &&
        "All products"}
    </div>
  );
};
