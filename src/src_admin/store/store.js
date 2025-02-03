import { configureStore } from '@reduxjs/toolkit';
// import { legacy_createStore as createStore } from 'redux'

import loginReducer from './loginReducer'
import themeReducer from './themeReducer';


const store = configureStore( {
  reducer : {
    auth: loginReducer,
    theme: themeReducer 
  },
})

export default store;
 