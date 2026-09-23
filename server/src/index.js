import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hive-chat';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('[socket] connected:', socket.id);

  // Client emits: socket.emit('message', { user, text })
  socket.on('message', (payload) => {
    io.emit('message', { ...payload, id: socket.id + Date.now(), at: new Date().toISOString() });
  });

  socket.on('disconnect', () => console.log('[socket] disconnected:', socket.id));
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('[db] connected:', mongoose.connection.name);
    server.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[db] connection failed', err.message);
    process.exit(1);
  });
