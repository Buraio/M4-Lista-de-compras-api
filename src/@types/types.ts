export interface iProductList {
  id: number;
  listName: string;
  data: iProduct[];
}

export interface iProduct {
  name: string;
  quantity: string;
}
