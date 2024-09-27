import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Product interface extending Document
export interface Product extends Document {
  Name: string;
  AboutProduct: string;
  Price: number;
  Stock: number;
  ColorOfProsuct: string[];
  SizeOfProduct: string[];
  Rating: number[];  // Array of ratings
  ProductDescription: string;
  Product_Images: { public_id: string; url: string }[];
  ProductCategories: {
    category: string;
    sub_categories?: string[];
  }[];
  Product_Seller: mongoose.Schema.Types.ObjectId;
  avgRating?: number; // Optional field for average rating
}

// Define the Product schema
const ProductSchema: Schema<Product> = new Schema({
  // All other fields remain the same
  Name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  AboutProduct: {
    type: String,
    required: [true, "AboutProduct is required"],
  },
  Price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  Stock: {
    type: Number,
    required: [true, "Product Stock is required"],
  },
  ColorOfProsuct: {
    type: [String],
    default: [],
  },
  SizeOfProduct: {
    type: [String],
    default: [],
  },
  Rating: {
    type: [Number],
    default: [],
  },
  ProductDescription: {
    type: String,
  },
  Product_Images: {
    type: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    validate: {
      validator: function (value: { public_id: string; url: string }[]) {
        return value.length <= 4;
      },
      message: "Product_Images can only have up to 4 images.",
    },
  },
  ProductCategories: {
    type: [
      {
        category: {
          type: String,
          required: true,
        },
        sub_categories: {
          type: String,
        },
      },
    ],
  },
  Product_Seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
});

// Add a virtual field for the average rating
ProductSchema.virtual('avgRating').get(function () {
  if (this.Rating.length === 0) return 0;
  const sum = this.Rating.reduce((acc, rating) => acc + rating, 0);
  return sum / this.Rating.length;
});

// Ensure virtual fields are included when converting to JSON or Object
ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
