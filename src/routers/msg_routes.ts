// // routes/message_routes.ts

// import express from 'express';
// import { sendMessage, viewMessages, deleteMessage } from '../controllers/messagesCtrl';
// import { authMiddleWare } from '../controllers/user_controllers';

// const router = express.Router();

// // Send a message (accessible by authenticated users)
// router.post('/messages', authMiddleWare, sendMessage);

// // View all messages (accessible by admin only)
// router.get('/messages', authMiddleWare, viewMessages);

// // Delete a message (accessible by admin only)
// router.delete('/messages/:id', authMiddleWare, deleteMessage);

// export default router;




// routes/message_routes.ts

import express from 'express';
import { sendMessage, viewMessages, deleteMessage } from '../controllers/messagesCtrl';
import { authMiddleWare } from '../controllers/user_controllers';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: API endpoints for managing messages
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
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
 *         description: Message sent successfully
 *   get:
 *     summary: View all messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.route('/messages')
  .post(authMiddleWare, sendMessage)
  .get(authMiddleWare, viewMessages);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The message id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 */
router.delete('/messages/:id', authMiddleWare, deleteMessage);

export default router;

