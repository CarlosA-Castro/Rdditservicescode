const redditService = require('../services/redditService');
const db = require('../db');

const postsController = {
  async getPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      console.log(`📡 Fetching posts - Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

      
      const query = `SELECT * FROM posts ORDER BY created_utc DESC LIMIT ${limit} OFFSET ${offset}`;
      console.log('Executing query:', query);
      
      const [posts] = await db.promise().query(query);
      
      const countQuery = 'SELECT COUNT(*) as total FROM posts';
      const [totalResult] = await db.promise().query(countQuery);
      const total = totalResult[0].total;
      
      console.log(`✅ Found ${posts.length} posts, total: ${total}`);
      
      res.json({
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('❌ Error fetching posts:', error.message);
      console.error('Error details:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        sql: error.sql
      });
    }
  },

  async getPost(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔍 Fetching post with ID: ${id}`);
      
      // SOLUCIÓN: Sin parámetros preparados
      const query = `SELECT * FROM posts WHERE id = '${id}'`;
      console.log('Executing query:', query);
      
      const [posts] = await db.promise().query(query);
      
      if (posts.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json(posts[0]);
    } catch (error) {
      console.error('❌ Error fetching post:', error.message);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  async getPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // ✅ NUEVO: Parámetros de filtro
    const { author, min_score, min_comments, search } = req.query;
    
    let query = 'SELECT * FROM posts WHERE 1=1';
    let params = [];

    // 🔍 Filtro por autor
    if (author) {
      query += ' AND author LIKE ?';
      params.push(`%${author}%`);
    }

    // ⭐ Filtro por score mínimo
    if (min_score) {
      query += ' AND score >= ?';
      params.push(parseInt(min_score));
    }

    // 💬 Filtro por comentarios mínimos
    if (min_comments) {
      query += ' AND num_comments >= ?';
      params.push(parseInt(min_comments));
    }

    // 🔎 Búsqueda en título
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_utc DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await db.promise().query(query, params);
    
    // Contar total con mismos filtros
    let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE 1=1';
    let countParams = [];
    
    if (author) {
      countQuery += ' AND author LIKE ?';
      countParams.push(`%${author}%`);
    }
    if (min_score) {
      countQuery += ' AND score >= ?';
      countParams.push(parseInt(min_score));
    }
    if (min_comments) {
      countQuery += ' AND num_comments >= ?';
      countParams.push(parseInt(min_comments));
    }
    if (search) {
      countQuery += ' AND title LIKE ?';
      countParams.push(`%${search}%`);
    }

    const [totalResult] = await db.promise().query(countQuery, countParams);
    const total = totalResult[0].total;
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        filters: { author, min_score, min_comments, search } // ✅ Nuevo
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  },

  async syncWithReddit(req, res) {
    try {
      console.log('🔄 Starting Reddit sync...');
      const posts = await redditService.fetchPosts();
      await redditService.storePosts(posts);
      
      res.json({ 
        message: 'Sync completed successfully', 
        count: posts.length 
      });
    } catch (error) {
      console.error('❌ Error syncing with Reddit:', error.message);
      res.status(500).json({ 
        error: 'Failed to sync with Reddit',
        message: error.message
      });
    }
  }
};

module.exports = postsController;