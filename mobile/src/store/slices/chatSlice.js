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
    }
  }
});

export const {
  setConversations,
  addMessage,
  setActiveConversation,
  setOnlineUsers
} = chatSlice.actions;

export default chatSlice.reducer;
