// // routes/comment_routes.ts

// import express from 'express';
// import { createComment, getCommentsByBlogId, deleteComment } from '../controllers/comments_controllers';
// import { authMiddleWare } from '../controllers/user_controllers';

// const router = express.Router();

// // Create a comment (accessible by authenticated users)
// router.post('/comments/:blogId', authMiddleWare, createComment); // Use blogId from req.params

// // Get comments for a specific blog (accessible by anyone)
// router.get('/comments/:blogId', getCommentsByBlogId);

// // Delete a comment (accessible by authenticated users with authorization)
// router.delete('/comments/:id', authMiddleWare, deleteComment);

// export default router;



// routes/comment_routes.ts

import express from 'express';
import { createComment, getCommentsByBlogId, deleteComment } from '../controllers/comments_controllers';
import { authMiddleWare } from '../controllers/user_controllers';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: API endpoints for managing comments
 */

/**
 * @swagger
 * /comments/{blogId}:
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id to which the comment belongs
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *     responses:
 *       '200':
 *         description: Comment created successfully
 *   get:
 *     summary: Get comments for a specific blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The blog id for which to retrieve comments
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.route('/comments/:blogId')
  .post(authMiddleWare, createComment)
  .get(getCommentsByBlogId);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The comment id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 */
router.delete('/comments/:id', authMiddleWare, deleteComment);

export default router;
