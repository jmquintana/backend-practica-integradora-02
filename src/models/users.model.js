import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	age: Number,
	password: String,
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "carts",
	},
});

userSchema.pre("findOne", function () {
	this.populate("cart");
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
