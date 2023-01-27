import express, { Application } from "express";
import {
  createNewList,
  deleteList,
  deleteListItem,
  readAllLists,
  readOneListById,
  updateListItem,
} from "./apiLogic";
import {
  ensureProductListExists,
  ensureUpdateRequestIsOk,
} from "./middlewares";

const app: Application = express();
const port: number = 3000;

app.use(express.json());

app.post("/purchaseList/create", createNewList);

app.get("/purchaseList", readAllLists);
app.get("/purchaseList/:id", ensureProductListExists, readOneListById);

app.patch(
  "/purchaseList/:id/:itemName",
  ensureProductListExists,
  ensureUpdateRequestIsOk,
  updateListItem
);

app.delete(
  "/purchaseList/:id/:itemName",
  ensureProductListExists,
  deleteListItem
);
app.delete("/purchaseList/:id", ensureProductListExists, deleteList);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log("//----------------------//");
});
