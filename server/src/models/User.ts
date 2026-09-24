import mongoose, { InferSchemaType } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    phone: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
    },

    about: {
      type: String,
    },

    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

type User = InferSchemaType<typeof UserSchema>;
const UserModel = mongoose.model("User", UserSchema);

export { UserModel, User}