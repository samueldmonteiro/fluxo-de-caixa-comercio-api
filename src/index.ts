import app from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API rodando firme na porta ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}/api`);
  console.log(`📚 Docs: http://localhost:${PORT}/docs`);
});
