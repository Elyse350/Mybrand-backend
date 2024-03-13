require('dotenv').config();
import mongoose from 'mongoose';
import Message, { IMessage } from '../../src/models/Message';
const MONGODB_URI: string = process.env.MONGO_CONNECT_STRING!;

describe('Message Model', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new message', async () => {
    const messageData = {
      content: 'This is a test message.',
      date: new Date(),
    };
  
    const newMessage = await Message.create(messageData);
    expect(newMessage.content).toBe(messageData.content);
    expect(newMessage.date).toEqual(messageData.date);
  });
  

  it('should not create a message with content longer than 140 characters', async () => {
    const longContent = 'a'.repeat(141);
    const messageData = {
      content: longContent,
      date: new Date()
    };

    try {
      await Message.create(messageData);
    } catch (error:any) {
      expect(error.message).toContain('Message is too long');
    }
  });
});
