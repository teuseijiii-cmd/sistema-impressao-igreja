import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import { fileRoutes } from './routes/fileRoutes';
import { printerRoutes } from './routes/printerRoutes';
import { driveRoutes } from './routes/driveRoutes';
import { categorizerRoutes } from './routes/categorizerRoutes';
import { authRoutes } from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rotas
app.use('/api/files', fileRoutes);
app.use('/api/printer', printerRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/categorizer', categorizerRoutes);
app.use('/api/auth', authRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportar para testes
export default app;
