import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { io, type Socket } from 'socket.io-client';

import type {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from './src/types/chat';

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Android emulator: 10.0.2.2 = host machine. Real device: apni LAN IP daalo.
const API_URL: string =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export default function App() {
  const socket = useMemo<ChatSocket>(() => io(API_URL, { transports: ['websocket'] }), []);
  const [user] = useState<string>(() => `mobile-${Math.floor(Math.random() * 1000)}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>('');

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

  function send(): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit('message', { user, text: trimmed });
    setText('');
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Hive Chat — mobile ({user})</Text>

        <FlatList<ChatMessage>
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Text style={styles.message}>
              <Text style={styles.sender}>{item.user}: </Text>
              {item.text}
            </Text>
          )}
        />

        <SafeAreaView style={styles.composer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            placeholder="Type a message"
            placeholderTextColor="#8d94a8"
            returnKeyType="send"
          />
          <Pressable style={styles.button} onPress={send}>
            <Text style={styles.buttonText}>Send</Text>
          </Pressable>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f1117' },
  title: { color: '#e6e8ef', fontSize: 18, fontWeight: '700', padding: 16 },
  list: { padding: 16, gap: 8 },
  message: { color: '#e6e8ef', fontSize: 15 },
  sender: { fontWeight: '700' },
  composer: { flexDirection: 'row', gap: 8, padding: 16 },
  input: {
    flex: 1,
    backgroundColor: '#1f2430',
    borderWidth: 1,
    borderColor: '#262b38',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e6e8ef',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
