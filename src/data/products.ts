export interface Product {
  id: string;
  model: string;
  storage: string;
  price: number;
  condition: "brand-new" | "pre-owned";
  image?: string;
  discount?: number;
}

export const brandNewProducts: Product[] = [
  { id: "1", model: "iPhone 7", storage: "32GB", price: 2800, condition: "brand-new", image: "/lovable-uploads/39e97a94-2071-432b-bf0a-e446a5bd1a9b.png" },
  { id: "2", model: "iPhone 7 Plus", storage: "32GB", price: 3500, condition: "brand-new", image: "/lovable-uploads/d60a3aa9-9ae0-4b1e-b65d-760bf33c7740.png" },
  { id: "3", model: "iPhone 7 Plus", storage: "128GB", price: 3900, condition: "brand-new", image: "/lovable-uploads/d60a3aa9-9ae0-4b1e-b65d-760bf33c7740.png" },
  { id: "4", model: "iPhone 8", storage: "64GB", price: 3300, condition: "brand-new", image: "/lovable-uploads/7e05145c-8840-4b0d-abdf-2e4896ee92df.png" },
  { id: "5", model: "iPhone 8 Plus", storage: "64GB", price: 4200, condition: "brand-new", image: "/lovable-uploads/8b205e3d-8a67-4959-8213-d0106a2040c9.png" },
  { id: "6", model: "iPhone X", storage: "64GB", price: 4800, condition: "brand-new", image: "/lovable-uploads/14b8ff94-84eb-4d5f-8808-deba2dd270ea.png" },
  { id: "7", model: "iPhone XS", storage: "64GB", price: 5100, condition: "brand-new", image: "/lovable-uploads/f9f08086-3414-4ee4-9f09-246de5adee3f.png" },
  { id: "8", model: "iPhone XR", storage: "64GB", price: 4900, condition: "brand-new", image: "/lovable-uploads/c16f4f49-c799-4c19-acdb-5e25d8f042f8.png" },
  { id: "9", model: "iPhone XR", storage: "128GB", price: 5300, condition: "brand-new", image: "/lovable-uploads/c16f4f49-c799-4c19-acdb-5e25d8f042f8.png" },
  { id: "10", model: "iPhone 11", storage: "64GB", price: 5900, condition: "brand-new", image: "/lovable-uploads/7c5544b8-af91-4224-9d62-46067b2c070f.png", discount: 800 },
  { id: "11", model: "iPhone 11", storage: "128GB", price: 6500, condition: "brand-new", image: "/lovable-uploads/7c5544b8-af91-4224-9d62-46067b2c070f.png" },
  { id: "12", model: "iPhone 11 Pro", storage: "64GB", price: 7400, condition: "brand-new", image: "/lovable-uploads/cc8657f3-a2b9-4797-a444-8e0e0f93b75e.png", discount: 1000 },
  { id: "13", model: "iPhone 11 Pro Max", storage: "64GB", price: 8600, condition: "brand-new", image: "/lovable-uploads/b2a62c05-6644-45ce-b5dd-2c3d260db58e.png" },
  { id: "14", model: "iPhone 12", storage: "128GB", price: 7800, condition: "brand-new", image: "/lovable-uploads/964fe3e2-de55-4a5d-87d3-626053a39ed8.png", discount: 900 },
  { id: "15", model: "iPhone 12 Pro", storage: "256GB", price: 9800, condition: "brand-new", image: "/lovable-uploads/5cea7217-dcac-409f-8670-f686f28b2d72.png" },
  { id: "16", model: "iPhone 12 Pro Max", storage: "128GB", price: 11300, condition: "brand-new", image: "/lovable-uploads/bf24c172-ea1d-448f-abae-0fca54aeb346.png" },
  { id: "17", model: "iPhone 13", storage: "128GB", price: 9900, condition: "brand-new", image: "/lovable-uploads/ffbd6bb9-f1bb-49f2-88db-18145465fdd0.png", discount: 1000 },
  { id: "18", model: "iPhone 13 Pro", storage: "128GB", price: 14500, condition: "brand-new", image: "/lovable-uploads/c3a1f61e-6476-46ff-b5b7-f0dc3cb55c1e.png" },
  { id: "19", model: "iPhone 14", storage: "128GB", price: 12800, condition: "brand-new", image: "/lovable-uploads/15778401-8141-4ff2-a54a-6b6073be207b.png" },
  { id: "20", model: "iPhone 14 Pro", storage: "256GB", price: 16900, condition: "brand-new", image: "/lovable-uploads/a10b91da-93d8-4ba5-b455-98e50878cc47.png" },
  { id: "21", model: "iPhone 14 Pro Max", storage: "128GB", price: 18500, condition: "brand-new", image: "/lovable-uploads/91426426-f886-473c-bdfd-4226031b0d81.png" },
  { id: "22", model: "iPhone 15", storage: "128GB", price: 14900, condition: "brand-new", image: "/lovable-uploads/96896a74-8c69-41ae-8ee8-3fc7f5fb38f1.png" },
  { id: "23", model: "iPhone 15 Pro Max", storage: "256GB", price: 24000, condition: "brand-new", image: "/lovable-uploads/bc14a16d-e0dd-426f-84b0-2f1a4fe4f0e4.png" },
];

