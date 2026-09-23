# Hive Chat

Real-time chat boilerplate — teen apps, ek Socket.io backend.

```
hive-chat/
├── server/   Node + Express + Socket.io + MongoDB (mongoose)
├── web/      React (Vite) + socket.io-client
└── mobile/   React Native (Expo) + socket.io-client
```

Abhi sirf skeleton hai: ek `message` event jo sabko broadcast hota hai.
Auth, rooms, message persistence, typing indicators — ye sab aage khud add karna hai.

## 1. Server

MongoDB local chalna chahiye (`brew services start mongodb-community`).

```bash
cd server && npm install && npm run dev
```

- `http://localhost:4000/health` → `{ "ok": true }`
- Config `server/.env` me (`PORT`, `MONGO_URI`)

## 2. Web

```bash
cd web && npm install && npm run dev
```

`http://localhost:5173` khulega. Backend URL `web/.env` ke `VITE_API_URL` se aata hai.

## 3. Mobile (Expo)

```bash
cd mobile && npm install && npx expo start
```

- Android emulator host machine ko `10.0.2.2` pe dekhta hai — `App.js` me already handled.
- Real device pe test karna ho toh `App.js` me `API_URL` apni LAN IP kar do (e.g. `http://192.168.1.5:4000`).

## Aage kya add karna hai

- Auth: `User` model + JWT, socket handshake me token verify
- Rooms/conversations: `Room` model, `socket.join(roomId)`, room-scoped broadcast
- Persistence: `Message` model + REST route se history load
- Typing indicator, online presence, read receipts
