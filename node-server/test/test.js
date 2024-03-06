const request = require('supertest');
const app = require('../server');

describe('GET /getuser/:email/:pwd', () => {
  test('responds with JSON containing a user', async () => {
    const response = await request(app)
      .get('/getuser/heunambiafeng@gmail.com/test'); // Adjust email and password as needed
    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual({"email": "heunambiafeng@gmail.com",
    id: 1, 
    last_connexion: null, 
    name: "heuna", 
    password: "test", 
    phone_number: "0620853715", 
    response: "FOUND", 
    surname: "steeve", 
    user_type: "client"});
  });

  test('responds with JSON for non-existing user', async () => {
    const response = await request(app)
      .get('/getuser/nonexistingemail@example.com/wrongpassword');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ response: 'NOT FOUND' });
  });
});

describe('POST /createuser/', () => {
  test('creates a new user', async () => {
    const newUser = {
      email: "test@example.com",
      password: "test",
      user_type: "client",
      name: "John",
      surname: "Doe",
      phone_number: "0628653717"
    };
    const response = await request(app)
      .post('/createuser/')
      .send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "User added",
      user_status: "created"
    });
  });

  test('fails to create user if email already exists', async () => {
    const existingUser = {
      email: "test@example.com",
      password: "test",
      user_type: "client",
      name: "John",
      surname: "Doe",
      phone_number: "0628653717"
    };
    const response = await request(app)
      .post('/createuser/')
      .send(existingUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: false,
      message: "User already exists",
      user_status: "created"
    });
  });

  test('delete user in database', async () => {
    const User = {
      email: "test@example.com"
    };
    const response = await request(app)
      .post('/deleteuser/')
      .send(User);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, numRowsDeleted: 1 });
  });
});
