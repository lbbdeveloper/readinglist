import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: String,
    img: {
      type: String,
      default: "/images/book/logo/placeholder.png",
    },
    author: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export { Book };
