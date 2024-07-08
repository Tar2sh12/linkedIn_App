import mongoose from "mongoose";
const { Schema, model } = mongoose;
const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userTechSkills: [
      {
        type: String,
        default: [],
      },
    ],
    userSoftSkills: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.models.Application || model("Application", applicationSchema);