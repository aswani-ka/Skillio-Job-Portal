import mongoose, { Schema, Document } from "mongoose"
import { UserRole } from "@/constants/userRoles"



export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: UserRole,
    bio: string,
    skills: [string],
    experience: string,
    resumeUrl?: string,
    linkedin: string,
    github: string,
    companyName: string,
    companyDescription: string,
    compnayWebsite: string,
    companyLocation: string,
    isVerified: boolean,
    verifyToken?: string,
    verifyTokenExpiry?: Date,
    resetToken?: string,
    resetTokenExpiry?: Date
}

const UserScheme = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Please provide an email"],
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.JOB_SEEKER
        },

        // Job seeker profile

        bio: String,
        skills: {
            type: [String],
            default: []
        },
        experience: String,
        resumeUrl: String,
        linkedin: String,
        github: String,

        // Recruiter profile

        companyName: String,
        companyDescription: String,
        compnayWebsite: String,
        companyLocation: String,


        isVerified: {
            type: Boolean,
            default: false
        },
        verifyToken: String,
        verifyTokenExpiry: Date,
        resetToken: String,
        resetTokenExpiry: Date
    },
    {
        timestamps: true
    }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserScheme)