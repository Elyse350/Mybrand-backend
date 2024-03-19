// routes/blog_routes.ts

import express from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import {
     createBlog, getAllBlogs, getBlogById,
     editBlog, deleteBlog,
     postDislike,
     postLike,
     countLikes,
     countDislikes,
     countComments
} from '../controllers/blog_controllers';
import { authMiddleWare } from '../controllers/user_controllers';

const router = express.Router();

interface UploadedFile extends Express.Multer.File { }

/**
 * @openapi
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         -  title
 *         -  content
 *         -  imageURL
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         content:
 *           type: string
 *           description: The title of your book
 *         imageURL:
 *           type: string
 *           description: The book explanation
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 */

/**
 * @swagger
 * tags:
 *  name: Blog
 *  description: The blog managing API
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Retrieve all blogs
 *     tags: [Blog]
 *     responses:
 *       '200':
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.get('/blogs', getAllBlogs);


/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Retrieve a single blog by id
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A single blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
router.get('/blogs/:id', getBlogById);



/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '200':
 *         description: A new blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */

// configure muler
const multerStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, './public/images/');
     },
     filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
     }
});
const multerFilter = (req: Request, file: UploadedFile, cb: Function) => {

     if (!file.originalname.match(/\.(png|jpg)$/)) {
          // upload only png and jpg format
          return cb(new Error('Please upload a Image'))
     }
     cb(null, true)

};

const upload = multer({
     storage: multerStorage,
     // fileFilter: multerFilter
});
router.post('/blogs', authMiddleWare, upload.single('image'), createBlog);



/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Edit a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '200':
 *         description: A blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */


router.put('/blogs/:id', authMiddleWare, editBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A blog is deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
router.delete('/blogs/:id', authMiddleWare, deleteBlog);



/**
 * @swagger
 * /blogs/{blogId}/like:
 *   post:
 *     summary: Like a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A blog is liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
router.post('/blogs/:blogId/like', authMiddleWare, postLike);


/**
 * @swagger
 * /blogs/{blogId}/dislike:
 *   post:
 *     summary: Dislike a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A blog is disliked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */

router.post('/blogs/:blogId/dislike', authMiddleWare, postDislike);


/**
 * @swagger
 * /blogs/{blogId}/countLikes:
 *   get:
 *     summary: Count likes of a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Number of likes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 */

router.get('/blogs/:blogId/countLikes', countLikes);


/**
 * @swagger
 * /blogs/{blogId}/countDislikes:
 *   get:
 *     summary: Count dislikes of a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Number of dislikes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 */
router.get('/blogs/:blogId/countDislikes', countDislikes);

/**
 * @swagger
 * /blogs/{blogId}/countComments:
 *   get:
 *     summary: Count comments of a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Number of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 */
router.get('/blogs/:blogId/countComments', countComments);


export default router;


