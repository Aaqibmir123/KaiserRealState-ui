import { createSlice } from '@reduxjs/toolkit';

type FeedbackType = 'success' | 'error' | 'info';

type FeedbackState = {
  visible: boolean;
  title: string;
  message: string;
  type: FeedbackType;
};

const initialState: FeedbackState = {
  visible: false,
  title: '',
  message: '',
  type: 'info'
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    showFeedback(state: FeedbackState, action: any) {
      const { title, message, type = 'info' } = action.payload ?? {};
      state.visible = true;
      state.title = title ?? 'Notice';
      state.message = message ?? '';
      state.type = type;
    },
    hideFeedback(state: FeedbackState) {
      state.visible = false;
    }
  }
});

export const { showFeedback, hideFeedback } = feedbackSlice.actions;
export const feedbackReducer = feedbackSlice.reducer;
export type { FeedbackType };
