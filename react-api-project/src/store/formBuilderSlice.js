import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const saveForm = createAsyncThunk('formBuilder/saveForm', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://192.168.1.6:3000/api/forms/save', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to save form');
  }
});

export const loadForm = createAsyncThunk('formBuilder/loadForm', async (formId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://192.168.1.6:3000/api/forms/${formId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to load form');
  }
});

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState: {
    fields: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addField: (state, action) => {
      state.fields.push(action.payload);
    },
    updateField: (state, action) => {
      const { id, updates } = action.payload;
      const field = state.fields.find((f) => f.id === id);
      if (field) {
        Object.assign(field, updates);
      }
    },
    removeField: (state, action) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
    },
    clearForm: (state) => {
      state.fields = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveForm.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadForm.fulfilled, (state, action) => {
        state.fields = action.payload.fields;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loadForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addField, updateField, removeField, clearForm } = formBuilderSlice.actions;
export default formBuilderSlice.reducer;