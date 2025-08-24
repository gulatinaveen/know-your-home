const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Initialize database with tables and data
async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create brands table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        centralized_helpdesk BOOLEAN DEFAULT false,
        has_mobile_app BOOLEAN DEFAULT false,
        mobile_app_link TEXT,
        official_website TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create brand_contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brand_contacts (
        id SERIAL PRIMARY KEY,
        brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
        region VARCHAR(100) DEFAULT 'All India',
        helpline_1 VARCHAR(50),
        helpline_2 VARCHAR(50),
        whatsapp_1 VARCHAR(20),
        whatsapp_2 VARCHAR(20),
        email_1 VARCHAR(255),
        email_2 VARCHAR(255),
        warranty_link TEXT,
        last_verified_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(brand_id, region)
      )
    `);

    // Insert categories
    const categories = [
      ['Electronics', 'electronics'],
      ['Kitchen Appliances', 'kitchen-appliances'],
      ['Furniture', 'furniture'],
      ['Bath Fittings', 'bath-fittings'],
      ['Lighting & Fixtures', 'lighting-fixtures'],
      ['Home Security Systems', 'home-security'],
      ['Heating & Cooling Systems', 'heating-cooling'],
      ['Cleaning Appliances', 'cleaning-appliances'],
      ['Water Purifiers', 'water-purifiers'],
      ['Smart Home Devices', 'smart-home']
    ];

    for (const [name, slug] of categories) {
      await pool.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [name, slug]
      );
    }

    // Insert brands with real Indian data
    const brands = [
      { name: 'Samsung', helpdesk: true, app: true, website: 'https://www.samsung.com/in/' },
      { name: 'LG', helpdesk: true, app: true, website: 'https://www.lg.com/in' },
      { name: 'Whirlpool', helpdesk: true, app: false, website: 'https://www.whirlpool.co.in/' },
      { name: 'Godrej', helpdesk: false, app: false, website: 'https://www.godrej.com/' },
      { name: 'Daikin', helpdesk: true, app: true, website: 'https://www.daikin.co.in/' },
      { name: 'Voltas', helpdesk: true, app: false, website: 'https://www.voltas.com/' },
      { name: 'Blue Star', helpdesk: true, app: false, website: 'https://www.bluestarindia.com/' },
      { name: 'Panasonic', helpdesk: true, app: false, website: 'https://www.panasonic.com/in/' },
      { name: 'Sony', helpdesk: true, app: true, website: 'https://www.sony.co.in/' },
      { name: 'Philips', helpdesk: true, app: true, website: 'https://www.philips.co.in/' },
      { name: 'Havells', helpdesk: false, app: false, website: 'https://www.havells.com/' },
      { name: 'Kent RO', helpdesk: true, app: false, website: 'https://www.kent.co.in/' },
      { name: 'IFB', helpdesk: true, app: false, website: 'https://www.ifbappliances.com/' },
      { name: 'Bosch', helpdesk: true, app: false, website: 'https://www.bosch-home.in/' },
      { name: 'Carrier', helpdesk: true, app: false, website: 'https://www.carrierindia.com/' }
    ];

    for (const brand of brands) {
      const result = await pool.query(
        `INSERT INTO brands (name, centralized_helpdesk, has_mobile_app, official_website) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (name) DO UPDATE 
         SET centralized_helpdesk = $2, has_mobile_app = $3, official_website = $4
         RETURNING id`,
        [brand.name, brand.helpdesk, brand.app, brand.website]
      );
    }

    // Insert brand contacts with real helpline numbers
    const contacts = [
      { brand: 'Samsung', helpline: '1800-40-7267864', whatsapp: '9169600600', email: 'support.india@samsung.com' },
      { brand: 'LG', helpline: '1800-315-9999', whatsapp: '8826688266', email: 'lgcareindia@lge.com' },
      { brand: 'Whirlpool', helpline: '1800-208-1800', whatsapp: '9643095709', email: 'whirlpool.care@whirlpool.com' },
      { brand: 'Godrej', helpline: '1800-209-5511', email: 'service@godrej.com' },
      { brand: 'Daikin', helpline: '1800-200-1818', whatsapp: '7066001818', email: 'customercare@daikinindia.com' },
      { brand: 'Voltas', helpline: '1800-425-4555', email: 'customer.care@voltas.com' },
      { brand: 'Blue Star', helpline: '1800-209-1177', email: 'customer@bluestarindia.com' },
      { brand: 'Panasonic', helpline: '1800-108-1333', email: 'customercare@in.panasonic.com' },
      { brand: 'Sony', helpline: '1800-103-7799', email: 'sonyindia.care@sony.com' },
      { brand: 'Philips', helpline: '1800-102-2929', whatsapp: '9133332929', email: 'customercare.india@philips.com' },
      { brand: 'Havells', helpline: '1800-11-0303', email: 'customercare@havells.com' },
      { brand: 'Kent RO', helpline: '9278-912-345', whatsapp: '9278912345', email: 'service@kent.co.in' },
      { brand: 'IFB', helpline: '1860-425-5678', whatsapp: '9133332255', email: 'customersupport@ifbglobal.com' },
      { brand: 'Bosch', helpline: '1800-266-1880', email: 'service.in@bosch-home.com' },
      { brand: 'Carrier', helpline: '1800-315-7575', email: 'customercare@carrier.utc.com' }
    ];

    for (const contact of contacts) {
      const brandResult = await pool.query('SELECT id FROM brands WHERE name = $1', [contact.brand]);
      if (brandResult.rows.length > 0) {
        await pool.query(
          `INSERT INTO brand_contacts (brand_id, region, helpline_1, whatsapp_1, email_1) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (brand_id, region) DO UPDATE 
           SET helpline_1 = $3, whatsapp_1 = $4, email_1 = $5`,
          [brandResult.rows[0].id, 'All India', contact.helpline, contact.whatsapp || null, contact.email]
        );
      }
    }

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Root endpoint
app.get('/', async (req, res) => {
  try {
    const brandCount = await pool.query('SELECT COUNT(*) FROM brands');
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    
    res.json({
      message: 'Know Your Home API',
      version: '3.0.0',
      status: 'running',
      database: 'connected',
      stats: {
        brands: brandCount.rows[0].count,
        categories: categoryCount.rows[0].count
      },
      endpoints: {
        health: '/health',
        brands: '/api/brands',
        brand: '/api/brands/:id',
        categories: '/api/categories',
        search: '/api/brands/search?q=samsung',
        dbTest: '/api/db-test'
      }
    });
  } catch (err) {
    res.json({
      message: 'Know Your Home API',
      status: 'running',
      database: 'error',
      error: err.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, COUNT(*) as brands FROM brands');
    res.json({
      database: 'connected',
      time: result.rows[0].time,
      totalBrands: result.rows[0].brands
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all brands with contacts
app.get('/api/brands', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', bc.id,
              'region', bc.region,
              'helpline_1', bc.helpline_1,
              'helpline_2', bc.helpline_2,
              'whatsapp_1', bc.whatsapp_1,
              'email_1', bc.email_1,
              'warranty_link', bc.warranty_link
            )
          ) FILTER (WHERE bc.id IS NOT NULL), 
          '[]'
        ) as contacts
      FROM brands b
      LEFT JOIN brand_contacts bc ON b.id = bc.brand_id
      WHERE b.active = true
      GROUP BY b.id
      ORDER BY b.name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single brand
app.get('/api/brands/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', bc.id,
              'region', bc.region,
              'helpline_1', bc.helpline_1,
              'helpline_2', bc.helpline_2,
              'whatsapp_1', bc.whatsapp_1,
              'whatsapp_2', bc.whatsapp_2,
              'email_1', bc.email_1,
              'email_2', bc.email_2,
              'warranty_link', bc.warranty_link
            )
          ) FILTER (WHERE bc.id IS NOT NULL), 
          '[]'
        ) as contacts
      FROM brands b
      LEFT JOIN brand_contacts bc ON b.id = bc.brand_id
      WHERE b.id = $1 AND b.active = true
      GROUP BY b.id
    `, [req.params.id]);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search brands
app.get('/api/brands/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([]);
  }
  
  try {
    const result = await pool.query(
      `SELECT * FROM brands 
       WHERE LOWER(name) LIKE LOWER($1) 
       AND active = true 
       ORDER BY name`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new brand
app.post('/api/brands', async (req, res) => {
  const { name, centralized_helpdesk, has_mobile_app, official_website } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO brands (name, centralized_helpdesk, has_mobile_app, official_website) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, centralized_helpdesk || false, has_mobile_app || false, official_website]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Initialize database on startup
initDatabase();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});
