import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Review interface extending Document
export interface Review extends Document {
  UserName: string;
  Comment: string;
  Rating: number;
  Product_id: mongoose.Types.ObjectId; 
}

// Define the Review schema
const ReviewSchema: Schema<Review> = new Schema({
  UserName: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  Comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  Rating: {
    type: Number,
    required: [true, "Rating is required"],
  },
  Product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true,
  },
});


const ReviewModel: Model<Review> =
  mongoose.models.Review || mongoose.model<Review>("Review", ReviewSchema);


export default ReviewModel;
