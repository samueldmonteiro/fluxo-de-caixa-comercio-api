import 'dotenv/config';
import 'reflect-metadata';
import app from './app';

const PORT = process.env.PORT || 3000;


if (process.env.VERCEL_ENV != 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 API rodando firme na porta ${PORT}`);
    console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);
    console.log('Docs available on http://localhost:3000/docs');
  });

}

export default app;