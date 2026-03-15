import { productSeed } from "../data/product-seed.js";
import { Product } from "../models/Product.js";

export async function seedProducts() {
  const count = await Product.countDocuments();

  if (count > 0) {
    return;
  }

  await Product.insertMany(productSeed);
  console.log("Seeded products");
}
