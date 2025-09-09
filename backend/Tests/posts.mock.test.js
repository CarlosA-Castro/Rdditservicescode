const request = require('supertest');
const express = require('express');
const postsRouter = require('../routes/posts');

// Mock de la base de datos
jest.mock('../db', () => ({
  promise: () => ({
    query: jest.fn()
      .mockResolvedValueOnce([[{ id: 1, title: 'Test Post' }], []]) // Para posts
      .mockResolvedValueOnce([[{ total: 1 }], []]) // Para count
  })
}));

const app = express();
app.use(express.json());
app.use('/api/posts', postsRouter);

describe('Posts API Tests with Mocks', () => {
  test('GET /api/posts should return 200 with mock data', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('posts');
    expect(response.body).toHaveProperty('pagination');
  });

  test('GET /api/posts?author=test should work with filters', async () => {
    const response = await request(app).get('/api/posts?author=test');
    expect(response.status).toBe(200);
  });
});