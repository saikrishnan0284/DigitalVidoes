import { io } from 'socket.io-client';
import { store } from '@store';
import { addMessage, setOnlineUsers, setTypingUser } from '@store/slices/chatSlice';
import { addNotification } from '@store/slices/notificationSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    // Chat events
    this.socket.on('message:new', (message) => {
      store.dispatch(addMessage({
        conversationId: message.conversationId,
        message
      }));
    });

    this.socket.on('user:typing', ({ conversationId, userId }) => {
      store.dispatch(setTypingUser({ conversationId, userId, isTyping: true }));
    });

    this.socket.on('user:stop-typing', ({ conversationId, userId }) => {
      store.dispatch(setTypingUser({ conversationId, userId, isTyping: false }));
    });

    this.socket.on('users:online', (users) => {
      store.dispatch(setOnlineUsers(users));
    });

    // Notification events
    this.socket.on('notification:new', (notification) => {
      store.dispatch(addNotification(notification));
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Chat methods
  sendMessage(conversationId, content, type = 'text') {
    if (!this.socket) return;
    this.socket.emit('message:send', { conversationId, content, type });
  }

  startTyping(conversationId) {
    if (!this.socket) return;
    this.socket.emit('user:typing', { conversationId });
  }

  stopTyping(conversationId) {
    if (!this.socket) return;
    this.socket.emit('user:stop-typing', { conversationId });
  }

  joinConversation(conversationId) {
    if (!this.socket) return;
    this.socket.emit('conversation:join', { conversationId });
  }

  leaveConversation(conversationId) {
    if (!this.socket) return;
    this.socket.emit('conversation:leave', { conversationId });
  }

  // Event methods
  joinEvent(eventId) {
    if (!this.socket) return;
    this.socket.emit('event:join', { eventId });
  }

  leaveEvent(eventId) {
    if (!this.socket) return;
    this.socket.emit('event:leave', { eventId });
  }
}

export default new SocketService();
