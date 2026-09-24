import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { io, type Socket } from 'socket.io-client';

import type { ChatMessage, ClientToServerEvents, ServerToClientEvents } from '../types/chat';

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Android emulator: 10.0.2.2 = host machine. Real device: use your LAN IP.
const API_URL: string = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export interface UseMessages {
  messages: ChatMessage[];
  send: (text: string) => void;
}

/** Live message list over Socket.io (moved from the original App.tsx scaffold). */
export function useMessages(user: string): UseMessages {
  const socket = useMemo<ChatSocket>(() => io(API_URL, { transports: ['websocket'] }), []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const onMessage = (message: ChatMessage): void => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on('message', onMessage);
    return () => {
      socket.off('message', onMessage);
      socket.close();
    };
  }, [socket]);

  const send = useCallback(
    (text: string): void => {
      const trimmed = text.trim();
      if (trimmed) socket.emit('message', { user, text: trimmed });
    },
    [socket, user],
  );

  return { messages, send };
}
