const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: String,
        avatar: String,
        likes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users'
                }
            }
        ],
        comments: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users'
                },
                text: {
                    type: String,
                    required: true
                },
                avatar: String,
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
)

module.exports = Post = mongoose.model('Post', postSchema)