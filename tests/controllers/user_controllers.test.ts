import request from 'supertest';
import express, { Application } from 'express';
import { registerUser, loginUser, getAllUsers, logoutUser } from '../../src/controllers/user_controllers';
import User from '../../src/models/User';

const app: Application = express();
app.use(express.json());

// Adjust routes to match the ones in your controller and Swagger definitions
app.post('/users/register', registerUser);
app.post('/users/login', loginUser);
app.get('/users', getAllUsers);
app.post('/users/logout', logoutUser);

jest.mock('../../src/models/User');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Controllers', () => {
  test('registerUser', async () => {
    const user = { username: 'test', email: 'test@test.com', password: 'TestSecurePass12!' };
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.prototype.save as jest.Mock).mockResolvedValue(user);

    const res = await request(app).post('/users/register').send(user);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'User registered successfully', user });
  });

  test('loginUser', async () => {
    const user = { email: 'test@test.com', password: 'TestSecurePass12!' };
    (User.findOne as jest.Mock).mockResolvedValue(user);

    const res = await request(app).post('/users/login').send(user);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User logged in successfully');
  });

  test('getAllUsers', async () => {
    const users = [{ username: 'test', email: 'test@test.com', password: 'test123' }];
    (User.find as jest.Mock).mockResolvedValue(users);

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ users });
  });

  test('logoutUser', async () => {
    const res = await request(app).post('/users/logout');

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User logged out successfully');
  });
});
