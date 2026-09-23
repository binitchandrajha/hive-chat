import { useEffect, useState } from 'react';
import { socket } from './socket';

export default function App() {
  const [user] = useState(() => `user-${Math.floor(Math.random() * 1000)}`);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('message', (message) => setMessages((prev) => [...prev, message]));
    return () => socket.off('message');
  }, []);

  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('message', { user, text: text.trim() });
    setText('');
  }

  return (
    <div className="app">
      <h1>Hive Chat — web ({user})</h1>

      <ul className="messages">
        {messages.map((m) => (
          <li key={m.id}>
            <strong>{m.user}: </strong>
            {m.text}
          </li>
        ))}
      </ul>

      <form onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
