import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Server is running!
  📡 URL: http://localhost:${PORT}
  🛠️  Health Check: http://localhost:${PORT}/api/auth/login (Send a POST)
  `);
});