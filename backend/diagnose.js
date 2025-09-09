const db = require('./db');

console.log('=== DIAGNÓSTICO BASE DE DATOS ===');

// 1. Probar conexión
db.execute('SELECT 1 + 1 as test', (error, results) => {
  console.log('1. Test conexión:', error ? 'ERROR: ' + error.message : 'OK - Result: ' + results[0].test);
});

// 2. Verificar si la tabla posts existe
db.execute('SHOW TABLES LIKE "posts"', (error, results) => {
  console.log('2. Tabla posts existe:', error ? 'ERROR: ' + error.message : (results.length > 0 ? 'SÍ' : 'NO'));
});

// 3. Verificar estructura de la tabla posts
db.execute('DESCRIBE posts', (error, results) => {
  console.log('3. Estructura tabla posts:', error ? 'ERROR: ' + error.message : 'OK - ' + results.length + ' columnas');
});

// 4. Contar posts
db.execute('SELECT COUNT(*) as count FROM posts', (error, results) => {
  console.log('4. Total posts:', error ? 'ERROR: ' + error.message : results[0].count);
});

// 5. Probar consulta específica que falla
db.execute('SELECT * FROM posts ORDER BY created_utc DESC LIMIT 10 OFFSET 0', (error, results) => {
  console.log('5. Consulta posts:', error ? 'ERROR: ' + error.message : 'OK - ' + results.length + ' resultados');
  
  // Cerrar conexión después de 2 segundos
  setTimeout(() => {
    db.end();
    console.log('=== DIAGNÓSTICO COMPLETADO ===');
  }, 2000);
});
