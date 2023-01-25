import express, { Application, Request, response, Response } from "express";

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

app.get("/purchaseList", (request: Request, response: Response) => {
  try {
    return response.status(201).send(productList);
  } catch (error) {
    return response.send("Algo deu errado");
  }
});

app.get("/purchaseList/:id", (request, response) => {
  const paramsId: number = parseInt(request.params.id);
  console.log(paramsId);

  const product = productList.find((product) => {
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
