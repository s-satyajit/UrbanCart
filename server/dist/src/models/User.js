import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    line1: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
}, { _id: false });
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: addressSchema, default: () => ({}) },
}, { timestamps: true });
export const User = mongoose.model("User", userSchema);
