import { useAtom } from "jotai";
import { ProductAtoms } from "../../logic/common/productsStore";

export const ProductsTitle = () => {
  const [filters] = useAtom(ProductAtoms.query.productFiltersAtom);

  return (
    <div className="mb-2">
      {filters.searchFilter &&
        'Products contains "' + filters.searchFilter + '"'}
      {(!filters.searchFilter || filters.searchFilter.trim().length === 0) &&
        "All products"}
    </div>
  );
};
