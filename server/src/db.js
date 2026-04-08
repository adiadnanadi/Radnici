import pg from 'pg';

const { Pool } = pg;

const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
        mode: 'require'
      }
    })
  : null;

if (pool) {
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });
  
  pool.on('error', (err) => {
    console.error('PostgreSQL error:', err);
  });
}

export const initDatabase = async () => {
  if (!pool) {
    console.log('⚠️ No database connection - DATABASE_URL not set');
    return;
  }
  
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT 1 as test');
    console.log('Database connection test:', result.rows);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "userType" VARCHAR(50) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS worker_profiles (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        whatsapp VARCHAR(50),
        location VARCHAR(255),
        category VARCHAR(100),
        subcategory VARCHAR(100),
        description TEXT,
        "hourlyRate" DECIMAL(10,2) DEFAULT 0,
        "experienceYears" INTEGER DEFAULT 0,
        availability VARCHAR(50) DEFAULT 'AVAILABLE',
        "serviceArea" TEXT[],
        languages TEXT[],
        "avatarUrl" VARCHAR(500),
        "coverImageUrl" VARCHAR(500),
        "galleryImages" TEXT[],
        "isVerified" BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        skills TEXT[],
        rating DECIMAL(3,2) DEFAULT 0,
        "reviewCount" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        "workerId" INTEGER REFERENCES worker_profiles(id) ON DELETE CASCADE,
        "clientId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "workerId" INTEGER REFERENCES worker_profiles(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "workerId")
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        "senderId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "receiverId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "workerId" INTEGER REFERENCES worker_profiles(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
};

export default pool;