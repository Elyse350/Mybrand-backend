///src/models/Blog.ts model
import mongoose, { Schema, Document,Types } from 'mongoose';

export interface IBlog extends Document {
    _id: Types.ObjectId;
    title: string;
    category: string;
    description: string;
    // author: Types.ObjectId[];
    comments:Types.ObjectId[];
    likes:Types.ObjectId[]; // Change this to an array of ObjectId references
    dislikes:Types.ObjectId[]; // Change this to an array of ObjectId references
    updatedAt: Date;
}

const blogSchema: Schema = new Schema<IBlog>({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // author:[{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    likes:{
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        default: []
    },
    dislikes:{
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        default: []
    }
    },
    {timestamps: true});

const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;