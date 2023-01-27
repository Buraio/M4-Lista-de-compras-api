export interface iProductList {
  id: number;
  listName: string;
  data: iProduct[];
}

export interface iProduct {
  name: string;
  quantity: string;
}

export type requiredKeys = ["listName", "data"];

export type requiredDataKeys = ["name", "quantity"];
