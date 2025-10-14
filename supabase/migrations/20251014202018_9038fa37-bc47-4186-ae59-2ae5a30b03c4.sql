-- Enable Row Level Security on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products: Allow public read access, no write access
CREATE POLICY "Products are publicly readable"
ON public.products
FOR SELECT
USING (true);

-- Customers: No public access (data should only be created by backend)
-- No policies means no one can access this data through the API

-- Payments: No public access (data should only be created by backend)
-- No policies means no one can access this data through the API

-- Orders: No public access (data should only be created by backend)
-- No policies means no one can access this data through the API