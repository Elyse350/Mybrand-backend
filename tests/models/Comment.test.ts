// models/Blog.test.ts
import mongoose, { ConnectOptions } from 'mongoose';
import Blog, { IBlog } from '../../src/models/Blog';

describe('Blog model', () => {

    beforeAll(async () => {
        const options: ConnectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        } as ConnectOptions;
        await mongoose.connect(global.__MONGO_URI__, options);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create & save blog successfully', async () => {
        const blogData: IBlog = new Blog({
            title: 'Test Blog',
            content: 'This is a test blog content.',
            imageURL: 'https://example.com/image.jpg',
            author: [],
            comments: [],
            likes: [],
            dislikes: []
        });
        const validBlog = await blogData.save();

        expect(validBlog.title).toBe(blogData.title);
        expect(validBlog.content).toBe(blogData.content);
        expect(validBlog.imageURL).toBe(blogData.imageURL);
        expect(validBlog.author).toEqual(expect.arrayContaining(blogData.author));
        expect(validBlog.comments).toEqual(expect.arrayContaining(blogData.comments));
        expect(validBlog.likes).toEqual(expect.arrayContaining(blogData.likes));
        expect(validBlog.dislikes).toEqual(expect.arrayContaining(blogData.dislikes));
    });

    it('should fail when title is missing', async () => {
        const blogData: IBlog = new Blog({
            content: 'This is a test blog content.',
            imageURL: 'https://example.com/image.jpg',
            author: [],
            comments: [],
            likes: [],
            dislikes: []
        });

        try {
            await blogData.validate();
        } catch (err) {
            expect(err.errors.title).toBeDefined();
        }
    });

    it('should fail when content is missing', async () => {
        const blogData: IBlog = new Blog({
            title: 'Test Blog',
            imageURL: 'https://example.com/image.jpg',
            author: [],
            comments: [],
            likes: [],
            dislikes: []
        });

        try {
            await blogData.validate();
        } catch (err) {
            expect(err.errors.content).toBeDefined();
        }
    });

    it('should fail when imageURL is missing', async () => {
        const blogData: IBlog = new Blog({
            title: 'Test Blog',
            content: 'This is a test blog content.',
            author: [],
            comments: [],
            likes: [],
            dislikes: []
        });

        try {
            await blogData.validate();
        } catch (err) {
            expect(err.errors.imageURL).toBeDefined();
        }
    });
});
