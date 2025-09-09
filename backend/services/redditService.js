const axios = require('axios');
const db = require('../db');

class RedditService {
  async fetchPosts() {
    try {
      const response = await axios.get('https://www.reddit.com/r/programming.json');
      return response.data.data.children;
    } catch (error) {
      console.error('Error fetching from Reddit:', error);
      throw error;
    }
  }

  async storePosts(posts) {
    for (const postData of posts) {
      const post = postData.data;
      
      if (!post.id || !post.title) continue;
      
      const query = `
        INSERT INTO posts (id, title, author, created_utc, num_comments, score, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        title = VALUES(title), author = VALUES(author), num_comments = VALUES(num_comments),
        score = VALUES(score), url = VALUES(url)
      `;
      
      const values = [
        post.id,
        post.title || 'No title',
        post.author || 'Unknown',
        post.created_utc || 0,
        post.num_comments || 0,
        post.score || 0,
        post.url || ''
      ];
      
      try {
        await db.promise().execute(query, values);
      } catch (error) {
        console.error('Error storing post:', error.message);
      }
    }
  }
}

module.exports = new RedditService();