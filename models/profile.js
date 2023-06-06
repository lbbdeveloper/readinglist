import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
    bio: String,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export { Profile };
