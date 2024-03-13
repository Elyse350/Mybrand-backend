// controllers/message_controllers.ts

import express, { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import { CustomRequest } from './user_controllers';

// Send a message (accessible by authenticated users)
export const sendMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { content } = req.body;
        const newMessage = new Message({
            content
        });
        await newMessage.save();
        res.status(201).json({ status: 'Message sent successfully',message:newMessage });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// View all messages (accessible by admin only)
export const viewMessages = async (req: CustomRequest, res: Response) => {
    try {
        // Check if the user is an admin
        const user = await User.findById(req.id);
        if (!user || user.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admin can view messages' });
        }
        const messages = await Message.find();
        res.status(200).json({ messages });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a message (accessible by admin only)
export const deleteMessage = async (req: CustomRequest, res: Response) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if the user is an admin
        const user = await User.findById(req.id);
        if (!user || user.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete messages' });
        }
        await Message.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
