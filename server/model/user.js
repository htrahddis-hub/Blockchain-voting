import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  imageName: {
    type: String,
  },
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
