import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api, getImageUrl } from '../api/client';

interface Photo {
  id: number;
  title: string;
  description: string;
  date_taken: string;
  location: string;
  film_info: string;
  image_url: string;
}

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        if (!id) return;
        const data = await api.photos.getById(id);
        setPhoto(data);
      } catch (error) {
        console.error('Error fetching photo:', error);
        navigate('/');
      }
    };

    fetchPhoto();
  }, [id, navigate]);

  if (!photo) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Gallery
      </Button>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <img
              src={getImageUrl(photo.image_url)}
              alt={photo.title}
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              {photo.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {photo.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Date: {new Date(photo.date_taken).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Location: {photo.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Film: {photo.film_info}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PhotoDetail; 