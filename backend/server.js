const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors());
app.use(express.json());

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Reddit API is working!',
    endpoints: {
      home: '/',
      diagnostic: '/api/diagnostic',
      debug_posts: '/api/debug/posts',
      all_posts: '/api/posts',
      single_post: '/api/posts/:id',
      sync: '/api/posts/sync'
    }
  });
});

// Ruta de diagnóstico completo
app.get('/api/diagnostic', async (req, res) => {
  try {
    console.log('🔍 Running diagnostic check...');
    
    // Test 1: Conexión básica
    const [test1] = await db.promise().query('SELECT 1 + 1 AS result');
    
    // Test 2: Contar posts
    const [test2] = await db.promise().query('SELECT COUNT(*) as count FROM posts');
    
    // Test 3: Obtener 3 posts
    const [test3] = await db.promise().query('SELECT id, title FROM posts ORDER BY created_utc DESC LIMIT 3');
    
    // Test 4: Ver estructura de la tabla
    const [test4] = await db.promise().query('DESCRIBE posts');
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      tests: {
        database_connection: test1[0].result === 2 ? '✅ OK' : '❌ FAILED',
        post_count: test2[0].count,
        sample_posts: test3,
        table_structure: test4
      },
      environment: {
        node_version: process.version,
        database: process.env.DB_NAME || 'not_set',
        database_host: process.env.DB_HOST || 'not_set',
        server_port: process.env.PORT || 5001
      },
      instructions: 'If posts_count > 0 but /api/posts fails, check postsController.js'
    });
  } catch (error) {
    console.error('Diagnostic error:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack,
      suggestion: 'Check MySQL connection and .env configuration'
    });
  }
});

// Ruta de prueba directa de la base de datos (simple)
app.get('/api/debug/posts', async (req, res) => {
  try {
    const [posts] = await db.promise().query('SELECT * FROM posts LIMIT 5');
    res.json({ 
      success: true, 
      count: posts.length,
      posts 
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta de prueba con paginación manual
app.get('/api/debug/posts-paginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    
    const query = `SELECT * FROM posts ORDER BY created_utc DESC LIMIT ${limit} OFFSET ${offset}`;
    const [posts] = await db.promise().query(query);
    
    const countQuery = 'SELECT COUNT(*) as total FROM posts';
    const [totalResult] = await db.promise().query(countQuery);
    const total = totalResult[0].total;
    
    res.json({
      success: true,
      query_used: query,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      query: error.sql
    });
  }
});

// Ruta de prueba para un post específico
app.get('/api/debug/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM posts WHERE id = '${id}'`;
    const [posts] = await db.promise().query(query);
    
    if (posts.length === 0) {
      return res.json({ 
        success: false, 
        error: 'Post not found',
        query_used: query 
      });
    }
    
    res.json({
      success: true,
      query_used: query,
      post: posts[0]
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      query: error.sql
    });
  }
});

// Importar y usar las rutas principales
const postsRoutes = require('./routes/posts');
app.use('/api/posts', postsRoutes);

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error.message);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    path: req.path
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Diagnostic available at: http://localhost:${PORT}/api/diagnostic`);
  console.log(`🔍 Debug endpoints available at: http://localhost:${PORT}/api/debug/`);
  console.log(`📝 Main API available at: http://localhost:${PORT}/api/posts`);
});