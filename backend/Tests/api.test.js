const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());

// Mock simple sin base de datos
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test endpoint works' });
});

app.post('/api/test-post', (req, res) => {
  res.json({ received: req.body, success: true });
});

// Mock de posts sin MySQL
app.get('/api/posts-test', (req, res) => {
  const mockPosts = [
    { id: 1, title: 'Test Post 1', author: 'testuser' },
    { id: 2, title: 'Test Post 2', author: 'testuser' }
  ];
  res.json({ 
    posts: mockPosts, 
    pagination: { page: 1, limit: 10, total: 2, pages: 1 }
  });
});

describe('API Basic Tests', () => {
  test('GET /api/test should return 200', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Test endpoint works');
  });

  test('POST /api/test-post should return request body', async () => {
    const testData = { username: 'test', password: 'test123' };
    const response = await request(app)
      .post('/api/test-post')
      .send(testData);
    
    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(testData);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/posts-test should return mock posts', async () => {
    const response = await request(app).get('/api/posts-test');
    expect(response.status).toBe(200);
    expect(response.body.posts.length).toBe(2);
    expect(response.body.pagination.total).toBe(2);
  });
});