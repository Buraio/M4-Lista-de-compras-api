import { Request, Response } from "express";
import { iProduct, iProductList } from "./types";

export let globalProductListDatabase: Array<iProductList> = [];
let idCount: number = 1;

export const createNewList = (request: Request, response: Response) => {
  try {
    const productListBody = request.body;

    const newProductList: iProductList = {
      id: idCount,
      listName: productListBody.listName,
      data: productListBody.data,
    };

    globalProductListDatabase.push(newProductList);
    idCount++;

    return response.status(201).send(newProductList);
  } catch (error) {
    return response.status(500).send("internal server error");
  }
};

export const readAllLists = (request: Request, response: Response) => {
  try {
    return response.status(201).send(globalProductListDatabase);
  } catch (error) {
    return response.status(500).send("internal server error");
  }
};

export const readOneListById = (request: Request, response: Response) => {
  try {
    const paramsId: number = parseInt(request.params.id);

    const product = globalProductListDatabase.find(
      (product) => product.id === paramsId
    );

    return response.status(200).send(product);
  } catch (error) {
    return response.status(500).send("internal server error");
  }
};

export const updateListItem = (request: Request, response: Response) => {
  const { id: paramsId, itemName: paramsItemName } = request.params;

  const itemRequestBody: iProduct = request.body;

  const { name: itemName, quantity: itemQuantity } = itemRequestBody;

  const selectedList = globalProductListDatabase.find((product) => {
    if (product.id === Number(paramsId)) {
      console.log(product.data.keys());
      product.data.forEach((item) => {
          if (item.name === paramsItemName) {
          item.name = itemName;
          item.quantity = itemQuantity;
        }
      });
      return product;
    }
  });

  if (selectedList) {
    return response.status(200).send(selectedList);
  }
};

export const deleteListItem = (request: Request, response: Response) => {
  try {
    const { id: paramsId, itemName: paramsItemName } = request.params;

    let productHasBeenDeleted: boolean = false;

    globalProductListDatabase.forEach((product) => {
      if (product.id === Number(paramsId)) {
        product.data.forEach((item, index) => {
          if (item.name === paramsItemName) {
            product.data.splice(index, 1);
            productHasBeenDeleted = true;
          }
        });
      }
    });

    if (productHasBeenDeleted) {
      return response.status(204).send({});
    }

    return response.status(404).send({
      message: `Item with name ${paramsItemName} does not exist`,
    });
  } catch (error) {
    return response.status(500).send("internal server error");
  }
};

export const deleteList = (request: Request, response: Response) => {
  try {
    const paramsId = request.params.id;

    let listHasBeenDeleted: boolean = false;

    globalProductListDatabase.forEach((product, index) => {
      if (product.id === parseInt(paramsId)) {
        globalProductListDatabase.splice(index, 1);
        listHasBeenDeleted = true;
      }
    });

    if (listHasBeenDeleted) {
      return response.status(204).send({});
    }
  } catch (error) {
    return response.status(500).send("internal server error");
  }
};
