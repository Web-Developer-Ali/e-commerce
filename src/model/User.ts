import mongoose, { Schema, Document } from "mongoose";

export interface ICardProduct {
  productId: string;
  name: string;
  pic: string; // URL to the product image
  price: number;
  size: string;
  color: string;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  expireVerifyCode: Date;
  isVerified: boolean;
  otpVerified:boolean
  role?: string;
  cardProducts: ICardProduct[]; // Array of products in the user's cart
  whishlist_products: mongoose.Schema.Types.ObjectId[];
}

const CardProductSchema: Schema<ICardProduct> = new Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  pic: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  expireVerifyCode: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["User", "Seller"],
    default: "User",
  },
  cardProducts: {
    type: [CardProductSchema],
    default: [],
  },
  whishlist_products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
