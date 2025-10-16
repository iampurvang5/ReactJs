import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import formBuilderReducer from './formBuilderSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    formBuilder: formBuilderReducer,
  },
});

export default store;