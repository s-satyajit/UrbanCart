import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: "" },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    badge: { type: String, default: "" },
    featured: { type: Boolean, default: false },
}, { timestamps: true });
export const Product = mongoose.model("Product", productSchema);
