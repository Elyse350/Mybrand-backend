// models/User.ts model
import mongoose, { Schema, Document,Types } from 'mongoose';
export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    userRole: string;
    blogsWritten:Types.ObjectId[];
}

const userSchema: Schema = new Schema<IUser>({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v: string){
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message:(props:{value: string}) => `${props.value} is not a valid email`
        }
    },

    password:{
        type: String,
        required: true,
        validate: {
            validator: function(v: string){
                return /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>?])(?=.*\d).{8,}$/.test(v);
            },
            message:(props:{value: string}) => `Password should contain minimum eight characters, at least one letter and one number`
        }


    },
    userRole:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    blogsWritten:[{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }]
    },
    {timestamps: true});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
