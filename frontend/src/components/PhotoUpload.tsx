import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { api } from '../api/client';

const PhotoUpload = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    film_info: '',
    date_taken: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    const submitData = new FormData();
    submitData.append('photo', file);
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    try {
      await api.photos.upload(submitData);
      navigate('/');
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: { xs: 2, sm: 3 },
        maxWidth: 600,
        mx: 'auto',
        mt: { xs: 2, sm: 4 },
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Upload New Photo
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.light',
                },
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Select Photo
                </Button>
                {file && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {file.name}
                  </Typography>
                )}
              </label>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Film Information"
              name="film_info"
              value={formData.film_info}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date Taken"
              name="date_taken"
              type="date"
              value={formData.date_taken}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!file || uploading}
              sx={{ height: 48 }}
            >
              {uploading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Upload Photo'
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PhotoUpload; 