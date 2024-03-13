//models/blog_controllers.ts

import express, {Request,Response,Application,NextFunction} from 'express';
import Blog from '../models/Blog';
import User from '../models/User';
import {CustomRequest} from './user_controllers';
import mongoose from 'mongoose';


//create blog
export const createBlog = async (req: CustomRequest, res: Response) => {
    try {
        const { title, content, imageURL } = req.body;
        const newBlog = new Blog({
            title,
            content,
            imageURL,
            author: req.id // Use the logged-in user's ID as the author
        });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// get all blogs

export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({
            allBlogs:"All Blogs", 
            blogs });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// get blog by Id

export const getBlogById = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ blog });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// edit blog (only by Admin)

export const editBlog = async (req: CustomRequest, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        // Check if the user is an admin
        const user = await User.findById(req.id);
        if (!user || user.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admin can edit blogs' });
        }
        // Update the blog
        const { title, content, imageURL } = req.body;
        blog.title = title;
        blog.content = content;
        blog.imageURL = imageURL;
        await blog.save();
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a blog (accessible by the author or admin only)

export const deleteBlog = async (req: CustomRequest, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const user = await User.findById(req.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        // Check if the user is the author or an admin
        if (blog.author.toString() !== req.id && (!user || user.userRole !== 'admin')) {
            return res.status(403).json({ message: 'You are not authorized to delete this blog' });
        }
        await Blog.deleteOne({ _id: blog._id });
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const postLike = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.id; // Get the user ID from the authenticated request
      const blogId = req.params.blogId;
  
      if (!userId) {
        return res.status(400).json({ message: 'Missing user ID' });
      }
  
      // Ensure both user ID and blog ID are valid ObjectIds
      const validUserId = new mongoose.Types.ObjectId(userId);
      const validBlogId = new mongoose.Types.ObjectId(blogId);
  
      // Find the blog and user
      const blog = await Blog.findById(validBlogId);
      const user = await User.findById(validUserId);
  
      if (!blog || !user) {
        return res.status(404).json({ message: 'Blog or user not found' });
      }
  
      // Check if the user has already liked the blog
      if (blog.likes.includes(validUserId)) {
        
        //update likes
        await Blog.findByIdAndUpdate(validBlogId, { $push: { likes: validUserId } });

        return res.status(400).json({ message: 'User has already liked the blog' });
      }
  
      // Add the user's id to the likes array of the blog
      blog.likes.push(validUserId);
      await blog.save();
  
      res.status(200).json({ message: 'Like posted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  





// Post a dislike for a specific blog (accessible by authenticated users)
export const postDislike = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.id; // Get the user ID from the authenticated request
        const blogId = req.params.blogId;   
        
        if (!userId) {
            return res.status(400).json({ message: 'Missing user ID' });
          }

          
      // Ensure both user ID and blog ID are valid ObjectIds
      const validUserId = new mongoose.Types.ObjectId(userId);
      const validBlogId = new mongoose.Types.ObjectId(blogId);
  
      // Find the blog and user
      const blog = await Blog.findById(validBlogId);
      const user = await User.findById(validUserId);
        
        if (!blog || !user) {
            return res.status(404).json({ message: 'Blog or user not found' });
        }
        
    
        
        // Check if the user has already disliked the blog
        if (blog.dislikes.includes(validUserId)) {
            // update dislikes
            await Blog.findByIdAndUpdate(validBlogId, { $push: { dislikes: validUserId } });

            return res.status(400).json({ message: 'User has already disliked the blog' });
        }
        
        // Add the user's id to the dislikes array of the blog
        blog.dislikes.push(validUserId);
        await blog.save();
        
        res.status(200).json({ message: 'Dislike posted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


// count likes for specific blog

export const countLikes = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ likes: blog.likes.length });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// count dislikes

export const countDislikes = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const dislikeCount=blog.dislikes.length;
        res.status(200).json({ dislikes: dislikeCount });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


// count comments per blog

export const countComments = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const commentCount=blog.comments.length;
        res.status(200).json({ comments: commentCount });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}