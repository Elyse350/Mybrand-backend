// controllers/comment_controllers.ts

import express, { Request, Response } from 'express';
import Comment from '../models/Comment';
import { CustomRequest } from './user_controllers';
import Blog from '../models/Blog';

// Create a comment (accessible by authenticated users)
export const createComment = async (req: CustomRequest, res: Response) => {
    try {
        const { content } = req.body;
        const newComment = new Comment({
            content,
            commentor: req.id, // Set the commentor as the logged-in user
            blog: req.params.blogId // Use the blog ID from req.params
        });
        await newComment.save();
        // Push the new comment's ID to the comments array in the blog
        const blogId = req.params.blogId;
        await Blog.findByIdAndUpdate(blogId, { $push: { comments: newComment._id } });

        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Get comments for a specific blog (accessible by anyone)
export const getCommentsByBlogId = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId }).populate('commentor');
        res.status(200).json({ comments });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a comment (accessible by authenticated users with authorization)
export const deleteComment = async (req: CustomRequest, res: Response) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Check if the user is authorized to delete the comment
        if (comment.commentor.toString() !== req.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
        await Comment.deleteOne({ _id: comment._id });
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
