import mongoose, { InferSchemaType } from "mongoose";

const OtpSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    codeHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    attempts: {
        type: Number,
        required: true,
        default: 0,
    }
})

OtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

type Otp = InferSchemaType<typeof OtpSchema>;
const OtpModel = mongoose.model("Otp", OtpSchema);

export { OtpModel, Otp };