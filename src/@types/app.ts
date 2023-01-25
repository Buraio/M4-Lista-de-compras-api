import express, { Application, Request, Response } from "express";

const app: Application = express();
const port: number = 3000;

app.use(express.json());

const productList: iProductList[] = [];
let idCount: number = 1;

interface iProductList {
  id: number;
  listName: string;
  data: iProduct[];
}

interface iProduct {
  name: string;
  quantity: string;
}

app.post("/purchaseList/create", (request: Request, response: Response) => {
  try {
    const productListBody = request.body;

    const newProductList: iProductList = {
      id: idCount,
      listName: productListBody.listName,
      data: productListBody.data,
    };

    console.log(productListBody);

    productList.push(newProductList);
    idCount++;

    return response.status(201).send(newProductList);
  } catch (error) {
    return response.send("Algo deu errado");
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(productList);
});
