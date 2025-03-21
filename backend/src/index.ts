import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { photosRouter } from './routes/photos';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "*"],
    },
  },
}));
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Create a cache directory for converted images
const cacheDir = path.join(__dirname, '../cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

// Custom middleware to handle TIFF files
app.use('/uploads', async (req, res, next) => {
  console.log('\n=== Processing Image Request ===');
  console.log('Request path:', req.path);
  const filePath = path.join(__dirname, '../uploads', req.path);
  console.log('Full file path:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return next();
  }
  
  // Get file type using file command
  const { execSync } = require('child_process');
  try {
    const fileType = execSync(`file "${filePath}"`).toString().trim();
    console.log('File type:', fileType);
    
    // If it's a TIFF file, convert it
    if (fileType.includes('TIFF')) {
      const cachePath = path.join(cacheDir, `${path.basename(filePath, path.extname(filePath))}.jpg`);
      console.log('Cache path:', cachePath);
      console.log('Cache exists:', fs.existsSync(cachePath));
      
      // Check if converted file exists in cache
      if (fs.existsSync(cachePath)) {
        console.log('Using cached version');
        res.set('Content-Type', 'image/jpeg');
        res.sendFile(cachePath);
        return;
      }
      
      try {
        console.log('Converting TIFF to JPEG...');
        // Convert TIFF to JPEG
        await sharp(filePath)
          .jpeg({ quality: 90 })
          .toFile(cachePath);
        
        console.log('Conversion successful');
        res.set('Content-Type', 'image/jpeg');
        res.sendFile(cachePath);
        return;
      } catch (error) {
        console.error('Error converting TIFF:', error);
        res.status(500).send('Error processing image');
        return;
      }
    } else {
      // For other image types, set the correct content type
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      };
      
      if (contentTypes[ext]) {
        res.set('Content-Type', contentTypes[ext]);
      }
      
      console.log('Setting content type:', contentTypes[ext] || 'application/octet-stream');
      next();
    }
  } catch (error) {
    console.error('Error checking file type:', error);
    next();
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set content type based on extension
    const contentTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };

    if (contentTypes[ext]) {
      res.set('Content-Type', contentTypes[ext]);
    }
  }
}));

// Serve static files from the public directory (frontend build)
const staticDir = process.env.STATIC_DIR || path.join(__dirname, '../public');
app.use(express.static(staticDir));

// API routes
app.use('/api/photos', photosRouter);

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.sendFile(path.join(staticDir, 'index.html'));
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Static files being served from: ${staticDir}`);
}); 