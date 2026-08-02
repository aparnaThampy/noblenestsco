-- database/schema.sql

CREATE TABLE homepage_sections (
  id VARCHAR(255) PRIMARY KEY,
  section_id VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  theme VARCHAR(50) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  company VARCHAR(255),
  city VARCHAR(100),
  investor_type VARCHAR(100),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  image_url VARCHAR(500),
  property_purchased VARCHAR(255),
  purchase_year INT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_links (
  id VARCHAR(255) PRIMARY KEY,
  platform VARCHAR(100) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  display_name VARCHAR(100),
  icon VARCHAR(100),
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_settings (
  id VARCHAR(255) PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_settings (
  id VARCHAR(255) PRIMARY KEY,
  whatsapp_number VARCHAR(50),
  phone_number VARCHAR(50),
  email VARCHAR(255),
  office_address TEXT,
  google_maps_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
