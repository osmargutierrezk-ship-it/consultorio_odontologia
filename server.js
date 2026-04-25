// server.js
require('dotenv').config();

const { execSync } = require('child_process');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    console.log('⏳ Generando Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('⏳ Sincronizando base de datos...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

    console.log('✅ Base de datos lista');
  } catch (err) {
    console.error('❌ Error al inicializar DB:', err.message);
    // No exit — allow running even if DB fails (for debugging)
  }

  app.listen(PORT, () => {
    console.log(`🌿 LumiPlus corriendo en http://localhost:${PORT}`);
  });
}

bootstrap();
