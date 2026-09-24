import http from 'node:http';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { createSocketServer } from './socket.js';

async function main(): Promise<void> {
  await mongoose.connect(env.MONGO_URI);
  console.log('[db] connected:', mongoose.connection.name);

  const server = http.createServer(createApp());
  createSocketServer(server);
  server.listen(env.PORT, () => console.log(`[server] http://localhost:${env.PORT}`));
}

main().catch((err: unknown) => {
  console.error('[server] failed to start', err);
  process.exit(1);
});
