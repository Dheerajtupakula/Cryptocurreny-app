import { Schema, model, models } from "mongoose";

const CoinSchema = new Schema({
  coinId: {
    type: String,
    required: true,
  },
  coinName: {
    type: String,
    required: true,
  },
});

const DataSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  favoriteCoins: [CoinSchema],
});

const UserData = models.users || model("users", DataSchema);

export default UserData;
