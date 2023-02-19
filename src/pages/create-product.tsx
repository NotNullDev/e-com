import { DeleteIcon } from "../components/create-products/DeleteIcon";
import { ProductDescriptionEditor } from "../components/create-products/Editor";
import { FilesSelection } from "../components/create-products/FilesSelection";
import { ProductCategories } from "../components/create-products/ProductsCategories";
import { ProductMetadata } from "../components/create-products/ProductsMetadata";
import { ProductTitle } from "../components/create-products/ProductsTitle";
import { CreateProductButton } from "../components/create-products/UpsertProdctButton";
import { useInitProductPage } from "../logic/create-products/hooks";

const CreateProductPage = () => {
  useInitProductPage();
  return (
    <div className="flex-1">
      <ProductTitle />
      <FilesSelection />
      <div className="flex w-full justify-end"></div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex w-full items-center justify-between">
          <ProductMetadata />
          <DeleteIcon />
        </div>
        <ProductCategories />
      </div>
      <ProductDescriptionEditor />
      <CreateProductButton />
    </div>
  );
};

export default CreateProductPage;
