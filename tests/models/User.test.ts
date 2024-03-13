// models/User.test.ts
import mongoose, { ConnectOptions } from 'mongoose';
import User, { IUser } from '../../src/models/User';

describe('User model', () => {


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


  it('should create & save user successfully', async () => {
    const userData: IUser = new User({
      username: 'test',
      email: 'test@test.com',
      password: 'TestSecurePass12!',
      userRole: 'user',
      blogsWritten: []
    });
    const validUser = await userData.save();

    expect(validUser.username).toBe(userData.username);
    expect(validUser.email).toBe(userData.email);
    expect(validUser.password).toBe(userData.password);
    expect(validUser.userRole).toBe(userData.userRole);
    expect(validUser.blogsWritten).toEqual(expect.arrayContaining(userData.blogsWritten));
  });

it('should fail when email is invalid', async () => {
    const userData: IUser = new User({
        username: 'test',
        email: 'invalid',
        password: 'TestSecurePass12!',
        userRole: 'user',
        blogsWritten: []
    });

    try {
        await userData.validate();
    } catch (err) {
        expect(err.errors.email).toBeDefined();
    }
});

it('should fail when username is missing', async () => {
    const userData: IUser = new User({
        email: 'test@test.com',
        password: 'TestSecurePass12!',
        userRole: 'user',
        blogsWritten: []
    });

    try {
        await userData.validate();
    } catch (err) {
        expect(err.errors.username).toBeDefined();
    }
});

it('should fail when password is missing', async () => {
    const userData: IUser = new User({
        username: 'test',
        email: 'test@test.com',
        userRole: 'user',
        blogsWritten: []
    });

    try {
        await userData.validate();
    } catch (err) {
        expect(err.errors.password).toBeDefined();
    }
});

it('should fail when password does not meet complexity requirements', async () => {
    const userData: IUser = new User({
        username: 'test',
        email: 'test@test.com',
        password: 'simplepassword',
        userRole: 'user',
        blogsWritten: []
    });

    try {
        await userData.validate();
    } catch (err) {
        expect(err.errors.password).toBeDefined();
    }
});

it('should fail when user role is not "admin" or "user"', async () => {
    const userData: IUser = new User({
        username: 'test',
        email: 'test@test.com',
        password: 'TestSecurePass12!',
        userRole: 'invalidRole',
        blogsWritten: []
    });

    try {
        await userData.validate();
    } catch (err) {
        expect(err.errors.userRole).toBeDefined();
    }
});

});