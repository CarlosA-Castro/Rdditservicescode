const db = require('./db');

console.log('🔍 Testing MySQL connection...');

// Test simple de conexión
db.promise().query('SELECT 1 + 1 AS result')
  .then(([results]) => {
    console.log('✅ MySQL connection test PASSED:', results[0]);
    
    // Test adicional: verificar si la tabla posts existe
    return db.promise().query('SHOW TABLES LIKE "posts"');
  })
  .then(([tables]) => {
    if (tables.length > 0) {
      console.log('✅ Table "posts" exists');
      
      // Contar posts en la tabla
      return db.promise().query('SELECT COUNT(*) as count FROM posts');
    } else {
      console.log('❌ Table "posts" does not exist');
      process.exit(1);
    }
  })
  .then(([countResult]) => {
    console.log(`📊 Total posts in database: ${countResult[0].count}`);
    
    // Mostrar algunos posts de ejemplo
    return db.promise().query('SELECT id, title FROM posts ORDER BY created_utc DESC LIMIT 3');
  })
  .then(([posts]) => {
    console.log('📝 Latest posts:');
    posts.forEach(post => {
      console.log(`   - ${post.id}: ${post.title}`);
    });
  })
  .catch(error => {
    console.error('❌ MySQL connection test FAILED:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  });