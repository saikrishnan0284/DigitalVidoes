import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  onlineUsers: [],
  typingUsers: {}
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      const exists = state.conversations.find(c => c._id === action.payload._id);
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setTypingUser: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[conversationId] = userId;
      } else {
        delete state.typingUsers[conversationId];
      }
    }
  }
});

export const {
  setConversations,
  addConversation,
  setMessages,
  addMessage,
  setActiveConversation,
  setOnlineUsers,
  setTypingUser
} = chatSlice.actions;

export default chatSlice.reducer;
