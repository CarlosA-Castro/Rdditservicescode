import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Chip,
  Container
} from '@mui/material';
import {
  Person as AuthorIcon,
  ThumbUp as ScoreIcon,
  Comment as CommentsIcon,
  Reddit as RedditIcon
} from '@mui/icons-material';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/posts?page=${currentPage}&limit=10`);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Datos de ejemplo 
      setPosts([
        {
          id: '1',
          title: 'Writing Code Is Easy: Reading It Isn\'t',
          author: 'Notarista',
          score: 116,
          num_comments: 34,
          url: 'https://www.reddit.com/r/programming/',
          created_utc: Date.now() / 1000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header mejorado con mejor contraste */}
      <AppBar position="static" sx={{ 
        bgcolor: '#ff4500', 
        background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
        boxShadow: 3
      }}>
        <Toolbar>
          <RedditIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold', 
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            Reddit App 
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Loading state */}
        {loading && (
          <Box textAlign="center" py={4}>
            <Typography>Cargando posts...</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {posts.map(post => (
            <Grid item xs={12} key={post.id}>
              <Card sx={{ 
                backgroundColor: '#fff', 
                boxShadow: 3,
                borderLeft: '4px solid #ff4500',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: '#1a1a1b',
                    lineHeight: 1.3,
                    fontSize: '1.1rem',
                    mb: 2
                  }}>
                    {post.title}
                  </Typography>

                  {/* Chips de información */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<AuthorIcon />}
                      label={`u/${post.author}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 'medium' }}
                    />
                    <Chip
                      icon={<ScoreIcon />}
                      label={`${formatNumber(post.score)} puntos`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    <Chip
                      icon={<CommentsIcon />}
                      label={`${formatNumber(post.num_comments)} comentarios`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Botones de acción */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<span>📖</span>}
                      component={Link}
                      to={`/post/${post.id}`}
                      sx={{
                        bgcolor: '#ff4500',
                        fontWeight: 'bold',
                        '&:hover': { 
                          bgcolor: '#ff5714',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Ver Artículo
                    </Button>
                    
                   <Button
                      variant="outlined"
                      startIcon={<CommentsIcon />}
                      component={Link}
                      to={`/post/${post.id}`}
                       onClick={(e) => {
                      e.preventDefault();
                      // Alerta temporal 
                      alert(`🗨️ Comentarios de: ${post.title}\n\n📊 Total: ${post.num_comments} comentarios\n\n👉 Ve al detalle del post y haz clic en "Ver Comentarios" para verlos todos`);
                    }}
                    sx={{
                      borderColor: '#ff4500',
                      color: '#ff4500',
                      fontWeight: 'medium',
                      '&:hover': { 
                        borderColor: '#ff5714',
                        bgcolor: 'rgba(255, 69, 0, 0.08)',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    Ver Comentarios
                  </Button>

                    <Button
                      variant="outlined"
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        ml: 'auto',
                        color: '#0079d3',
                        borderColor: '#0079d3',
                        '&:hover': {
                          bgcolor: 'rgba(0, 121, 211, 0.08)'
                        }
                      }}
                    >
                      🔗 Abrir en Reddit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Paginación */}
        {posts.length > 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={2}>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              sx={{ fontWeight: 'bold' }}
            >
              ← Anterior
            </Button>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 2,
              minWidth: 120,
              textAlign: 'center',
              boxShadow: 1,
              border: '1px solid #ff4500'
            }}>
              <Typography variant="body1" fontWeight="bold" color="#ff4500">
                Página {currentPage}
              </Typography>
              {pagination.total && (
                <Typography variant="caption" color="text.secondary">
                  de {Math.ceil(pagination.total / pagination.limit)}
                </Typography>
              )}
            </Box>

            <Button
              variant="outlined"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= (pagination.pages || 1) || loading}
              sx={{ fontWeight: 'bold' }}
            >
              Siguiente →
            </Button>
          </Box>
        )}

        {/* Footer de estadísticas */}
        {posts.length > 0 && (
          <Box textAlign="center" mt={3} p={2} bgcolor="white" borderRadius={2} boxShadow={1}>
            <Typography variant="body2" color="text.secondary">
              📊 Mostrando {posts.length} de {pagination.total} posts totales
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PostList;