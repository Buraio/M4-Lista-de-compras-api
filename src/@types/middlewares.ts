import { NextFunction, Request, Response } from "express";
import { globalProductListDatabase } from "./apiLogic";
import { iProduct, requiredDataKeys, requiredKeys } from "./types";

const requiredKeys: requiredKeys = ["listName", "data"];
const requiredDataKeys: requiredDataKeys = ["name", "quantity"];

export const ensureProductListExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const paramsId: number = Number(request.params.id);

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
  const validateTypes = requestValues.every((key) => {
    if (typeof key !== "string" || !Array.isArray(key)) {
    }
  });

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

  const { id: paramsId, itemName: paramsItemName } = request.params;

  const findProductItem = globalProductListDatabase.find((product) => {
    if (product.id === Number(paramsId)) {
      const productItem = product.data.find((item) => {
        if (item.name === paramsItemName) {
          return item;
        }
      });

      return productItem;
    }
  });

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
