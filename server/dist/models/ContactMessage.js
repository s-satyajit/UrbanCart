import mongoose from "mongoose";
const contactMessageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    howCanWeHelp: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: "" },
    status: { type: String, default: "new" },
}, { timestamps: true });
contactMessageSchema.pre("validate", function syncLegacyMessageField(next) {
    if (!this.howCanWeHelp && this.message) {
        this.howCanWeHelp = this.message;
    }
    if (!this.message && this.howCanWeHelp) {
        this.message = this.howCanWeHelp;
    }
    next();
});
export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