export const preOwnedProducts: Product[] = [
  { id: "24", model: "iPhone 7", storage: "32GB", price: 2400, condition: "pre-owned", image: "/lovable-uploads/39e97a94-2071-432b-bf0a-e446a5bd1a9b.png" },
  { id: "25", model: "iPhone 7 Plus", storage: "32GB", price: 3000, condition: "pre-owned", image: "/lovable-uploads/d60a3aa9-9ae0-4b1e-b65d-760bf33c7740.png" },
  { id: "26", model: "iPhone 7 Plus", storage: "128GB", price: 3400, condition: "pre-owned", image: "/lovable-uploads/d60a3aa9-9ae0-4b1e-b65d-760bf33c7740.png" },
  { id: "27", model: "iPhone 8", storage: "64GB", price: 2900, condition: "pre-owned", image: "/lovable-uploads/7e05145c-8840-4b0d-abdf-2e4896ee92df.png" },
  { id: "28", model: "iPhone 8 Plus", storage: "64GB", price: 3500, condition: "pre-owned", image: "/lovable-uploads/8b205e3d-8a67-4959-8213-d0106a2040c9.png" },
  { id: "29", model: "iPhone Plus", storage: "128GB", price: 3900, condition: "pre-owned", image: "/lovable-uploads/8b205e3d-8a67-4959-8213-d0106a2040c9.png" },
  { id: "30", model: "iPhone XR", storage: "64GB", price: 4300, condition: "pre-owned", image: "/lovable-uploads/c16f4f49-c799-4c19-acdb-5e25d8f042f8.png" },
  { id: "31", model: "iPhone XR", storage: "128GB", price: 4900, condition: "pre-owned", image: "/lovable-uploads/c16f4f49-c799-4c19-acdb-5e25d8f042f8.png" },
  { id: "32", model: "iPhone X", storage: "64GB", price: 4100, condition: "pre-owned", image: "/lovable-uploads/14b8ff94-84eb-4d5f-8808-deba2dd270ea.png" },
  { id: "33", model: "iPhone XS", storage: "64GB", price: 4600, condition: "pre-owned", image: "/lovable-uploads/f9f08086-3414-4ee4-9f09-246de5adee3f.png" },
  { id: "34", model: "iPhone 11", storage: "64GB", price: 5500, condition: "pre-owned", image: "/lovable-uploads/7c5544b8-af91-4224-9d62-46067b2c070f.png" },
  { id: "35", model: "iPhone 11", storage: "128GB", price: 5700, condition: "pre-owned", image: "/lovable-uploads/7c5544b8-af91-4224-9d62-46067b2c070f.png", discount: 600 },
  { id: "36", model: "iPhone 11 Pro", storage: "64GB", price: 6800, condition: "pre-owned", image: "/lovable-uploads/cc8657f3-a2b9-4797-a444-8e0e0f93b75e.png" },
  { id: "37", model: "iPhone 11 Pro Max", storage: "64GB", price: 7500, condition: "pre-owned", image: "/lovable-uploads/b2a62c05-6644-45ce-b5dd-2c3d260db58e.png" },
  { id: "38", model: "iPhone 12", storage: "128GB", price: 6900, condition: "pre-owned", image: "/lovable-uploads/964fe3e2-de55-4a5d-87d3-626053a39ed8.png" },
  { id: "39", model: "iPhone 12 Pro", storage: "128GB", price: 8900, condition: "pre-owned", image: "/lovable-uploads/5cea7217-dcac-409f-8670-f686f28b2d72.png", discount: 800 },
  { id: "40", model: "iPhone 12 Pro Max", storage: "128GB", price: 10600, condition: "pre-owned", image: "/lovable-uploads/bf24c172-ea1d-448f-abae-0fca54aeb346.png", discount: 700 },
  { id: "41", model: "iPhone 13", storage: "128GB", price: 9000, condition: "pre-owned", image: "/lovable-uploads/ffbd6bb9-f1bb-49f2-88db-18145465fdd0.png" },
  { id: "42", model: "iPhone 13 Pro", storage: "128GB", price: 12200, condition: "pre-owned", image: "/lovable-uploads/c3a1f61e-6476-46ff-b5b7-f0dc3cb55c1e.png", discount: 1000 },
  { id: "43", model: "iPhone 13 Pro Max", storage: "128GB", price: 13900, condition: "pre-owned", image: "/lovable-uploads/ec9254ca-da70-4e44-8a3c-74c474e36ddd.png" },
];