import { NextFunction, Request, Response } from "express";
import { globalProductListDatabase } from "./apiLogic";
import { iProduct, requiredDataKeys, requiredKeys } from "./@types/types";
import { findProductById } from "./functions";

const requiredKeys: requiredKeys = ["listName", "data"];
const requiredDataKeys: requiredDataKeys = ["name", "quantity"];

export const ensureProductListExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const paramsId: number = parseInt(request.params.id);

  const productListId = globalProductListDatabase.findIndex(
    (product) => product.id === paramsId
  );

  if (productListId === -1) {
    return response.status(404).send({
      message: `List with Id '${paramsId}' does not exist`,
    });
  }

  next();
};

export const ensureCreateRequestIsOk = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const requestKeys = Object.keys(request.body);
  const requestData = request.body.data;

  const requestValues = Object.values(request.body);
  const validateTypes = requestValues.every((value, index) => {
    if (requestKeys[index] === "data") {
      if (!Array.isArray(value)) {
        return false;
      }
    } else if (typeof value !== "string") {
      return false;
    }

    return true;
  });

  if (!validateTypes) {
    return response.status(400).json({
      message:
        "Error: data property must be an array, while the other properties must have type string",
    });
  }

  const validateKeys = requiredKeys.every((key) => {
    if (requestKeys.includes(key)) {
      return requestKeys.length === requiredKeys.length;
    }
  });

  const validateDataKeys = requestData.every((product: iProduct) => {
    const requestItemKeys = Object.keys(product);
    const validation = requiredDataKeys.every((key) => {
      if (requestItemKeys.includes(key)) {
        return requestItemKeys.length === requiredDataKeys.length;
      }
    });

    return validation;
  });

  if (!validateKeys || !validateDataKeys) {
    return response.status(400).json({
      message:
        "Only accepted properties are 'listName', 'data', 'name' and 'quantity'",
    });
  }

  next();
};

export const ensureUpdateRequestIsOk = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const requestValues = Object.values(request.body);
  const validateBodyTypes = requestValues.every(
    (key) => typeof key === "string"
  );

  if (!validateBodyTypes) {
    return response.status(400).json({
      message: "The list name need to be a string",
    });
  }

  const paramsId: number = parseInt(request.params.id);
  const paramsItemName: string = request.params.itemName;

  const selectedList = findProductById(globalProductListDatabase, paramsId);

  const findProductItem = selectedList?.data.find(
    (item) => item.name === paramsItemName
  );

  if (!findProductItem) {
    return response.status(404).send({
      message: `Item with name '${paramsItemName}' does not exist`,
    });
  }

  const requestKeys = Object.keys(request.body);
  const validateKeys: boolean = requiredDataKeys.every((key) =>
    requestKeys.includes(key)
  );

  if (!validateKeys) {
    return response.status(400).json({
      message: `Updatable fields are 'name' and 'quantity'`,
    });
  }

  next();
};
