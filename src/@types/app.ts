import express, { Application, Request, Response } from "express";
import { iProductList, iProduct } from "./types";

const app: Application = express();
const port: number = 3000;

app.use(express.json());

let globalProductListDatabase: Array<iProductList> = [];
let idCount: number = 1;

// CREATE
app.post("/purchaseList/create", (request: Request, response: Response) => {
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
});

// READ
app.get("/purchaseList", (request, response) => {
  try {
    return response.status(201).send(globalProductListDatabase);
  } catch (error) {
    return response.status(500).send("internal server error");
  }
});

app.get("/purchaseList/:id", (request, response) => {
  const paramsId: number = parseInt(request.params.id);
  console.log(paramsId);

  const product = globalProductListDatabase.find((product) => {
    if (product.id === paramsId) {
      return product;
    } else {
      return response.status(404).send({
        message: `List with Id '${paramsId}' does not exist`,
      });
    }
  });

  return response.status(200).send(product);
});

// DELETE
app.delete("/purchaseList/:id/:itemName", (request, response) => {
  const { id: paramsId, itemName: paramsItemName } = request.params;

  let idExists: boolean = false;
  let productHasBeenDeleted: boolean = false;

  globalProductListDatabase.forEach((product) => {
    if (product.id === Number(paramsId)) {
      idExists = true;

      product.data.forEach((item, index) => {
        if (item.name === paramsItemName) {
          product.data.splice(index, 1);
          productHasBeenDeleted = true;
        }
      });
    }
  });

  if (idExists) {
    if (productHasBeenDeleted) {
      return response.status(204).send({});
    }

    return response.status(404).send({
      message: `Item with name ${paramsItemName} does not exist`,
    });
  }

  return response.status(404).send({
    message: `List with id ${paramsId} does not exist`,
  });
});

app.delete("/purchaseList/:id", (request, response: Response) => {
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

  return response.status(404).send({
    message: `List with Id '${paramsId}' does not exist`,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log("//----------------------//");
});
