//models/ user_routes.ts

import { Router } from 'express';
import { registerUser,
     loginUser,
     getAllUsers,
     logoutUser

} from '../controllers/user_controllers';


const router = Router();
export default router;
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         -  username
 *         -  email
 *         -  password
 *       properties:
 *         username:
 *           type: string
 *           description: The firstname of user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: the password
 *         userRole:
 *           type: string
 *           description: the role of the user
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: CRUD operations for users
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: A new user registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/users/register', registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/users/login',loginUser);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users',getAllUsers);



/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/users/logout',logoutUser);









