import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'postgres', // Connect to default postgres database first
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    // Create database if it doesn't exist
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created successfully`);
  } catch (err) {
    if (err instanceof Error && err.message.includes('already exists')) {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.release();
  }

  // Close the connection to postgres database
  await pool.end();

  // Create a new connection to the photo_gallery database
  const dbPool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
  });

  const dbClient = await dbPool.connect();

  try {
    // Read and execute the schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          // Skip comments
          if (statement.startsWith('--')) continue;
          
          await dbClient.query(statement);
        } catch (err) {
          console.error('Error executing statement:', statement);
          console.error('Error:', err);
        }
      }
    }
    
    // Execute the function creation separately
    const functionSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    try {
      await dbClient.query(functionSQL);
      console.log('Function created successfully');
    } catch (err) {
      console.error('Error creating function:', err);
    }
    
    // Create the trigger
    const triggerSQL = `
      CREATE TRIGGER update_photos_updated_at
      BEFORE UPDATE ON photos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `;
    
    try {
      await dbClient.query(triggerSQL);
      console.log('Trigger created successfully');
    } catch (err) {
      console.error('Error creating trigger:', err);
    }
    
    console.log('Database schema created successfully');
  } catch (err) {
    console.error('Error creating schema:', err);
  } finally {
    await dbClient.release();
    await dbPool.end();
  }
}

setupDatabase().catch(console.error); 