-- Fix: Add search_path to update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix: Add restrictive policy for payments table (backend-only access)
CREATE POLICY "Payments are not accessible via API"
ON public.payments
FOR SELECT
USING (false);