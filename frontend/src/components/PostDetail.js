import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  OpenInNew as OpenIcon,
  Person as AuthorIcon,
  ThumbUp as ScoreIcon,
  Comment as CommentsIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(true);
  const [showComments, setShowComments] = useState(false);

  
  useEffect(() => {
    if (location.state?.showComments) {
      setShowComments(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/posts/${id}`);
        setPost(response.data);
        setApiConnected(true);
      } catch (error) {
        console.error('Error fetching post:', error);
        setApiConnected(false);
        
       
        setPost({
          id: id,
          title: 'Writing Code Is Easy: Reading It Isn\'t',
          author: 'Notarista',
          score: 116,
          num_comments: 34,
          url: 'https://www.reddit.com/r/programming/',
          created_utc: Date.now() / 1000,
          selftext: 'This article discusses the importance of code readability and maintainability. Good code is not just about making it work, but about making it understandable for other developers and your future self.',
          subreddit: 'programming'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: '#ff4500' }}>
          <Toolbar>
            <Button 
              color="inherit" 
              startIcon={<BackIcon />} 
              onClick={() => navigate('/')}
            >
              Volver
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}>
              Cargando artículo...
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} sx={{ color: '#ff4500' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ 
        bgcolor: '#ff4500',
        background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)'
      }}>
        <Toolbar>
          <Button 
            color="inherit" 
            startIcon={<BackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
            {showComments ? '💬 Comentarios' : 'Detalle del Artículo'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {showComments ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Funcionalidad de comentarios en desarrollo. Próximamente...
            </Alert>
            <Button 
              variant="outlined" 
              onClick={() => setShowComments(false)}
              startIcon={<BackIcon />}
            >
              Volver al artículo
            </Button>
          </Box>
        ) : (
          <Card sx={{ 
            backgroundColor: '#fff', 
            boxShadow: 3,
            borderLeft: '4px solid #ff4500'
          }}>
            <CardContent>
              {/* Header del post */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  color: '#1a1a1b',
                  lineHeight: 1.2,
                  fontSize: '1.8rem'
                }}>
                  {post.title}
                </Typography>

                {/* Chips de información */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<AuthorIcon />}
                    label={`Autor: ${post.author}`}
                    variant="outlined"
                  />
                  <Chip
                    icon={<ScoreIcon />}
                    label={`Score: ${post.score}`}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    icon={<CommentsIcon />}
                    label={`Comentarios: ${post.num_comments}`}
                    variant="outlined"
                  />
                  <Chip
                    icon={<DateIcon />}
                    label={formatDate(post.created_utc)}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Contenido del post */}
              {post.selftext && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff4500' }}>
                    Contenido:
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    lineHeight: 1.6,
                    p: 2,
                    bgcolor: '#f9f9f9',
                    borderRadius: 1,
                    borderLeft: '3px solid #ff4500'
                  }}>
                    {post.selftext}
                  </Typography>
                </Box>
              )}

              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<OpenIcon />}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: '#ff4500',
                    '&:hover': { bgcolor: '#ff5714' }
                  }}
                >
                  Ver en Reddit
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CommentsIcon />}
                  onClick={() => {
                    alert(`🗨️ Comentarios de: ${post.title}\n\n📊 Total: ${post.num_comments} comentarios\n\n🔮 Esta función se implementará completamente en la próxima versión`);
                  }}
                  sx={{
                    borderColor: '#ff4500',
                    color: '#ff4500',
                    '&:hover': { 
                      borderColor: '#ff5714',
                      bgcolor: 'rgba(255, 69, 0, 0.04)'
                    }
                  }}
                >
                  Ver Comentarios ({post.num_comments})
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Volver al Listado
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Solo mostrar alerta si realmente hay error de conexión */}
        {!apiConnected && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Modo demostración:</strong> Usando datos de ejemplo. El backend no está conectado.
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default PostDetail;