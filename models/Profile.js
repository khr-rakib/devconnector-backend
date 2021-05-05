const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        company: String,
        location: String,
        status: {
            type: String,
            required: true
        },
        skills: {
            type: [String],
            required: true
        },
        boi: String,
        githubusername: String,
        experience: [
            {
                title: {
                    type: String,
                    required: true
                },
                company: {
                    type: String,
                    required: true
                },
                location: String,
                from: {
                    type: Date,
                    required: true
                },
                to: Date,
                current: {
                    type: Boolean,
                    default: false
                },
                description: String,
            }
        ],
        education: [
            {
                school: {
                    type: String,
                    required: true
                },
                degree: {
                    type: String,
                    required: true
                },
                fieldofstudy: {
                    type: String,
                    required: true
                },
                from: {
                    type: Date,
                    required: true
                },
                to: {
                    type: Date
                },
                current: {
                    type: Boolean,
                    default: false
                },
                description: String
            }
        ],
        social: {
            youtube: String,
            twitter: String,
            facebook: String,
            linkedin: String,
            instagram: String,
        }
    },
    { timestamps: true }
)

module.exports = Profile = mongoose.model('Profile', profileSchema)