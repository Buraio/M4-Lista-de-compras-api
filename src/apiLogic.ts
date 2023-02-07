import { Request, Response } from "express";
import { iProduct, iProductList } from "./@types/types";
import { findProductById, spliceProductOrItemFromList } from "./functions";

export let globalProductListDatabase: Array<iProductList> = [];
let idCount: number = 1;

const serverErrorMessage: string = "Internal server error";

export const createNewList = (
  request: Request,
  response: Response
): Response => {
  try {
    const productListBody = request.body;

    const newProductList: iProductList = {
      id: idCount,
      listName: productListBody.listName,
      data: productListBody.data,
    };

    globalProductListDatabase.push(newProductList);
    idCount++;

    return response.status(201).json(newProductList);
  } catch (error) {
    return response.status(500).json({
      message: serverErrorMessage,
    });
  }
};

export const readAllLists = (
  request: Request,
  response: Response
): Response => {
  try {
    return response.status(200).send(globalProductListDatabase);
  } catch (error) {
    return response.status(500).json({
      message: serverErrorMessage,
    });
  }
};

export const readOneListById = (
  request: Request,
  response: Response
): Response => {
  try {
    const paramsId: number = parseInt(request.params.id);

    const productList = findProductById(globalProductListDatabase, paramsId);

    return response.status(200).send(productList);
  } catch (error) {
    return response.status(500).json({
      message: serverErrorMessage,
    });
  }
};

export const updateListItem = (
  request: Request,
  response: Response
): Response | void => {
  try {
    const paramsId: number = parseInt(request.params.id);
    const paramsItemName: string = request.params.itemName;

    const itemRequestBody: iProduct = request.body;

    const { name: itemName, quantity: itemQuantity } = itemRequestBody;

    const selectedList = findProductById(globalProductListDatabase, paramsId);

    const selectedItem = selectedList?.data.find((item) => {
      if (item.name === paramsItemName) {
        item.name = itemName;
        item.quantity = itemQuantity;
        return item;
      }
    });

    if (selectedItem) {
      return response.status(200).send(selectedItem);
    }
  } catch (error) {
    return response.status(500).json({
      message: serverErrorMessage,
    });
  }
};

export const deleteListItem = (request: Request, response: Response): Response => {
  try {
    const paramsId: number = parseInt(request.params.id);
    const paramsItemName: string = request.params.itemName;

    let productHasBeenDeleted: boolean = false;

    const selectedList = findProductById(globalProductListDatabase, paramsId);

    selectedList?.data.forEach((item, index, array) => {
      if (item.name === paramsItemName) {
        spliceProductOrItemFromList(array, index);
        productHasBeenDeleted = true;
      }
    });

    if (productHasBeenDeleted) {
      return response.status(204).send({});
    }

    return response.status(404).send({
      message: `Item with name ${paramsItemName} does not exist`,
    });
  } catch (error) {
    return response.status(500).json({
      message: serverErrorMessage,
    });
  }
};

export const deleteList = (
  request: Request,
  response: Response
): Response | void => {
  try {
    const paramsId: number = parseInt(request.params.id);

    let listHasBeenDeleted: boolean = false;

    globalProductListDatabase.forEach((product, index, array) => {
      if (product.id === paramsId) {
        spliceProductOrItemFromList(array, index);
        listHasBeenDeleted = true;
      }
    });

    if (listHasBeenDeleted) {
      return response.status(204).send({});
    }
  } catch (error) {
    return response.status(500).json({
      message: serverErrorMessage,
    });
  }
};
