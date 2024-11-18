export interface ItemClean {
  _id: string;
  name: string;
  price: number;
  subItems: ItemClean[];
}
