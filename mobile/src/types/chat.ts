/** A chat message as broadcast by the server. */
export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  /** ISO 8601 timestamp set by the server. */
  at: string;
}

/** What the client sends when posting a message. */
export interface NewMessagePayload {
  user: string;
  text: string;
}

/** Events the server emits to the client. */
export interface ServerToClientEvents {
  message: (message: ChatMessage) => void;
}

/** Events the client emits to the server. */
export interface ClientToServerEvents {
  message: (payload: NewMessagePayload) => void;
}
