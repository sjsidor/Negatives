import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
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

const PhotoGrid = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        console.log('Fetching photos...');
        const data = await api.photos.getAll();
        console.log('Received photos:', data);
        if (data && data.length > 0) {
          console.log('First photo data:', data[0]);
          console.log('Image URL:', getImageUrl(data[0].image_url));
        }
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
        console.log('Loading state:', false);
        console.log('Photos state:', photos);
      }
    };

    fetchPhotos();
  }, []);

  console.log('Current photos state:', photos);
  console.log('Current loading state:', loading);

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        // Loading skeletons
        Array.from(new Array(3)).map((_, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ mt: 1 }}>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={150} />
            </Box>
          </Box>
        ))
      ) : photos.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            No photos yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your first photo to get started
          </Typography>
        </Box>
      ) : (
        <Box>
          {photos.map((photo) => {
            const imageUrl = getImageUrl(photo.image_url);
            console.log('Rendering photo:', photo);
            console.log('Image URL:', imageUrl);
            return (
              <Box
                key={photo.id}
                sx={{
                  mb: 4,
                  cursor: 'pointer',
                  '&:hover': {
                    '& .photo-title': {
                      opacity: 0.8,
                    },
                  },
                }}
                onClick={() => navigate(`/photo/${photo.id}`)}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={photo.title}
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    console.log('Attempted URL:', imageUrl);
                    console.log('Photo data:', photo);
                    console.log('Error details:', e.nativeEvent);
                  }}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <Box sx={{ mt: 2, textAlign: 'left' }}>
                  <Typography
                    className="photo-title"
                    variant="h6"
                    sx={{
                      mb: 0.5,
                      transition: 'opacity 0.2s ease-in-out',
                    }}
                  >
                    {photo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(photo.date_taken).toLocaleDateString()}
                    {photo.location && ` • ${photo.location}`}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default PhotoGrid; 