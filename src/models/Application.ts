import mongoose, { models, Schema} from "mongoose";


const ApplicationSchema = new Schema(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        applicant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        resumeUrl: {
            type: String,
            required: true
        },
        coverLetter: {
            type: String
        },
        status: {
            type: String,
            enum: ["PENDING", "SHORTLISTED", "REJECTED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
)

export default models.Application || mongoose.model("Application", ApplicationSchema)