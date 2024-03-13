//models/Messages.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    content: string;
    date: Date;
}


const messageSchema: Schema = new Schema<IMessage>({
    content:{
        type: String,
        required: true,
        validate: {
            validator: function(v: string){
                return v.length <= 140;
            },
            message:(props:{value: string}) => `Message is too long`
        }
    },
    date:{
        type: Date,
        default: Date.now
    }
    },
    {timestamps: true});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;