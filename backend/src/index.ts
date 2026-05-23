import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const SUPABASE_URL: string = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY || '';

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/documents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    const { data, error } = await supabase
      .from('documents')
      .insert([{ title, content }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/documents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
