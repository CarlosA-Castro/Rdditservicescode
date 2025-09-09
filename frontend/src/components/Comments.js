import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

const Comments = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5001/api/posts/${postId}/comments`);
      
      if (response.data.success) {
        setPost(response.data.post);
        setComments(response.data.comments);
      } else {
        setError('Error al cargar comentarios');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          💬 Comentarios de: {post?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {comments.length} comentarios
        </Typography>
        <Button onClick={onClose} sx={{ mt: 1 }} variant="outlined">
          ← Volver al post
        </Button>
      </Box>

      {/* Lista de comentarios */}
      <Box sx={{ maxHeight: '60vh', overflowY: 'auto', p: 1 }}>
        {comments.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            No hay comentarios para mostrar
          </Typography>
        ) : (
          comments.map(comment => (
            <Card key={comment.id} sx={{ mb: 1.5, bgcolor: '#ffffff' }}>
              <CardContent>
                {/* Header del comentario */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#ff4500' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      u/{comment.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.created_utc)}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<LikeIcon />}
                    label={comment.score}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Contenido del comentario */}
                <Typography variant="body2" sx={{ lineHeight: 1.4, mb: 1 }}>
                  {comment.body}
                </Typography>

                {/* Respuestas */}
                {comment.replies > 0 && (
                  <Chip
                    icon={<CommentIcon />}
                    label={`${comment.replies} respuestas`}
                    size="small"
                    variant="filled"
                    sx={{ bgcolor: '#e3f2fd' }}
                  />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Comments;