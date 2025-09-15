const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Auth', () => {
  beforeAll(async () => {
    // ensure test DB configured in env for CI
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('registers & logs in', async () => {
    const u = { name: 'Test', email: 't1@example.com', password: 'Pass@123' };
    const r = await request(app).post('/api/auth/register').send(u).expect(201);
    const login = await request(app).post('/api/auth/login').send({ email: u.email, password: u.password }).expect(200);
    expect(login.body.token).toBeDefined();
  }, 20000);
});
