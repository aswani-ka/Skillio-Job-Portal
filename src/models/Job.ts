import mongoose, { Schema, models } from "mongoose"
import { required } from "zod/mini"

const JobSchema = new Schema(
  {
    logo: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Fullstack"],
    },
    level: {
      type: String,
      required: true,
      enum: ["Junior", "Midweight", "Senior"],
    },
    contract: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    languages: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    isNewJob: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
)

export default models.Job || mongoose.model("Job", JobSchema)
