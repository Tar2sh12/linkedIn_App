import mongoose from "mongoose";
const { Schema, model } = mongoose;
const companySchema= new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    desc:{
        type: String,
        required: true,
    },
    industry:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    noOfEmployees:{
        type:Number,
        min:2,
        max:50
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      }
}, {timestamps:true})
export default mongoose.models.Company || model("Company", companySchema);