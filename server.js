import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { ensureEnvAdmin } from './src/services/bootstrapService.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await ensureEnvAdmin();
  app.listen(PORT, () => console.log(`HCM Lite running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
