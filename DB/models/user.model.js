import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.utils.js";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    recoveryEmail: { type: String, required: true },
    DOB: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: Object.values(systemRoles), // [User, Company_HR]
      required: true,
    },
    status: { // (online : true , offline:false )
      type: Boolean,
      required: true,
      default: false,
    },

  },
  { timestamps: true }
);
export default mongoose.models.User || model("User", userSchema);