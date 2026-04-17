import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    hcp_name: '',
    interaction_type: '',
    date: '',
    time: '',
    attendees: [],
    topics: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: '',
    outcomes: '',
    follow_up: '',
  },
  chatHistory: [
    { sender: 'ai', text: 'Hello! I am your AI CRM Assistant. How can I help you log this interaction?' }
  ],
  isLoading: false,
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { updateFormData, addChatMessage, setLoading } = interactionSlice.actions;
export default interactionSlice.reducer;
