-- schema.sql
-- Run this in your Supabase SQL editor to set up the tables and RLS

CREATE TABLE public.todos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    is_complete boolean DEFAULT false NOT NULL,
    reminder_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own todos" 
ON public.todos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
ON public.todos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON public.todos FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON public.todos FOR DELETE 
USING (auth.uid() = user_id);
