import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";

// Define the Seller interface
export interface Seller extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User
  shopName: string;
  address: string;
  countryCode: string;
  phoneNumber: {
    countryCode: string;
    number: string;
  };
  shippingType: string[]; // Example: ['Standard', 'Express']
  total_scales: string;
}

// Define the Seller schema
const SellerSchema: Schema<Seller> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  shopName: {
    type: String,
    required: [true, "Shop name is required"],
    trim: true,
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  phoneNumber: {
    countryCode: {
      type: String,
      required: [true, "Country code is required"],
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
  },
  shippingType: {
    type: [String],
    default: ["Standard"],
  },
  total_scales: {
    type: String,
  },
});

const SellerModel =
  (mongoose.models.Seller as mongoose.Model<Seller>) ||
  mongoose.model<Seller>("Seller", SellerSchema);

// interface for order schema
export interface Order extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  sellerId: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  totalAmount: number;
  status: string; // e.g., 'Completed', 'Pending', 'Shipped'
  createdAt: Date;
  paymentClear:Boolean
  quantity:number
  
}

const OrderSchema: Schema<Order> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "Pending", "Shipped", "Cancel"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentClear:{
    type:Boolean,
    required:true
  },
  quantity:{
    type:Number,
    required:true
  }
});

const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", OrderSchema);

export { OrderModel, SellerModel };
