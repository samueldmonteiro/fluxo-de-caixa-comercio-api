import 'dotenv/config';
import 'reflect-metadata';
import app from './app';
import { setupSwagger } from './config/swagger';

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`🚀 API rodando firme na porta ${PORT}`);
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);
  console.log('Docs available on http://localhost:3000/docs');
});