-- Postgres schema for CollegeSportsInventory

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(16) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- allowed_emails (admin allowlist)
CREATE TABLE allowed_emails (
  email VARCHAR(255) PRIMARY KEY,
  added_by UUID REFERENCES users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- sports (categories)
CREATE TABLE sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- holders (persons who can hold items)
CREATE TABLE holders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  roll VARCHAR(64),
  contact VARCHAR(255),
  is_club_member BOOLEAN DEFAULT true
);

-- products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
  name VARCHAR(1024) NOT NULL,
  serial_or_tag VARCHAR(255),
  date_added DATE,
  status VARCHAR(32) NOT NULL DEFAULT 'INVENTORY',
  current_holder_id UUID REFERENCES holders(id),
  last_used_by_holder_id UUID REFERENCES holders(id),
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- immutable audit log for products
CREATE TABLE product_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  action VARCHAR(32) NOT NULL,
  holder_id UUID REFERENCES holders(id),
  by_user_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- inventory keys
CREATE TABLE inventory_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name VARCHAR(255) NOT NULL,
  current_holder_id UUID REFERENCES holders(id),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- key handover history
CREATE TABLE key_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_id UUID REFERENCES inventory_keys(id) ON DELETE CASCADE,
  from_holder_id UUID REFERENCES holders(id),
  to_holder_id UUID REFERENCES holders(id),
  by_user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Indexes
CREATE INDEX idx_products_sport_id ON products(sport_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_product_history_product_id ON product_history(product_id);
CREATE INDEX idx_holders_roll ON holders(roll);

-- Example check constraints for status and roles
ALTER TABLE products
  ADD CONSTRAINT products_status_check CHECK (status IN ('INVENTORY','SPORTS_COMPLEX','WITH_PERSON','DELETED'));

ALTER TABLE users
  ADD CONSTRAINT users_role_check CHECK (role IN ('admin','viewer'));
