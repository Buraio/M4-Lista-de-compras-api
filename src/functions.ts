import { iProduct, iProductList } from "./@types/types";

const findProductById = (array: iProductList[], paramsId: number) => {
  const product = array.find(
    (product: iProductList) => product.id === paramsId
  );
  return product;
};

const spliceProductOrItemFromList = (array: iProductList[] | iProduct[], index: number) => array.splice(index, 1);

export { findProductById, spliceProductOrItemFromList };
