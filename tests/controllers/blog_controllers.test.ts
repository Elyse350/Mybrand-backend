import request from 'supertest';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  editBlog,
  deleteBlog,
  postLike,
  postDislike,
  countLikes,
  countDislikes,
  countComments
} from '../../src/controllers/blog_controllers';
import Blog from '../../src/models/Blog';
import User from '../../src/models/User';

const app: Application = express();
app.use(express.json());

app.post('/blogs', createBlog);
app.get('/blogs', getAllBlogs);
app.get('/blogs/:id', getBlogById);
app.put('/blogs/:id', editBlog);
app.delete('/blogs/:id', deleteBlog);
app.post('/blogs/:blogId/like', postLike);
app.post('/blogs/:blogId/dislike', postDislike);
app.get('/blogs/:blogId/countLikes', countLikes);
app.get('/blogs/:blogId/countDislikes', countDislikes);
app.get('/blogs/:blogId/countComments', countComments);

jest.mock('../../src/models/Blog');
jest.mock('../../src/models/User');

const req = {
  body: { title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', id: 'testUserId' },
  cookies: { token: 'mockedTokenValue' } // Mock the cookies object
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Blog Controllers', () => {
  test('createBlog', async () => {
    const blog = { ...req.body, _id: 'testBlogId' };
    (Blog.prototype.save as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).post('/blogs').send(req.body);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Blog created successfully', blog });
  });

  test('getAllBlogs', async () => {
    const blogs = [{ title: 'Test Blog 1', content: 'This is test blog 1', imageURL: 'test1.jpg' }, { title: 'Test Blog 2', content: 'This is test blog 2', imageURL: 'test2.jpg' }];
    (Blog.find as jest.Mock).mockResolvedValue(blogs);
    const res = await request(app).get('/blogs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ allBlogs: 'All Blogs', blogs });
  });

  test('getBlogById', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg' };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).get('/blogs/testBlogId');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ blog });
  });

  test('editBlog', async () => {
    const blog = { ...req.body, _id: 'testBlogId' };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).put('/blogs/testBlogId').send(req.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Blog updated successfully', blog });
  });

  test('deleteBlog', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', author: 'testUserId' };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).delete('/blogs/testBlogId');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Blog deleted successfully' });
  });

  test('postLike', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', likes: [] };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).post('/blogs/testBlogId/like');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Like posted successfully' });
  });

  test('postDislike', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', dislikes: [] };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).post('/blogs/testBlogId/dislike');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Dislike posted successfully' });
  });

  test('countLikes', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', likes: ['userId1', 'userId2'] };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).get('/blogs/testBlogId/countLikes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ likes: 2 });
  });

  test('countDislikes', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', dislikes: ['userId1', 'userId2'] };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).get('/blogs/testBlogId/countDislikes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ dislikes: 2 });
  });

  test('countComments', async () => {
    const blog = { _id: 'testBlogId', title: 'Test Blog', content: 'This is a test blog', imageURL: 'test.jpg', comments: ['comment1', 'comment2'] };
    (Blog.findById as jest.Mock).mockResolvedValue(blog);
    const res = await request(app).get('/blogs/testBlogId/countComments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ comments: 2 });
  });
});
