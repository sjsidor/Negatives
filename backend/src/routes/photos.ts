import express from 'express';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Storage } from '@google-cloud/storage';
import { db } from '../db';
import { Photo } from '../types';

export const photosRouter = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Get all photos
photosRouter.get('/', async (req, res) => {
  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    });

    const result = await pool.query('SELECT * FROM photos ORDER BY date_taken DESC');
    await pool.end();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Get a single photo
photosRouter.get('/:id', async (req, res) => {
  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    });

    const result = await pool.query('SELECT * FROM photos WHERE id = $1', [req.params.id]);
    await pool.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// Upload a new photo
photosRouter.post('/', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Save to database
    const pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    });

    const result = await pool.query(
      'INSERT INTO photos (title, description, date_taken, location, film_info, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        req.body.title,
        req.body.description,
        req.body.date_taken,
        req.body.location,
        req.body.film_info,
        `/uploads/${req.file.filename}`, // Store local file path
      ]
    );

    await pool.end();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Delete a photo
photosRouter.delete('/:id', async (req, res) => {
  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    });

    // Get the photo URL first
    const photoResult = await pool.query('SELECT image_url FROM photos WHERE id = $1', [req.params.id]);
    
    if (photoResult.rows.length === 0) {
      await pool.end();
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete the file from uploads directory
    const imageUrl = photoResult.rows[0].image_url;
    const filePath = path.join(__dirname, '..', '..', imageUrl);
    fs.unlinkSync(filePath);

    // Delete from database
    await pool.query('DELETE FROM photos WHERE id = $1', [req.params.id]);
    await pool.end();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
}); 