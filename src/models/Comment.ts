// models/Comment.ts model

import mongoose, { Schema, Document,Types } from 'mongoose';
import Blog from './Blog'

interface IComment extends Document {
    content: string;
    commentor:Types.ObjectId;
    blog:Types.ObjectId;
    date_of_comment:Date;
} 


const commentSchema: Schema = new Schema<IComment>({
    content:{
        type: String,
        required: true
    },
    blog:{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    commentor:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date_of_comment:{
        type: Date,
        default: Date.now
    }
    },
    {timestamps: true});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;