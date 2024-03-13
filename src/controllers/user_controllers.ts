// controllers/user_controllers.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import IUser from '../models/User'









// register a new user

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully',
            user: newUser });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
}


// login user

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
        res.cookie('token', token,{httpOnly:true});
        res.status(200).json({ message: 'User logged in successfully',user,token });
     

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// user auth.

// npm i --save-dev @types/express-session
//npm i --save-dev @types/cookie-parser

export interface CustomRequest extends Request {
  id?: string; // Add the 'id' property here
}

export const authMiddleWare = async (req: CustomRequest, res: Response, next: NextFunction) => {
const token=req.cookies.token;
if(!token){
    return res.status(401).json({message:'Unauthorized'});
}
try{
  const data = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {id:string};
  req.id=data.id;
  next(); 
} catch(error:any){
  res.status(401).json({message:'Unauthorized'});
}
}


// get all users

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export const logoutUser = async (req: CustomRequest, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({message:'User logged out successfully'});
    }