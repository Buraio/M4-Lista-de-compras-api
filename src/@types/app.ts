import express, { Application, Request, Response } from "express";

const app: Application = express();
const port: number = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
