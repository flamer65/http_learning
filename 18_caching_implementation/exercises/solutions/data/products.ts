export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const products: Product[] = [
  { id: 1, name: "Wireless Mouse", price: 29.99, category: "electronics" },
  { id: 2, name: "Mechanical Keyboard", price: 89.99, category: "electronics" },
  { id: 3, name: "USB-C Hub", price: 49.99, category: "electronics" },
  { id: 4, name: "Desk Lamp", price: 34.99, category: "office" },
  { id: 5, name: "Notebook Pack", price: 12.99, category: "office" },
];
