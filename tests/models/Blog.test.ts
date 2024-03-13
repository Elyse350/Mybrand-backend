//npm install --save-dev jest @types/jest ts-jest mongoose-mock-db
//npm i --save-dev @types/jest
// tests/models/Blog.test.ts
//npm install --save-dev ts-jest @types/jest
require('dotenv').config();
import mongoose from 'mongoose';
import Blog from '../../src/models/Blog';
const MONGODB_URI: string = process.env.MONGO_CONNECT_STRING!;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI)});
;

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Blog Model', () => {
  // test case for creating blog
  it('should create new Blog', async () => {
    const newBlog = await Blog.create({
      title: "Blog Title",
      content: "Blog Content",
      author: new mongoose.Types.ObjectId(),
      imageURL: 'https://example.com/image1.jpg',
      comments: [],
      likes: [],
    });
    expect(newBlog.title).toBe("Blog Title");
  });

  // test for finding blog by id
  it('should retrieve a blog by ID', async () => {
    const testBlog = await Blog.create({
      title: 'Test Blog 2',
      content: 'This is another test blog content',
      imageURL: 'https://example.com/image2.jpg',
      author: new mongoose.Types.ObjectId(),
      comments: [],
      likes: [],
      dislikes: [],
    });

    const retrievedBlog = await Blog.findById(testBlog._id);
    expect(retrievedBlog?.title).toEqual('Test Blog 2');
  });
});

// should retrieve all blogs

describe('Blog Model', () => {
    // Test case for retrieving all blogs
    it('should retrieve all blogs', async () => {
      const allBlogs = await Blog.find();
      expect(allBlogs.length).toBeGreaterThan(0);
    });
    });


    it('should update a blog', async () => {
        const testBlog = await Blog.create({
          title: 'Test Blog for Update',
          content: 'This is a test blog content for updating',
          imageURL: 'https://example.com/image-update.jpg',
          author: new mongoose.Types.ObjectId(),
          comments: [],
          likes: [],
          dislikes: []
        });

        await Blog.findByIdAndUpdate(testBlog._id, { title: 'Updated Title' });
        const updatedBlog = await Blog.findById(testBlog._id);
        expect(updatedBlog?.title).toEqual('Updated Title');
    });


  // Test case for deleting a blog
  it('should delete a blog', async () => {
    const testBlog = await Blog.create({
      title: 'Test Blog for Deletion',
      content: 'This is a test blog content for deletion',
      imageURL: 'https://example.com/image-delete.jpg',
      author: new mongoose.Types.ObjectId(),
      comments: [],
      likes: [],
      dislikes: []
    });

    await Blog.findByIdAndDelete(testBlog._id);
    const deletedBlog = await Blog.findById(testBlog._id);
    expect(deletedBlog).toBeNull();
  });

